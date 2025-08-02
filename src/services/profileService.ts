import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { db, storage, auth } from '../firebase';
import { UserProfile, ProfileFormData } from '../types/profile.types';

export class ProfileService {
  private static instance: ProfileService;

  static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  /**
   * Create initial profile when user signs up
   */
  async createInitialProfile(data: {
    uid: string;
    email: string;
    fullNameEN: string;
    emailVerified: boolean;
    role: 'user' | 'admin' | 'super-admin';
    displayName?: string;
    photoURL?: string;
  }): Promise<void> {
    try {
      // Admin users have complete profiles by default
      const isAdminUser = data.role === 'admin' || data.role === 'super-admin';
      
      const profile: Omit<UserProfile, 'createdAt' | 'updatedAt' | 'lastLoginAt'> = {
        uid: data.uid,
        email: data.email,
        emailVerified: data.emailVerified,
        role: data.role,
        displayName: data.displayName,
        fullNameEN: data.fullNameEN,
        fullNameTH: isAdminUser ? data.fullNameEN : '', // Use English name as Thai name for admins
        birthDate: isAdminUser ? new Date('1990-01-01') : new Date('2000-01-01'), // Default birth date
        age: isAdminUser ? this.calculateAge(new Date('1990-01-01')) : 0, // Calculate age for admins
        phoneNumber: isAdminUser ? '+66000000000' : '', // Default phone for admins
        nationality: 'Thailand',
        isProfileComplete: isAdminUser, // Admin profiles are complete by default
        ...(data.photoURL && { photoURL: data.photoURL })
      };

      await setDoc(doc(db, 'profiles', data.uid), {
        ...profile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error creating initial profile:', error);
      throw error;
    }
  }

  /**
   * Create a new user profile
   */
  async createProfile(profileData: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const profile: UserProfile = {
        ...profileData,
        uid: user.uid,
        age: this.calculateAge(profileData.birthDate),
        isProfileComplete: this.validateProfileComplete({
          ...profileData,
          uid: user.uid,
          age: this.calculateAge(profileData.birthDate),
          createdAt: new Date(),
          updatedAt: new Date()
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'profiles', user.uid), {
        ...profile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Update Firebase Auth profile
      const authUpdates: any = {
        displayName: profile.fullNameEN
      };
      
      if (profile.photoURL) {
        authUpdates.photoURL = profile.photoURL;
      }
      
      await updateProfile(user, authUpdates);

    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  /**
   * Update existing user profile
   */
  async updateProfile(profileData: Partial<UserProfile>): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // Calculate age if birthDate is provided
      if (profileData.birthDate) {
        profileData.age = this.calculateAge(profileData.birthDate);
      }

      // Get current profile to check completeness
      const currentProfile = await this.getProfile(user.uid);
      if (currentProfile) {
        const updatedProfile = { ...currentProfile, ...profileData };
        profileData.isProfileComplete = this.validateProfileComplete(updatedProfile);
      }

      // Remove undefined values from updateData
      const updateData: any = {
        updatedAt: serverTimestamp()
      };
      
      // Only add fields that are not undefined
      Object.keys(profileData).forEach(key => {
        const value = (profileData as any)[key];
        if (value !== undefined) {
          updateData[key] = value;
        }
      });

      await updateDoc(doc(db, 'profiles', user.uid), updateData);

      // Update Firebase Auth profile if display name or photo changed
      const authUpdates: any = {};
      if (profileData.fullNameEN) {
        authUpdates.displayName = profileData.fullNameEN;
      }
      if (profileData.photoURL !== undefined && profileData.photoURL !== null) {
        authUpdates.photoURL = profileData.photoURL;
      }

      if (Object.keys(authUpdates).length > 0) {
        await updateProfile(user, authUpdates);
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Get user profile by UID
   */
  async getProfile(uid: string): Promise<UserProfile | null> {
    try {
      const profileDoc = await getDoc(doc(db, 'profiles', uid));
      
      if (profileDoc.exists()) {
        const data = profileDoc.data();
        const profile = {
          ...data,
          birthDate: data.birthDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as UserProfile;

        // Fix profile completion status if it's incorrect
        const actuallyComplete = this.validateProfileComplete(profile);
        if (profile.isProfileComplete !== actuallyComplete) {
          console.log(`Fixing profile completion status for user ${uid}: ${profile.isProfileComplete} -> ${actuallyComplete}`);
          // Update the profile completion status in the database
          await this.updateProfileCompletionStatus(uid, actuallyComplete);
          profile.isProfileComplete = actuallyComplete;
        }

        return profile;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  /**
   * Get current user's profile
   */
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    const user = auth.currentUser;
    if (!user) return null;
    
    return this.getProfile(user.uid);
  }

  /**
   * Upload profile photo
   */
  async uploadProfilePhoto(file: File): Promise<string> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // Validate file
      this.validatePhotoFile(file);

      // Delete existing photo if it exists
      const currentProfile = await this.getCurrentUserProfile();
      if (currentProfile?.photoURL) {
        await this.deleteProfilePhoto(currentProfile.photoURL);
      }

      // Upload new photo
      const photoRef = ref(storage, `profiles/${user.uid}/photo_${Date.now()}`);
      const snapshot = await uploadBytes(photoRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      throw error;
    }
  }

  /**
   * Delete profile photo
   */
  async deleteProfilePhoto(photoURL: string): Promise<void> {
    try {
      // Extract the path from the URL and delete from storage
      const photoRef = ref(storage, photoURL);
      await deleteObject(photoRef);
    } catch (error) {
      // Don't throw error if file doesn't exist
      console.warn('Error deleting profile photo:', error);
    }
  }

  /**
   * Validate if profile is complete based on actual field values
   */
  validateProfileComplete(profile: UserProfile): boolean {
    // Admin users are always considered to have complete profiles
    if (profile.role === 'admin' || profile.role === 'super-admin') {
      return true;
    }
    
    // Check required fields
    const hasRequiredFields = !!(
      profile.fullNameEN && 
      profile.fullNameEN.trim().length > 0 &&
      profile.email && 
      profile.email.trim().length > 0 &&
      profile.phoneNumber && 
      profile.phoneNumber.trim().length > 0
    );

    // Handle birthDate - support Firestore Timestamp
    let hasBirthDate = false;
    if (profile.birthDate) {
      let birthYear;
      if (profile.birthDate instanceof Date) {
        birthYear = profile.birthDate.getFullYear();
      } else if ((profile.birthDate as any).toDate) {
        birthYear = (profile.birthDate as any).toDate().getFullYear();
      }
      
      if (birthYear) {
        hasBirthDate = birthYear >= 1900 && birthYear <= new Date().getFullYear();
      }
    }

    return hasRequiredFields && hasBirthDate;
  }

  /**
   * Update profile completion status in database
   */
  private async updateProfileCompletionStatus(uid: string, isComplete: boolean): Promise<void> {
    try {
      await updateDoc(doc(db, 'profiles', uid), {
        isProfileComplete: isComplete,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating profile completion status:', error);
    }
  }

  /**
   * Calculate age from birth date
   */
  calculateAge(birthDate: Date): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Validate photo file
   */
  private validatePhotoFile(file: File): void {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPEG, PNG, and WebP images are allowed');
    }
  }

  /**
   * Create profile from form data
   */
  async createProfileFromForm(formData: ProfileFormData): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user found');
      }

      let photoURL: string | undefined;

      // Upload photo if provided
      if (formData.photoFile) {
        photoURL = await this.uploadProfilePhoto(formData.photoFile);
      }

      const profileData: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'> = {
        email: user.email!,
        emailVerified: user.emailVerified,
        role: 'user',
        displayName: formData.fullNameEN,
        fullNameEN: formData.fullNameEN,
        fullNameTH: formData.fullNameTH,
        birthDate: new Date(formData.birthDate),
        age: this.calculateAge(new Date(formData.birthDate)),
        phoneNumber: formData.phoneNumber,
        nationality: 'Thailand',
        isProfileComplete: true,
        lastLoginAt: new Date(),
        ...(photoURL && { photoURL })
      };

      await this.createProfile(profileData);
    } catch (error) {
      console.error('Error creating profile from form:', error);
      throw error;
    }
  }

  /**
   * Update profile from form data
   */
  async updateProfileFromForm(formData: ProfileFormData): Promise<void> {
    try {
      let photoURL: string | undefined;

      // Upload photo if provided
      if (formData.photoFile) {
        photoURL = await this.uploadProfilePhoto(formData.photoFile);
      }

      const updateData: Partial<UserProfile> = {
        fullNameEN: formData.fullNameEN,
        fullNameTH: formData.fullNameTH,
        birthDate: new Date(formData.birthDate),
        phoneNumber: formData.phoneNumber
      };

      if (photoURL !== undefined) {
        updateData.photoURL = photoURL;
      }

      await this.updateProfile(updateData);
    } catch (error) {
      console.error('Error updating profile from form:', error);
      throw error;
    }
  }

  /**
   * Force refresh profile completion status for current user
   * This is useful for fixing existing profiles that may have incorrect completion status
   */
  async refreshProfileCompletionStatus(): Promise<boolean> {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('No authenticated user found');
        return false;
      }

      const profile = await this.getProfile(user.uid);
      if (!profile) {
        console.log('No profile found for user');
        return false;
      }

      // The getProfile method already handles fixing the completion status
      // So just calling it will trigger the fix if needed
      console.log('Profile completion status refreshed for user:', user.uid);
      return profile.isProfileComplete;
    } catch (error) {
      console.error('Error refreshing profile completion status:', error);
      return false;
    }
  }
}

// Export singleton instance
export const profileService = ProfileService.getInstance();
