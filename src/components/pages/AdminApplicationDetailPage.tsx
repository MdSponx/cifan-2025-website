import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { useAuth } from '../auth/AuthContext';
import { useAdmin } from '../admin/AdminContext';
import { useNotificationHelpers } from '../ui/NotificationSystem';
import { doc, getDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { shortFilmCommentsService, ShortFilmComment } from '../../services/shortFilmCommentsService';
import { AdminApplicationData, ScoringCriteria } from '../../types/admin.types';
import AdminZoneHeader from '../layout/AdminZoneHeader';
import CompactFilmInfo from '../ui/CompactFilmInfo';
import VideoScoringPanel from '../admin/VideoScoringPanel';
import AdminControlsPanel from '../admin/AdminControlsPanel';
import { ArrowLeft, MessageSquare, Star, Filter, Plus, Send } from 'lucide-react';

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
  const [commentFilter, setCommentFilter] = useState<'all' | 'general' | 'scoring'>('all');

  // Scoring state
  const [currentScores, setCurrentScores] = useState<Partial<ScoringCriteria>>({});
  const [allScores, setAllScores] = useState<ScoringCriteria[]>([]);
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);

  // UI state
  const [isUpdating, setIsUpdating] = useState(false);

  const content = {
    th: {
      loading: "กำลังโหลด...",
      applicationNotFound: "ไม่พบใบสมัคร",
      backToGallery: "กลับแกลเลอรี่",
      comments: "ความคิดเห็น",
      addComment: "เพิ่มความคิดเห็น",
      writeComment: "เขียนความคิดเห็น...",
      send: "ส่ง",
      sending: "กำลังส่ง...",
      allComments: "ทั้งหมด",
      generalComments: "ความคิดเห็นทั่วไป",
      scoringComments: "การให้คะแนน",
      noComments: "ยังไม่มีความคิดเห็น",
      scoresSaved: "บันทึกคะแนนเรียบร้อย",
      commentAdded: "เพิ่มความคิดเห็นเรียบร้อย",
      errorSavingScores: "เกิดข้อผิดพลาดในการบันทึกคะแนน",
      errorAddingComment: "เกิดข้อผิดพลาดในการเพิ่มความคิดเห็น",
      scoringEvaluation: "การประเมินคะแนน",
      totalScore: "คะแนนรวม"
    },
    en: {
      loading: "Loading...",
      applicationNotFound: "Application not found",
      backToGallery: "Back to Gallery",
      comments: "Comments",
      addComment: "Add Comment",
      writeComment: "Write a comment...",
      send: "Send",
      sending: "Sending...",
      allComments: "All",
      generalComments: "Comments",
      scoringComments: "Scores",
      noComments: "No comments yet",
      scoresSaved: "Scores saved successfully",
      commentAdded: "Comment added successfully",
      errorSavingScores: "Error saving scores",
      errorAddingComment: "Error adding comment",
      scoringEvaluation: "Scoring Evaluation",
      totalScore: "Total Score"
    }
  };

  const currentContent = content[currentLanguage];

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
            applicationId: data.applicationId || docSnap.id,
            competitionCategory: data.competitionCategory || data.category,
            status: data.status || 'draft',
            filmTitle: data.filmTitle,
            filmTitleTh: data.filmTitleTh,
            filmLanguages: data.filmLanguages || (data.filmLanguage ? [data.filmLanguage] : ['Thai']),
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
              scoredAt: score.scoredAt?.toDate ? score.scoredAt.toDate() : score.scoredAt
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
          setAllScores(mappedApplication.scores);
          
          // Load current user's scores if available
          const userScore = mappedApplication.scores.find(score => score.adminId === user?.uid);
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
        } else {
          setError(currentContent.applicationNotFound);
        }
      } catch (error) {
        console.error('Error fetching application:', error);
        setError(currentLanguage === 'th' ? 'เกิดข้อผิดพลาดในการโหลดข้อมูล' : 'Error loading application data');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId, currentLanguage, user?.uid]);

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

  // Event handlers
  const handleScoreChange = (scores: Partial<ScoringCriteria>) => {
    setCurrentScores(scores);
  };

  const handleSaveScore = async (scores: ScoringCriteria) => {
    if (!application || !user) return;

    setIsSubmittingScore(true);
    try {
      // 1. Save scores to submissions document (existing functionality)
      const docRef = doc(db, 'submissions', applicationId);
      
      // Remove existing score from this admin
      const updatedScores = application.scores.filter(score => score.adminId !== user.uid);
      updatedScores.push(scores);

      await updateDoc(docRef, {
        scores: updatedScores,
        lastModified: serverTimestamp(),
        lastReviewedAt: serverTimestamp()
      });

      // Update local state
      setAllScores(updatedScores);
      setApplication(prev => prev ? { ...prev, scores: updatedScores } : null);

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
          totalScore: scores.totalScore
        },
        scores.comments
      );

      showSuccess(currentContent.scoresSaved);
    } catch (error) {
      console.error('Error saving scores:', error);
      showError(currentContent.errorSavingScores);
    } finally {
      setIsSubmittingScore(false);
    }
  };

  const handleStatusChange = async (newStatus: AdminApplicationData['reviewStatus']) => {
    if (!application) return;

    setIsUpdating(true);
    try {
      const docRef = doc(db, 'submissions', applicationId);
      await updateDoc(docRef, {
        reviewStatus: newStatus,
        lastModified: serverTimestamp(),
        lastReviewedAt: serverTimestamp()
      });

      setApplication(prev => prev ? { ...prev, reviewStatus: newStatus } : null);
      showSuccess(currentLanguage === 'th' ? 'อัปเดตสถานะเรียบร้อย' : 'Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      showError(currentLanguage === 'th' ? 'เกิดข้อผิดพลาดในการอัปเดตสถานะ' : 'Error updating status');
    } finally {
      setIsUpdating(false);
    }
  };

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
      showSuccess(currentLanguage === 'th' ? 'บันทึกหมายเหตุเรียบร้อย' : 'Notes saved successfully');
    } catch (error) {
      console.error('Error saving notes:', error);
      showError(currentLanguage === 'th' ? 'เกิดข้อผิดพลาดในการบันทึกหมายเหตุ' : 'Error saving notes');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFlagToggle = async (flagged: boolean, reason?: string) => {
    if (!application) return;

    setIsUpdating(true);
    try {
      const docRef = doc(db, 'submissions', applicationId);
      await updateDoc(docRef, {
        flagged,
        flagReason: reason || null,
        lastModified: serverTimestamp()
      });

      setApplication(prev => prev ? { ...prev, flagged, flagReason: reason } : null);
      showSuccess(flagged 
        ? (currentLanguage === 'th' ? 'ตั้งค่าสถานะพิเศษเรียบร้อย' : 'Application flagged successfully')
        : (currentLanguage === 'th' ? 'ยกเลิกสถานะพิเศษเรียบร้อย' : 'Application unflagged successfully')
      );
    } catch (error) {
      console.error('Error toggling flag:', error);
      showError(currentLanguage === 'th' ? 'เกิดข้อผิดพลาดในการอัปเดตสถานะ' : 'Error updating flag status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export application data');
    showSuccess(currentLanguage === 'th' ? 'ส่งออกข้อมูลเรียบร้อย' : 'Data exported successfully');
  };

  const handlePrint = () => {
    window.print();
  };

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
      showSuccess(currentContent.commentAdded);
    } catch (error) {
      console.error('Error adding comment:', error);
      showError(currentContent.errorAddingComment);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Filter comments based on selected filter
  const filteredComments = comments.filter(comment => {
    if (commentFilter === 'all') return true;
    return comment.type === commentFilter;
  });

  // Loading State
  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <AdminZoneHeader
          title={currentContent.loading}
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
          title={currentContent.applicationNotFound}
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
          title={currentContent.applicationNotFound}
          showBackButton={true}
          onBackClick={() => window.location.hash = '#admin/gallery'}
          onSidebarToggle={onSidebarToggle || (() => {})}
        />
        
        <div className="text-center py-12">
          <div className="text-6xl mb-6">📄</div>
          <h2 className={`text-2xl ${getClass('header')} mb-4 text-white`}>
            {currentContent.applicationNotFound}
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
        subtitle={currentLanguage === 'th' ? 'รายละเอียดใบสมัคร' : 'Application Details'}
        showBackButton={true}
        backButtonText={currentContent.backToGallery}
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
        nationality={application.submitterName ? 'Thailand' : 'Unknown'}
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
          allScores={allScores}
          onScoreChange={handleScoreChange}
          onSaveScores={handleSaveScore}
          isSubmitting={isSubmittingScore}
        />
      )}

      {/* Comments Section */}
      <div className="glass-container rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl ${getClass('header')} text-white flex items-center space-x-2`}>
            <MessageSquare className="w-6 h-6 text-[#FCB283]" />
            <span>{currentContent.comments}</span>
          </h3>
          
          {/* Comment Filter Tabs */}
          <div className="flex items-center bg-white/10 rounded-lg p-1">
            {(['all', 'general', 'scoring'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setCommentFilter(filter)}
                className={`px-3 py-1 rounded transition-colors text-sm ${
                  commentFilter === filter
                    ? 'bg-[#FCB283] text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {filter === 'all' && currentContent.allComments}
                {filter === 'general' && currentContent.generalComments}
                {filter === 'scoring' && currentContent.scoringComments}
              </button>
            ))}
          </div>
        </div>

        {/* Add Comment Form */}
        <div className="mb-6">
          <div className="flex gap-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={currentContent.writeComment}
              rows={3}
              className="flex-1 p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-[#FCB283] focus:outline-none resize-vertical"
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim() || isSubmittingComment}
              className="px-6 py-3 bg-[#FCB283] hover:bg-[#AA4626] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white transition-colors flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmittingComment ? currentContent.sending : currentContent.send}</span>
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {loadingComments ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#FCB283] mb-4"></div>
              <p className={`${getClass('body')} text-white/80`}>
                {currentContent.loading}
              </p>
            </div>
          ) : filteredComments.length > 0 ? (
            filteredComments.map((comment) => (
              <div key={comment.id} className={`glass-card p-4 rounded-xl border-l-4 ${
                comment.type === 'scoring' ? 'border-green-400' : 'border-blue-400'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FCB283] to-[#AA4626] flex items-center justify-center text-white font-bold text-xs">
                      {comment.adminName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className={`${getClass('body')} text-white font-medium text-sm`}>
                        {comment.adminName}
                      </p>
                      <p className={`text-xs ${getClass('body')} text-white/60`}>
                        {comment.createdAt.toLocaleDateString(currentLanguage === 'th' ? 'th-TH' : 'en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {comment.type === 'scoring' && (
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className={`${getClass('body')} text-yellow-400 font-medium text-sm`}>
                        {currentContent.scoringEvaluation}
                      </span>
                    </div>
                  )}
                </div>

                {/* Comment Content */}
                <p className={`${getClass('body')} text-white/90 text-sm leading-relaxed mb-3`}>
                  {comment.content}
                </p>

                {/* Scores Display for Scoring Comments */}
                {comment.type === 'scoring' && comment.scores && (
                  <div className="mt-4 p-4 bg-white/5 rounded-lg">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                      <div className="text-center">
                        <p className={`text-xs ${getClass('body')} text-white/60`}>
                          {currentLanguage === 'th' ? 'ความคิดสร้างสรรค์' : 'Creativity'}
                        </p>
                        <p className={`text-lg ${getClass('header')} text-[#FCB283]`}>
                          {comment.scores.creativity}/10
                        </p>
                      </div>
                      <div className="text-center">
                        <p className={`text-xs ${getClass('body')} text-white/60`}>
                          {currentLanguage === 'th' ? 'เทคนิค' : 'Technical'}
                        </p>
                        <p className={`text-lg ${getClass('header')} text-[#FCB283]`}>
                          {comment.scores.technical}/10
                        </p>
                      </div>
                      <div className="text-center">
                        <p className={`text-xs ${getClass('body')} text-white/60`}>
                          {currentLanguage === 'th' ? 'เรื่องราว' : 'Story'}
                        </p>
                        <p className={`text-lg ${getClass('header')} text-[#FCB283]`}>
                          {comment.scores.story}/10
                        </p>
                      </div>
                      <div className="text-center">
                        <p className={`text-xs ${getClass('body')} text-white/60`}>
                          {currentLanguage === 'th' ? 'เชียงใหม่' : 'Chiang Mai'}
                        </p>
                        <p className={`text-lg ${getClass('header')} text-[#FCB283]`}>
                          {comment.scores.chiangmai}/10
                        </p>
                      </div>
                      <div className="text-center">
                        <p className={`text-xs ${getClass('body')} text-white/60`}>
                          {currentLanguage === 'th' ? 'ความพยายาม' : 'Human Effort'}
                        </p>
                        <p className={`text-lg ${getClass('header')} text-[#FCB283]`}>
                          {comment.scores.humanEffort}/10
                        </p>
                      </div>
                      <div className="text-center border-l border-white/20 pl-3">
                        <p className={`text-xs ${getClass('body')} text-white/60`}>
                          {currentContent.totalScore}
                        </p>
                        <p className={`text-xl ${getClass('header')} text-green-400 font-bold`}>
                          {comment.scores.totalScore}/50
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className={`${getClass('body')} text-white/60`}>
                {currentContent.noComments}
              </p>
            </div>
          )}
        </div>
      </div>

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