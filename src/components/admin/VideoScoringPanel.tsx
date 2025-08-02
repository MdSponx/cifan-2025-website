import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { useAuth } from '../auth/AuthContext';
import { ScoringCriteria, VideoScoringPanelProps } from '../../types/admin.types';
import { Star, Save, RotateCcw, TrendingUp } from 'lucide-react';
import AnimatedButton from '../ui/AnimatedButton';

const VideoScoringPanel: React.FC<VideoScoringPanelProps> = ({
  applicationId,
  currentScores,
  allScores,
  onScoreChange,
  onSaveScores,
  isSubmitting = false,
  className = ''
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const { user } = useAuth();
  const currentLanguage = i18n.language as 'en' | 'th';

  const [scores, setScores] = useState<Partial<ScoringCriteria>>({
    technical: currentScores?.technical || 0,
    story: currentScores?.story || 0,
    creativity: currentScores?.creativity || 0,
    overall: currentScores?.overall || 0,
    comments: currentScores?.comments || ''
  });

  const [hasChanges, setHasChanges] = useState(false);

  const content = {
    th: {
      title: "การให้คะแนน",
      subtitle: "ประเมินผลงานตามเกณฑ์การตัดสิน",
      technical: "คุณภาพทางเทคนิค",
      story: "เรื่องราวและการเล่าเรื่อง",
      creativity: "ความคิดสร้างสรรค์และความเป็นต้นฉบับ",
      chiangmai: "ความเกี่ยวข้องกับเชียงใหม่",
      overall: "ความประทับใจโดยรวม",
      totalScore: "คะแนนรวม",
      comments: "ความคิดเห็นเพิ่มเติม",
      commentsPlaceholder: "เขียนความคิดเห็นเกี่ยวกับผลงานนี้...",
      saveScores: "บันทึกคะแนน",
      saving: "กำลังบันทึก...",
      resetScores: "รีเซ็ตคะแนน",
      averageScore: "คะแนนเฉลี่ย",
      yourScore: "คะแนนของคุณ",
      previousScores: "คะแนนจากผู้ตัดสินอื่น",
      noScores: "ยังไม่มีการให้คะแนน",
      scoringScale: "มาตราส่วน 1-10 คะแนน",
      excellent: "ยอดเยี่ยม",
      good: "ดี",
      average: "ปานกลาง",
      poor: "ต้องปรับปรุง"
    },
    en: {
      title: "Scoring Panel",
      subtitle: "Evaluate the film based on judging criteria",
      technical: "Technical Quality",
      story: "Story & Narrative",
      creativity: "Creativity & Originality",
      chiangmai: "Connection to Chiang Mai",
      overall: "Overall Impact",
      totalScore: "Total Score",
      comments: "Additional Comments",
      commentsPlaceholder: "Write your comments about this film...",
      saveScores: "Save Scores",
      saving: "Saving...",
      resetScores: "Reset Scores",
      averageScore: "Average Score",
      yourScore: "Your Score",
      previousScores: "Other Judges' Scores",
      noScores: "No scores yet",
      scoringScale: "Scale: 1-10 points",
      excellent: "Excellent",
      good: "Good",
      average: "Average",
      poor: "Needs Improvement"
    }
  };

  const currentContent = content[currentLanguage];

  const criteriaInfo = [
    { key: 'technical', label: currentContent.technical, icon: '🎬' },
    { key: 'story', label: currentContent.story, icon: '📖' },
    { key: 'creativity', label: currentContent.creativity, icon: '✨' },
    { key: 'chiangmai', label: currentContent.chiangmai, icon: '🏔️' },
    { key: 'overall', label: currentContent.overall, icon: '🎯' }
  ];

  // Calculate total score
  const totalScore = (scores.technical || 0) + (scores.story || 0) + (scores.creativity || 0) + (scores.chiangmai || 0) + (scores.overall || 0);
  const totalPercentage = Math.round((totalScore / 50) * 100);

  // Calculate average from all scores
  const averageScore = allScores.length > 0 
    ? allScores.reduce((sum, score) => sum + score.totalScore, 0) / allScores.length 
    : 0;

  useEffect(() => {
    const hasScoreChanges = 
      scores.technical !== (currentScores?.technical || 0) ||
      scores.story !== (currentScores?.story || 0) ||
      scores.creativity !== (currentScores?.creativity || 0) ||
      scores.chiangmai !== (currentScores?.chiangmai || 0) ||
      scores.overall !== (currentScores?.overall || 0) ||
      scores.comments !== (currentScores?.comments || '');
    
    setHasChanges(hasScoreChanges);
    onScoreChange(scores);
  }, [scores, currentScores, onScoreChange]);

  const handleScoreChange = (criterion: string, value: number) => {
    setScores(prev => ({ ...prev, [criterion]: value }));
  };

  const handleCommentsChange = (comments: string) => {
    setScores(prev => ({ ...prev, comments }));
  };

  const handleSaveScores = async () => {
    if (!user) return;

    const scoringData: ScoringCriteria = {
      technical: scores.technical || 0,
      story: scores.story || 0,
      creativity: scores.creativity || 0,
      chiangmai: scores.chiangmai || 0,
      overall: scores.overall || 0,
      totalScore,
      adminId: user.uid,
      adminName: user.displayName || user.email || 'Admin',
      scoredAt: new Date(),
      comments: scores.comments
    };

    await onSaveScores(scoringData);
    setHasChanges(false);
  };

  const handleResetScores = () => {
    setScores({
      technical: 0,
      story: 0,
      creativity: 0,
      chiangmai: 0,
      chiangmai: currentScores?.chiangmai || 0,
      overall: 0,
      comments: ''
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-blue-400';
    if (score >= 4) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return currentContent.excellent;
    if (score >= 6) return currentContent.good;
    if (score >= 4) return currentContent.average;
    return currentContent.poor;
  };

  const StarRating = ({ value, onChange, criterion }: { value: number; onChange: (value: number) => void; criterion: string }) => {
    const [hoverValue, setHoverValue] = useState(0);

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
            className="transition-all duration-200 hover:scale-110"
          >
            <Star
              className={`w-5 h-5 transition-colors duration-200 ${
                star <= (hoverValue || value)
                  ? 'text-[#FCB283] fill-current'
                  : 'text-white/30'
              }`}
            />
          </button>
        ))}
        <span className={`ml-3 text-lg font-bold ${getScoreColor(value)} ${getClass('header')}`}>
          {value}/10
        </span>
      </div>
    );
  };

  return (
    <div className={`glass-container rounded-2xl p-6 sm:p-8 ${className}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl ${getClass('header')} text-white mb-2 flex items-center space-x-2`}>
            <Star className="w-6 h-6 text-[#FCB283]" />
            <span>{currentContent.title}</span>
          </h3>
          <p className={`${getClass('body')} text-white/70 text-sm`}>
            {currentContent.subtitle}
          </p>
        </div>
        
        {/* Total Score Display */}
        <div className="text-center">
          <div className={`text-3xl ${getClass('header')} ${getScoreColor(totalScore / 4)} mb-1`}>
            {totalScore}/50 ({totalPercentage}%)
          </div>
          <p className={`text-xs ${getClass('body')} text-white/60`}>
            {currentContent.totalScore}
          </p>
        </div>
      </div>

      {/* Scoring Criteria */}
      <div className="space-y-6 mb-8">
        {criteriaInfo.map((criterion) => (
          <div key={criterion.key} className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{criterion.icon}</span>
                <div>
                  <h4 className={`${getClass('subtitle')} text-white font-medium`}>
                    {criterion.label}
                  </h4>
                  <p className={`text-xs ${getClass('body')} text-white/60`}>
                    {currentContent.scoringScale}
                  </p>
                </div>
              </div>
              <span className={`text-sm ${getClass('body')} ${getScoreColor(scores[criterion.key as keyof typeof scores] as number || 0)}`}>
                {getScoreLabel(scores[criterion.key as keyof typeof scores] as number || 0)}
              </span>
            </div>
            
            <StarRating
              value={scores[criterion.key as keyof typeof scores] as number || 0}
              onChange={(value) => handleScoreChange(criterion.key, value)}
              criterion={criterion.key}
            />
          </div>
        ))}
      </div>

      {/* Comments Section */}
      <div className="mb-8">
        <label className={`block text-white/90 ${getClass('body')} mb-3`}>
          {currentContent.comments}
        </label>
        <textarea
          value={scores.comments || ''}
          onChange={(e) => handleCommentsChange(e.target.value)}
          placeholder={currentContent.commentsPlaceholder}
          rows={4}
          className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-[#FCB283] focus:outline-none resize-vertical"
        />
      </div>

      {/* Previous Scores Summary */}
      {allScores.length > 0 && (
        <div className="mb-8">
          <h4 className={`${getClass('subtitle')} text-white mb-4 flex items-center space-x-2`}>
            <TrendingUp className="w-5 h-5 text-[#FCB283]" />
            <span>{currentContent.previousScores}</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Average Score */}
            <div className="glass-card p-4 rounded-xl text-center">
              <div className={`text-2xl ${getClass('header')} ${getScoreColor(averageScore / 5)} mb-2`}>
                {averageScore.toFixed(1)}/50 ({Math.round((averageScore / 50) * 100)}%)
              </div>
              <p className={`text-sm ${getClass('body')} text-white/80`}>
                {currentContent.averageScore}
              </p>
            </div>

            {/* Scores Count */}
            <div className="glass-card p-4 rounded-xl text-center">
              <div className={`text-2xl ${getClass('header')} text-[#FCB283] mb-2`}>
                {allScores.length}
              </div>
              <p className={`text-sm ${getClass('body')} text-white/80`}>
                {currentLanguage === 'th' ? 'ผู้ตัดสิน' : 'Judges'}
              </p>
            </div>
          </div>

          {/* Individual Scores */}
          <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
            {allScores.map((score, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className={`${getClass('body')} text-white text-sm font-medium`}>
                    {score.adminName}
                  </p>
                  <p className={`${getClass('body')} text-white/60 text-xs`}>
                    {new Date(score.scoredAt).toLocaleDateString(currentLanguage === 'th' ? 'th-TH' : 'en-US')}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`${getClass('header')} ${getScoreColor(score.totalScore / 4)} text-lg`}>
                    {score.totalScore}/40
                  </p>
                  <p className={`${getClass('body')} text-white/60 text-xs`}>
                    T:{score.technical} S:{score.story} C:{score.creativity} CM:{score.chiangmai} O:{score.overall}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <AnimatedButton
          variant="outline"
          size="medium"
          icon={<RotateCcw className="w-4 h-4" />}
          onClick={handleResetScores}
          className={hasChanges ? '' : 'opacity-50 cursor-not-allowed'}
        >
          {currentContent.resetScores}
        </AnimatedButton>
        
        <AnimatedButton
          variant="primary"
          size="medium"
          icon={<Save className="w-4 h-4" />}
          onClick={handleSaveScores}
          className={(!hasChanges || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {isSubmitting ? currentContent.saving : currentContent.saveScores}
        </AnimatedButton>
      </div>
    </div>
  );
};

export default VideoScoringPanel;