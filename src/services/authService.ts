import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification as firebaseSendEmailVerification,
  onAuthStateChanged,
  User,
  UserCredential,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { profileService } from './profileService';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  emailVerified: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  role: 'user' | 'admin';
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    nationality?: string;
    organization?: string;
  };
}

export interface AuthError {
  code: string;
  message: string;
}

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private authStateListeners: ((user: User | null) => void)[] = [];

  constructor() {
    // Listen to auth state changes
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      this.authStateListeners.forEach(listener => listener(user));
    });
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Register a new user with email and password
   */
  async signUp(
    email: string, 
    password: string, 
    displayName?: string
  ): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name if provided
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }

      // Send email verification
      await this.sendEmailVerification();

      // Create user profile in Firestore
      await this.createUserProfile(userCredential.user, displayName);

      return userCredential;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login time
      await this.updateLastLogin(userCredential.user.uid);
      
      return userCredential;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Send email verification to current user with custom action code settings
   */
  async sendEmailVerification(continueUrl?: string): Promise<void> {
    try {
      if (!auth.currentUser) {
        throw new Error('No user is currently signed in');
      }
      
      // Log attempt for debugging
      console.log('Attempting to send email verification to:', auth.currentUser.email);
      console.log('User email verified status:', auth.currentUser.emailVerified);
      
      // Import config dynamically to avoid circular dependencies
      const { getEmailVerificationSettings } = await import('../config/emailVerification');
      const actionCodeSettings = getEmailVerificationSettings(continueUrl);
      
      console.log('Using action code settings:', actionCodeSettings);
      
      await firebaseSendEmailVerification(auth.currentUser, actionCodeSettings);
      
      console.log('Email verification sent successfully to:', auth.currentUser.email);
    } catch (error: any) {
      console.error('Email verification error:', {
        code: error.code,
        message: error.message,
        email: auth.currentUser?.email,
        stack: error.stack
      });
      
      // Enhanced error handling for specific cases
      if (error.code === 'auth/quota-exceeded') {
        throw new Error('Email sending quota exceeded. Please try again later.');
      }
      
      if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address format.');
      }
      
      if (error.code === 'auth/user-disabled') {
        throw new Error('This account has been disabled. Please contact support.');
      }
      
      if (error.message.includes('domain')) {
        throw new Error('Email domain not authorized. Please contact support.');
      }
      
      throw this.handleAuthError(error);
    }
  }

  /**
   * Reload current user to get latest verification status
   */
  async reloadUser(): Promise<void> {
    try {
      if (!auth.currentUser) {
        throw new Error('No user is currently signed in');
      }
      await auth.currentUser.reload();
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Check if email verification is pending (user exists but not verified)
   */
  isEmailVerificationPending(): boolean {
    return this.currentUser !== null && !this.currentUser.emailVerified;
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Get current user profile from Firestore
   */
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      if (!this.currentUser) return null;
      
      // Read from 'profiles' collection instead of 'users'
      const userDoc = await getDoc(doc(db, 'profiles', this.currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          uid: data.uid,
          email: data.email,
          displayName: data.displayName,
          emailVerified: data.emailVerified,
          role: data.role,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
          profile: data.profile
        } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  /**
   * Check if current user's email is verified
   */
  isEmailVerified(): boolean {
    return this.currentUser?.emailVerified || false;
  }

  /**
   * Listen to authentication state changes
   */
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.authStateListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  /**
   * Wait for authentication state to be determined
   */
  waitForAuthState(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  /**
   * Create user profile in Firestore using ProfileService
   */
  private async createUserProfile(user: User, displayName?: string): Promise<void> {
    try {
      // Check if profile already exists
      const existingProfile = await profileService.getProfile(user.uid);
      if (existingProfile) {
        console.log('Profile already exists for user:', user.uid);
        return;
      }

      // Use ProfileService to create initial profile with proper role-based logic
      await profileService.createInitialProfile({
        uid: user.uid,
        email: user.email!,
        fullNameEN: displayName || user.displayName || '',
        emailVerified: user.emailVerified,
        role: 'user', // Default role for new sign-ups
        displayName: displayName || user.displayName || undefined,
        ...(user.photoURL && { photoURL: user.photoURL })
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  /**
   * Update last login time
   */
  private async updateLastLogin(uid: string): Promise<void> {
    try {
      // Update in 'profiles' collection instead of 'users'
      await setDoc(doc(db, 'profiles', uid), {
        lastLoginAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  /**
   * Handle Firebase Auth errors
   */
  private handleAuthError(error: any): AuthError {
    const errorMap: { [key: string]: string } = {
      'auth/email-already-in-use': 'This email address is already registered',
      'auth/invalid-email': 'Invalid email address',
      'auth/operation-not-allowed': 'Email/password accounts are not enabled',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/invalid-credential': 'Invalid email or password',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later',
      'auth/network-request-failed': 'Network error. Please check your connection'
    };

    return {
      code: error.code || 'unknown-error',
      message: errorMap[error.code] || error.message || 'An unexpected error occurred'
    };
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
