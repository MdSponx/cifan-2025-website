import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  doc, 
  serverTimestamp,
  where,
  getDocs,
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

      const docRef = await addDoc(
        collection(db, 'submissions', submissionId, 'ShortFilmComments'),
        commentData
      );

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
    scores: {
      technical: number;
      story: number;
      creativity: number;
      chiangmai: number;
      humanEffort: number;
      totalScore: number;
    },
    content?: string
  ): Promise<string> {
    try {
      const commentData = {
        submissionId,
        adminId,
        adminName,
        adminEmail,
        content: content || 'Scoring evaluation completed',
        type: 'scoring' as const,
        scores,
        createdAt: serverTimestamp(),
        isEdited: false,
        isDeleted: false
      };

      const docRef = await addDoc(
        collection(db, 'submissions', submissionId, 'ShortFilmComments'),
        commentData
      );

      return docRef.id;
    } catch (error) {
      console.error('Error adding scoring comment:', error);
      throw new Error('Failed to save scores and comment');
    }
  }

  /**
   * Get all comments for a submission
   */
  async getComments(submissionId: string): Promise<ShortFilmComment[]> {
    try {
      const q = query(
        collection(db, 'submissions', submissionId, 'ShortFilmComments'),
        where('isDeleted', '==', false),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const comments: ShortFilmComment[] = [];

      snapshot.forEach((doc) => {
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
      throw new Error('Failed to load comments');
    }
  }

  /**
   * Subscribe to real-time comments updates
   */
  subscribeToComments(
    submissionId: string,
    callback: (comments: ShortFilmComment[]) => void
  ): () => void {
    const q = query(
      collection(db, 'submissions', submissionId, 'ShortFilmComments'),
      where('isDeleted', '==', false),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const comments: ShortFilmComment[] = [];

      snapshot.forEach((doc) => {
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

      callback(comments);
    }, (error) => {
      console.error('Error in comments subscription:', error);
      callback([]);
    });
  }

  /**
   * Update an existing comment
   */
  async updateComment(
    submissionId: string,
    commentId: string,
    content: string
  ): Promise<void> {
    try {
      const commentRef = doc(db, 'submissions', submissionId, 'ShortFilmComments', commentId);
      
      await updateDoc(commentRef, {
        content,
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
  async deleteComment(
    submissionId: string,
    commentId: string
  ): Promise<void> {
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
  async getLatestScoreByAdmin(
    submissionId: string,
    adminId: string
  ): Promise<ShortFilmComment | null> {
    try {
      const q = query(
        collection(db, 'submissions', submissionId, 'ShortFilmComments'),
        where('adminId', '==', adminId),
        where('type', '==', 'scoring'),
        where('isDeleted', '==', false),
        orderBy('createdAt', 'desc'),
        limit(1)
      );

      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
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
   * Get comments by type
   */
  async getCommentsByType(
    submissionId: string,
    type: ShortFilmComment['type']
  ): Promise<ShortFilmComment[]> {
    try {
      const q = query(
        collection(db, 'submissions', submissionId, 'ShortFilmComments'),
        where('type', '==', type),
        where('isDeleted', '==', false),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const comments: ShortFilmComment[] = [];

      snapshot.forEach((doc) => {
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
      console.error('Error fetching comments by type:', error);
      throw new Error('Failed to load comments');
    }
  }
}

// Export singleton instance
export const shortFilmCommentsService = ShortFilmCommentsService.getInstance();