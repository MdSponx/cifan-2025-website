import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  where,
  limit
} from 'firebase/firestore';
import { db } from '../firebase';

export interface ShortFilmComment {
  id: string;
  submissionId: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  content: string;
  type: 'general' | 'scoring' | 'status_change' | 'flag';
  scores?: {
    technical: number;
    story: number;
    creativity: number;
    chiangmai: number;
    humanEffort: number;
    totalScore: number;
  };
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt?: Date;
  isEdited: boolean;
  isDeleted: boolean;
}

export interface ScoringCommentData {
  technical: number;
  story: number;
  creativity: number;
  chiangmai: number;
  humanEffort: number;
  totalScore: number;
}

export class ShortFilmCommentsService {
  private static instance: ShortFilmCommentsService;

  static getInstance(): ShortFilmCommentsService {
    if (!ShortFilmCommentsService.instance) {
      ShortFilmCommentsService.instance = new ShortFilmCommentsService();
    }
    return ShortFilmCommentsService.instance;
  }

  /**
   * Add a general comment to a submission
   */
  async addGeneralComment(
    submissionId: string,
    adminId: string,
    adminName: string,
    adminEmail: string,
    content: string,
    metadata?: Record<string, any>
  ): Promise<string> {
    try {
      const commentsRef = collection(db, 'submissions', submissionId, 'ShortFilmComments');
      
      const commentData = {
        submissionId,
        adminId,
        adminName,
        adminEmail,
        content,
        type: 'general' as const,
        metadata: metadata || {},
        createdAt: serverTimestamp(),
        isEdited: false,
        isDeleted: false
      };

      const docRef = await addDoc(commentsRef, commentData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding general comment:', error);
      throw new Error('Failed to add comment');
    }
  }

  /**
   * Add a scoring comment with scores to a submission
   */
  async addScoringComment(
    submissionId: string,
    adminId: string,
    adminName: string,
    adminEmail: string,
    scores: ScoringCommentData,
    content?: string,
    metadata?: Record<string, any>
  ): Promise<string> {
    try {
      const commentsRef = collection(db, 'submissions', submissionId, 'ShortFilmComments');
      
      const commentData = {
        submissionId,
        adminId,
        adminName,
        adminEmail,
        content: content || '',
        type: 'scoring' as const,
        scores,
        metadata: metadata || {},
        createdAt: serverTimestamp(),
        isEdited: false,
        isDeleted: false
      };

      const docRef = await addDoc(commentsRef, commentData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding scoring comment:', error);
      throw new Error('Failed to add scoring comment');
    }
  }

  /**
   * Get all comments for a submission
   */
  async getComments(submissionId: string): Promise<ShortFilmComment[]> {
    try {
      const commentsRef = collection(db, 'submissions', submissionId, 'ShortFilmComments');
      const q = query(
        commentsRef,
        where('isDeleted', '==', false),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const comments: ShortFilmComment[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        comments.push({
          id: doc.id,
          submissionId: data.submissionId,
          adminId: data.adminId,
          adminName: data.adminName,
          adminEmail: data.adminEmail,
          content: data.content,
          type: data.type,
          scores: data.scores,
          metadata: data.metadata,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate(),
          isEdited: data.isEdited || false,
          isDeleted: data.isDeleted || false
        });
      });

      return comments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw new Error('Failed to fetch comments');
    }
  }

  /**
   * Subscribe to real-time comments updates
   */
  subscribeToComments(
    submissionId: string,
    onCommentsUpdate: (comments: ShortFilmComment[]) => void
  ): () => void {
    try {
      const commentsRef = collection(db, 'submissions', submissionId, 'ShortFilmComments');
      const q = query(
        commentsRef,
        where('isDeleted', '==', false),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const comments: ShortFilmComment[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          comments.push({
            id: doc.id,
            submissionId: data.submissionId,
            adminId: data.adminId,
            adminName: data.adminName,
            adminEmail: data.adminEmail,
            content: data.content,
            type: data.type,
            scores: data.scores,
            metadata: data.metadata,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate(),
            isEdited: data.isEdited || false,
            isDeleted: data.isDeleted || false
          });
        });

        onCommentsUpdate(comments);
      }, (error) => {
        console.error('Error in comments subscription:', error);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up comments subscription:', error);
      return () => {};
    }
  }

  /**
   * Update an existing comment
   */
  async updateComment(
    submissionId: string,
    commentId: string,
    content: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      const commentRef = doc(db, 'submissions', submissionId, 'ShortFilmComments', commentId);
      
      await updateDoc(commentRef, {
        content,
        metadata: metadata || {},
        updatedAt: serverTimestamp(),
        isEdited: true
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      throw new Error('Failed to update comment');
    }
  }

  /**
   * Soft delete a comment
   */
  async deleteComment(submissionId: string, commentId: string): Promise<void> {
    try {
      const commentRef = doc(db, 'submissions', submissionId, 'ShortFilmComments', commentId);
      
      await updateDoc(commentRef, {
        isDeleted: true,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw new Error('Failed to delete comment');
    }
  }

  /**
   * Get the latest score by a specific admin
   */
  async getLatestScoreByAdmin(submissionId: string, adminId: string): Promise<ShortFilmComment | null> {
    try {
      const commentsRef = collection(db, 'submissions', submissionId, 'ShortFilmComments');
      const q = query(
        commentsRef,
        where('adminId', '==', adminId),
        where('type', '==', 'scoring'),
        where('isDeleted', '==', false),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data();
      
      return {
        id: doc.id,
        submissionId: data.submissionId,
        adminId: data.adminId,
        adminName: data.adminName,
        adminEmail: data.adminEmail,
        content: data.content,
        type: data.type,
        scores: data.scores,
        metadata: data.metadata,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate(),
        isEdited: data.isEdited || false,
        isDeleted: data.isDeleted || false
      };
    } catch (error) {
      console.error('Error fetching latest score by admin:', error);
      return null;
    }
  }

  /**
   * Get all scoring comments for statistics
   */
  async getScoringComments(submissionId: string): Promise<ShortFilmComment[]> {
    try {
      const commentsRef = collection(db, 'submissions', submissionId, 'ShortFilmComments');
      const q = query(
        commentsRef,
        where('type', '==', 'scoring'),
        where('isDeleted', '==', false),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const comments: ShortFilmComment[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        comments.push({
          id: doc.id,
          submissionId: data.submissionId,
          adminId: data.adminId,
          adminName: data.adminName,
          adminEmail: data.adminEmail,
          content: data.content,
          type: data.type,
          scores: data.scores,
          metadata: data.metadata,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate(),
          isEdited: data.isEdited || false,
          isDeleted: data.isDeleted || false
        });
      });

      return comments;
    } catch (error) {
      console.error('Error fetching scoring comments:', error);
      throw new Error('Failed to fetch scoring comments');
    }
  }

  /**
   * Add a status change comment
   */
  async addStatusChangeComment(
    submissionId: string,
    adminId: string,
    adminName: string,
    adminEmail: string,
    oldStatus: string,
    newStatus: string,
    reason?: string
  ): Promise<string> {
    try {
      const content = reason 
        ? `Status changed from "${oldStatus}" to "${newStatus}". Reason: ${reason}`
        : `Status changed from "${oldStatus}" to "${newStatus}".`;

      const commentsRef = collection(db, 'submissions', submissionId, 'ShortFilmComments');
      
      const commentData = {
        submissionId,
        adminId,
        adminName,
        adminEmail,
        content,
        type: 'status_change' as const,
        metadata: {
          oldStatus,
          newStatus,
          reason: reason || null
        },
        createdAt: serverTimestamp(),
        isEdited: false,
        isDeleted: false
      };

      const docRef = await addDoc(commentsRef, commentData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding status change comment:', error);
      throw new Error('Failed to add status change comment');
    }
  }

  /**
   * Add a flag comment
   */
  async addFlagComment(
    submissionId: string,
    adminId: string,
    adminName: string,
    adminEmail: string,
    flagged: boolean,
    reason?: string
  ): Promise<string> {
    try {
      const content = flagged
        ? `Application flagged. ${reason ? `Reason: ${reason}` : ''}`
        : 'Application unflagged.';

      const commentsRef = collection(db, 'submissions', submissionId, 'ShortFilmComments');
      
      const commentData = {
        submissionId,
        adminId,
        adminName,
        adminEmail,
        content,
        type: 'flag' as const,
        metadata: {
          flagged,
          reason: reason || null
        },
        createdAt: serverTimestamp(),
        isEdited: false,
        isDeleted: false
      };

      const docRef = await addDoc(commentsRef, commentData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding flag comment:', error);
      throw new Error('Failed to add flag comment');
    }
  }
}

// Export singleton instance
export const shortFilmCommentsService = ShortFilmCommentsService.getInstance();