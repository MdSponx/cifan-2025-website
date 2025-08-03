import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { useAuth } from '../auth/AuthContext';
import { useAdmin } from '../admin/AdminContext';
import { useNotificationHelpers } from '../ui/NotificationSystem';
import { doc, getDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { shortFilmCommentsService, ShortFilmComment, ScoringCommentData } from '../../services/shortFilmCommentsService';
import { AdminApplicationData, ScoringCriteria } from '../../types/admin.types';
import AdminZoneHeader from '../layout/AdminZoneHeader';
import CompactFilmInfo from '../ui/CompactFilmInfo';
import VideoScoringPanel from '../admin/VideoScoringPanel';
import AdminControlsPanel from '../admin/AdminControlsPanel';
import ExportService from '../../services/exportService';
import { 
  MessageSquare, 
  Star, 
  Filter, 
  Plus, 
  Send, 
  Clock,
  User,
  Award,
  Flag,
  Settings,
  Trash2,
  Edit
} from 'lucide-react';

interface AdminApplicationDetailPageProps {
  applicationId: string;
  onSidebarToggle?: () => void;
}

const AdminApplicationDetailPage: React.FC<AdminApplicationDetailPageProps> = ({ 
  applicationId, 
  onSidebarToggle 
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const { user } = useAuth();
  const { checkPermission } = useAdmin();
  const { showSuccess, showError } = useNotificationHelpers();
  const currentLanguage = i18n.language as 'en' | 'th';

  // Application state
  const [application, setApplication] = useState<AdminApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Comments state
  const [comments, setComments] = useState<ShortFilmComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentFilter, setCommentFilter] = useState<'all' | 'general' | 'scoring' | 'status_change' | 'flag'>('all');

  // Scoring state
  const [currentScores, setCurrentScores] = useState<Partial<ScoringCriteria>>({});
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);

  // Admin controls state
  const [isUpdating, setIsUpdating] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch application data
  useEffect(() => {
    const fetchApplication = async () => {
      if (!applicationId) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'submissions', applicationId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          
          const mappedApplication: AdminApplicationData = {
            id: docSnap.id,
            userId: data.userId,
            applicationId: data.applicationId,
            competitionCategory: data.competitionCategory || data.category,
            status: data.status,
            filmTitle: data.filmTitle,
            filmTitleTh: data.filmTitleTh,
            filmLanguages: data.filmLanguages || (data.filmLanguage ? [data.filmLanguage] : []),
            genres: data.genres || [],
            format: data.format,
            duration: data.duration,
            synopsis: data.synopsis,
            chiangmaiConnection: data.chiangmaiConnection,
            
            // Submitter data
            submitterName: data.submitterName || data.directorName,
            submitterNameTh: data.submitterNameTh || data.directorNameTh,
            submitterAge: data.submitterAge || data.directorAge,
            submitterPhone: data.submitterPhone || data.directorPhone,
            submitterEmail: data.submitterEmail || data.directorEmail,
            submitterRole: data.submitterRole || data.directorRole,
            
            // Files
            files: {
              filmFile: {
                url: data.files?.filmFile?.downloadURL || data.files?.filmFile?.url || '',
                name: data.files?.filmFile?.fileName || data.files?.filmFile?.name || '',
                size: data.files?.filmFile?.fileSize || data.files?.filmFile?.size || 0
              },
              posterFile: {
                url: data.files?.posterFile?.downloadURL || data.files?.posterFile?.url || '',
                name: data.files?.posterFile?.fileName || data.files?.posterFile?.name || '',
                size: data.files?.posterFile?.fileSize || data.files?.posterFile?.size || 0
              },
              proofFile: data.files?.proofFile ? {
                url: data.files?.proofFile?.downloadURL || data.files?.proofFile?.url || '',
                name: data.files?.proofFile?.fileName || data.files?.proofFile?.name || '',
                size: data.files?.proofFile?.fileSize || data.files?.proofFile?.size || 0
              } : undefined
            },
            
            // Admin fields
            scores: (data.scores || []).map((score: any) => ({
              ...score,
              scoredAt: score.scoredAt?.toDate ? score.scoredAt.toDate() : new Date(score.scoredAt)
            })),
            adminNotes: data.adminNotes || '',
            reviewStatus: data.reviewStatus || 'pending',
            flagged: data.flagged || false,
            flagReason: data.flagReason,
            assignedReviewers: data.assignedReviewers || [],
            
            // Timestamps
            submittedAt: data.submittedAt?.toDate(),
            createdAt: data.createdAt?.toDate() || new Date(),
            lastModified: data.lastModified?.toDate() || new Date(),
            lastReviewedAt: data.lastReviewedAt?.toDate()
          };

          setApplication(mappedApplication);

          // Load current user's scores if they exist
          if (user) {
            const userScore = mappedApplication.scores.find(score => score.adminId === user.uid);
            if (userScore) {
              setCurrentScores({
                technical: userScore.technical,
                story: userScore.story,
                creativity: userScore.creativity,
                chiangmai: userScore.chiangmai,
                humanEffort: userScore.humanEffort,
                comments: userScore.comments
              });
            }
          }
        } else {
          setError(currentLanguage === 'th' ? 'ไม่พบใบสมัครที่ระบุ' : 'Application not found');
        }
      } catch (error) {
        console.error('Error fetching application:', error);
        setError(currentLanguage === 'th' ? 'เกิดข้อผิดพลาดในการโหลดข้อมูล' : 'Error loading application data');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId, currentLanguage, user]);

  // Subscribe to comments
  useEffect(() => {
    if (!applicationId) return;
    
    setLoadingComments(true);
    const unsubscribeComments = shortFilmCommentsService.subscribeToComments(
      applicationId,
      (newComments) => {
        setComments(newComments);
        setLoadingComments(false);
      }
    );

    return () => unsubscribeComments();
  }, [applicationId]);

  const content = {
    th: {
      pageTitle: "รายละเอียดใบสมัคร",
      subtitle: "ดูและจัดการใบสมัครเข้าประกวด",
      loading: "กำลังโหลด...",
      commentsTitle: "ความคิดเห็นและการให้คะแนน",
      addComment: "เพิ่มความคิดเห็น",
      writeComment: "เขียนความคิดเห็น...",
      send: "ส่ง",
      sending: "กำลังส่ง...",
      filterAll: "ทั้งหมด",
      filterGeneral: "ความคิดเห็น",
      filterScoring: "การให้คะแนน",
      filterStatus: "เปลี่ยนสถานะ",
      filterFlag: "ตั้งค่าพิเศษ",
      noComments: "ยังไม่มีความคิดเห็น",
      noCommentsDesc: "เป็นคนแรกที่แสดงความคิดเห็นเกี่ยวกับใบสมัครนี้",
      scoringComment: "การให้คะแนน",
      generalComment: "ความคิดเห็นทั่วไป",
      statusChangeComment: "เปลี่ยนสถานะ",
      flagComment: "ตั้งค่าพิเศษ",
      scoreBreakdown: "รายละเอียดคะแนน",
      totalScore: "คะแนนรวม",
      edit: "แก้ไข",
      delete: "ลบ",
      confirmDelete: "คุณแน่ใจหรือไม่ที่จะลบความคิดเห็นนี้?"
    },
    en: {
      pageTitle: "Application Details",
      subtitle: "View and manage competition submission",
      loading: "Loading...",
      commentsTitle: "Comments & Scoring",
      addComment: "Add Comment",
      writeComment: "Write a comment...",
      send: "Send",
      sending: "Sending...",
      filterAll: "All",
      filterGeneral: "Comments",
      filterScoring: "Scoring",
      filterStatus: "Status Changes",
      filterFlag: "Flags",
      noComments: "No comments yet",
      noCommentsDesc: "Be the first to comment on this application",
      scoringComment: "Scoring",
      generalComment: "General Comment",
      statusChangeComment: "Status Change",
      flagComment: "Flag",
      scoreBreakdown: "Score Breakdown",
      totalScore: "Total Score",
      edit: "Edit",
      delete: "Delete",
      confirmDelete: "Are you sure you want to delete this comment?"
    }
  };

  const currentContent = content[currentLanguage];

  // Handle score saving
  const handleSaveScore = async (scores: ScoringCriteria) => {
    if (!user || !application) return;

    setIsSubmittingScore(true);
    try {
      // 1. Save scores to submissions document (existing functionality)
      const docRef = doc(db, 'submissions', applicationId);
      
      // Remove existing score from this admin
      const updatedScores = application.scores.filter(score => score.adminId !== user.uid);
      
      // Add new score
      const newScore = {
        ...scores,
        adminId: user.uid,
        adminName: user.displayName || user.email || 'Admin',
        scoredAt: serverTimestamp()
      };
      
      updatedScores.push(newScore);
      
      await updateDoc(docRef, {
        scores: updatedScores,
        lastModified: serverTimestamp(),
        lastReviewedAt: serverTimestamp()
      });

      // 2. Save comment with scores to ShortFilmComments subcollection
      await shortFilmCommentsService.addScoringComment(
        applicationId,
        user.uid,
        user.displayName || user.email || 'Admin',
        user.email || '',
        {
          technical: scores.technical,
          story: scores.story,
          creativity: scores.creativity,
          chiangmai: scores.chiangmai,
          humanEffort: scores.humanEffort,
          totalScore: scores.technical + scores.story + scores.creativity + scores.chiangmai + scores.humanEffort
        },
        scores.comments
      );

      // Update local state
      setApplication(prev => prev ? {
        ...prev,
        scores: updatedScores.map(score => ({
          ...score,
          scoredAt: score.scoredAt instanceof Date ? score.scoredAt : new Date()
        }))
      } : null);

      showSuccess(
        currentLanguage === 'th' ? 'บันทึกคะแนนสำเร็จ' : 'Scores saved successfully',
        currentLanguage === 'th' ? 'คะแนนและความคิดเห็นถูกบันทึกแล้ว' : 'Scores and comments have been saved'
      );
    } catch (error) {
      console.error('Error saving scores:', error);
      showError(
        currentLanguage === 'th' ? 'ไม่สามารถบันทึกคะแนนได้' : 'Error saving scores',
        currentLanguage === 'th' ? 'กรุณาลองใหม่อีกครั้ง' : 'Please try again'
      );
    } finally {
      setIsSubmittingScore(false);
    }
  };

  // Handle adding general comment
  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;
    
    setIsSubmittingComment(true);
    try {
      await shortFilmCommentsService.addGeneralComment(
        applicationId,
        user.uid,
        user.displayName || user.email || 'Admin',
        user.email || '',
        newComment.trim()
      );
      
      setNewComment('');
      showSuccess(
        currentLanguage === 'th' ? 'เพิ่มความคิดเห็นสำเร็จ' : 'Comment added successfully'
      );
    } catch (error) {
      console.error('Error adding comment:', error);
      showError(
        currentLanguage === 'th' ? 'ไม่สามารถเพิ่มความคิดเห็นได้' : 'Error adding comment'
      );
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handle status change
  const handleStatusChange = async (newStatus: AdminApplicationData['reviewStatus']) => {
    if (!user || !application) return;

    setIsUpdating(true);
    try {
      const docRef = doc(db, 'submissions', applicationId);
      await updateDoc(docRef, {
        reviewStatus: newStatus,
        lastModified: serverTimestamp(),
        lastReviewedAt: serverTimestamp()
      });

      // Add status change comment
      await shortFilmCommentsService.addStatusChangeComment(
        applicationId,
        user.uid,
        user.displayName || user.email || 'Admin',
        user.email || '',
        application.reviewStatus,
        newStatus
      );

      setApplication(prev => prev ? { ...prev, reviewStatus: newStatus } : null);
      
      showSuccess(
        currentLanguage === 'th' ? 'เปลี่ยนสถานะสำเร็จ' : 'Status updated successfully'
      );
    } catch (error) {
      console.error('Error updating status:', error);
      showError(
        currentLanguage === 'th' ? 'ไม่สามารถเปลี่ยนสถานะได้' : 'Error updating status'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle notes change
  const handleNotesChange = async (notes: string) => {
    if (!application) return;

    setIsUpdating(true);
    try {
      const docRef = doc(db, 'submissions', applicationId);
      await updateDoc(docRef, {
        adminNotes: notes,
        lastModified: serverTimestamp()
      });

      setApplication(prev => prev ? { ...prev, adminNotes: notes } : null);
      
      showSuccess(
        currentLanguage === 'th' ? 'บันทึกหมายเหตุสำเร็จ' : 'Notes saved successfully'
      );
    } catch (error) {
      console.error('Error saving notes:', error);
      showError(
        currentLanguage === 'th' ? 'ไม่สามารถบันทึกหมายเหตุได้' : 'Error saving notes'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle flag toggle
  const handleFlagToggle = async (flagged: boolean, reason?: string) => {
    if (!user || !application) return;

    setIsUpdating(true);
    try {
      const docRef = doc(db, 'submissions', applicationId);
      await updateDoc(docRef, {
        flagged,
        flagReason: reason || null,
        lastModified: serverTimestamp()
      });

      // Add flag comment
      await shortFilmCommentsService.addFlagComment(
        applicationId,
        user.uid,
        user.displayName || user.email || 'Admin',
        user.email || '',
        flagged,
        reason
      );

      setApplication(prev => prev ? { 
        ...prev, 
        flagged, 
        flagReason: reason 
      } : null);
      
      showSuccess(
        flagged 
          ? (currentLanguage === 'th' ? 'ตั้งค่าสถานะพิเศษสำเร็จ' : 'Application flagged successfully')
          : (currentLanguage === 'th' ? 'ยกเลิกสถานะพิเศษสำเร็จ' : 'Application unflagged successfully')
      );
    } catch (error) {
      console.error('Error toggling flag:', error);
      showError(
        currentLanguage === 'th' ? 'ไม่สามารถเปลี่ยนสถานะได้' : 'Error updating flag status'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle export
  const handleExport = async () => {
    if (!application) return;

    try {
      const exportService = new ExportService();
      await exportService.exportApplicationPDF(application);
      
      showSuccess(
        currentLanguage === 'th' ? 'ส่งออกสำเร็จ' : 'Export successful'
      );
    } catch (error) {
      console.error('Error exporting:', error);
      showError(
        currentLanguage === 'th' ? 'ไม่สามารถส่งออกได้' : 'Error exporting'
      );
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle comment deletion
  const handleDeleteComment = async (commentId: string) => {
    const confirmed = window.confirm(currentContent.confirmDelete);
    if (!confirmed) return;

    try {
      await shortFilmCommentsService.deleteComment(applicationId, commentId);
      showSuccess(
        currentLanguage === 'th' ? 'ลบความคิดเห็นสำเร็จ' : 'Comment deleted successfully'
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
      showError(
        currentLanguage === 'th' ? 'ไม่สามารถลบความคิดเห็นได้' : 'Error deleting comment'
      );
    }
  };

  // Filter comments
  const filteredComments = comments.filter(comment => {
    if (commentFilter === 'all') return true;
    return comment.type === commentFilter;
  });

  // Get comment type icon
  const getCommentTypeIcon = (type: string) => {
    switch (type) {
      case 'scoring': return <Star className="w-4 h-4 text-[#FCB283]" />;
      case 'status_change': return <Settings className="w-4 h-4 text-blue-400" />;
      case 'flag': return <Flag className="w-4 h-4 text-red-400" />;
      default: return <MessageSquare className="w-4 h-4 text-white/60" />;
    }
  };

  // Get comment type label
  const getCommentTypeLabel = (type: string) => {
    switch (type) {
      case 'scoring': return currentContent.scoringComment;
      case 'status_change': return currentContent.statusChangeComment;
      case 'flag': return currentContent.flagComment;
      default: return currentContent.generalComment;
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(currentLanguage === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Comments Section Component
  const CommentsSection = () => (
    <div className="glass-container rounded-2xl p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl ${getClass('header')} text-white flex items-center space-x-2`}>
          <MessageSquare className="w-6 h-6 text-[#FCB283]" />
          <span>{currentContent.commentsTitle}</span>
        </h3>
        <span className="px-3 py-1 bg-[#FCB283]/20 text-[#FCB283] rounded-full text-sm">
          {comments.length}
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all', label: currentContent.filterAll, count: comments.length },
          { key: 'general', label: currentContent.filterGeneral, count: comments.filter(c => c.type === 'general').length },
          { key: 'scoring', label: currentContent.filterScoring, count: comments.filter(c => c.type === 'scoring').length },
          { key: 'status_change', label: currentContent.filterStatus, count: comments.filter(c => c.type === 'status_change').length },
          { key: 'flag', label: currentContent.filterFlag, count: comments.filter(c => c.type === 'flag').length }
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setCommentFilter(filter.key as any)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              commentFilter === filter.key
                ? 'bg-[#FCB283] border-[#FCB283] text-white'
                : 'bg-white/10 border-white/20 text-white hover:border-[#FCB283]'
            }`}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>

      {/* Add Comment Form */}
      <div className="glass-card p-4 rounded-xl mb-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FCB283] to-[#AA4626] flex items-center justify-center text-white font-bold">
            {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'A'}
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={currentContent.writeComment}
              rows={3}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-[#FCB283] focus:outline-none resize-vertical"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim() || isSubmittingComment}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  newComment.trim() && !isSubmittingComment
                    ? 'bg-[#FCB283] hover:bg-[#AA4626] text-white'
                    : 'bg-white/10 text-white/50 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>{isSubmittingComment ? currentContent.sending : currentContent.send}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {loadingComments ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#FCB283] mb-2"></div>
            <p className={`${getClass('body')} text-white/80 text-sm`}>
              {currentContent.loading}
            </p>
          </div>
        ) : filteredComments.length > 0 ? (
          filteredComments.map((comment) => (
            <div key={comment.id} className="glass-card p-4 rounded-xl">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
                    {comment.adminName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className={`${getClass('body')} text-white font-medium text-sm`}>
                        {comment.adminName}
                      </p>
                      {getCommentTypeIcon(comment.type)}
                      <span className={`text-xs ${getClass('body')} text-white/60`}>
                        {getCommentTypeLabel(comment.type)}
                      </span>
                    </div>
                    <p className={`text-xs ${getClass('body')} text-white/60`}>
                      {formatDate(comment.createdAt)}
                      {comment.isEdited && (
                        <span className="ml-2 italic">
                          ({currentLanguage === 'th' ? 'แก้ไขแล้ว' : 'edited'})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                
                {/* Comment Actions */}
                {comment.adminId === user?.uid && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="p-1 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                      title={currentContent.delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Comment Content */}
              {comment.content && (
                <p className={`${getClass('body')} text-white/90 mb-3 leading-relaxed`}>
                  {comment.content}
                </p>
              )}

              {/* Scoring Display */}
              {comment.type === 'scoring' && comment.scores && (
                <div className="mt-4 p-4 bg-white/5 rounded-lg border border-[#FCB283]/20">
                  <h5 className={`${getClass('subtitle')} text-[#FCB283] mb-3 text-sm`}>
                    {currentContent.scoreBreakdown}
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                    <div className="text-center">
                      <p className="text-xs text-white/60">Creativity</p>
                      <p className="text-lg font-bold text-white">{comment.scores.creativity}/10</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-white/60">Technical</p>
                      <p className="text-lg font-bold text-white">{comment.scores.technical}/10</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-white/60">Story</p>
                      <p className="text-lg font-bold text-white">{comment.scores.story}/10</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-white/60">Chiang Mai</p>
                      <p className="text-lg font-bold text-white">{comment.scores.chiangmai}/10</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-white/60">Human Effort</p>
                      <p className="text-lg font-bold text-white">{comment.scores.humanEffort}/10</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-[#FCB283]">{currentContent.totalScore}</p>
                      <p className="text-xl font-bold text-[#FCB283]">{comment.scores.totalScore}/50</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <h4 className={`${getClass('header')} text-white/60 mb-2`}>
              {currentContent.noComments}
            </h4>
            <p className={`${getClass('body')} text-white/40 text-sm`}>
              {currentContent.noCommentsDesc}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // Loading State
  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <AdminZoneHeader
          title={currentContent.pageTitle}
          subtitle={currentContent.subtitle}
          onSidebarToggle={onSidebarToggle || (() => {})}
        />
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FCB283] mb-4"></div>
          <p className={`${getClass('body')} text-white/80`}>
            {currentContent.loading}
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <AdminZoneHeader
          title={currentContent.pageTitle}
          subtitle={currentContent.subtitle}
          showBackButton={true}
          onBackClick={() => window.location.hash = '#admin/gallery'}
          onSidebarToggle={onSidebarToggle || (() => {})}
        />
        
        <div className="text-center py-12">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className={`text-2xl ${getClass('header')} mb-4 text-white`}>
            {error}
          </h2>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <AdminZoneHeader
          title={currentContent.pageTitle}
          subtitle={currentContent.subtitle}
          showBackButton={true}
          onBackClick={() => window.location.hash = '#admin/gallery'}
          onSidebarToggle={onSidebarToggle || (() => {})}
        />
        
        <div className="text-center py-12">
          <div className="text-6xl mb-6">📄</div>
          <h2 className={`text-2xl ${getClass('header')} mb-4 text-white`}>
            {currentLanguage === 'th' ? 'ไม่พบใบสมัคร' : 'Application Not Found'}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Admin Zone Header */}
      <AdminZoneHeader
        title={application.filmTitle}
        subtitle={currentContent.subtitle}
        showBackButton={true}
        backButtonText={currentLanguage === 'th' ? 'กลับไปแกลเลอรี่' : 'Back to Gallery'}
        onBackClick={() => window.location.hash = '#admin/gallery'}
        onSidebarToggle={onSidebarToggle || (() => {})}
      />

      {/* Film Information */}
      <CompactFilmInfo
        filmTitle={application.filmTitle}
        filmTitleTh={application.filmTitleTh}
        filmLanguages={application.filmLanguages}
        genres={application.genres}
        format={application.format}
        duration={application.duration}
        synopsis={application.synopsis}
        nationality={application.nationality || 'Unknown'}
        competitionCategory={application.competitionCategory}
        posterUrl={application.files.posterFile.url}
        submitterName={application.submitterName || 'Unknown'}
        submitterNameTh={application.submitterNameTh}
        submitterRole={application.submitterRole || 'Unknown'}
        chiangmaiConnection={application.chiangmaiConnection}
      />

      {/* Video Scoring Panel */}
      {checkPermission('canScoreApplications') && (
        <VideoScoringPanel
          applicationId={applicationId}
          currentScores={currentScores}
          allScores={application.scores}
          onScoreChange={setCurrentScores}
          onSaveScores={handleSaveScore}
          isSubmitting={isSubmittingScore}
        />
      )}

      {/* Comments Section */}
      <CommentsSection />

      {/* Admin Controls Panel */}
      <AdminControlsPanel
        application={application}
        onStatusChange={handleStatusChange}
        onNotesChange={handleNotesChange}
        onFlagToggle={handleFlagToggle}
        onExport={handleExport}
        onPrint={handlePrint}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default AdminApplicationDetailPage;