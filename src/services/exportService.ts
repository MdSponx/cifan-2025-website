import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  includeScores: boolean;
  includeNotes: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  categories?: string[];
  statuses?: string[];
}

export interface ExportProgress {
  stage: 'preparing' | 'processing' | 'generating' | 'complete' | 'error';
  progress: number;
  message: string;
  total?: number;
  current?: number;
}

export class ExportService {
  private onProgress?: (progress: ExportProgress) => void;

  constructor(onProgress?: (progress: ExportProgress) => void) {
    this.onProgress = onProgress;
  }

  /**
   * Export applications data
   */
  async exportApplications(
    applications: any[],
    options: ExportOptions
  ): Promise<void> {
    try {
      this.updateProgress('preparing', 0, 'Preparing export...');

      // Filter applications based on options
      let filteredApplications = this.filterApplications(applications, options);

      this.updateProgress('processing', 20, 'Processing data...');

      switch (options.format) {
        case 'csv':
          await this.exportToCSV(filteredApplications, options);
          break;
        case 'excel':
          await this.exportToExcel(filteredApplications, options);
          break;
        case 'pdf':
          await this.exportToPDF(filteredApplications, options);
          break;
      }

      this.updateProgress('complete', 100, 'Export completed successfully!');
    } catch (error) {
      console.error('Export error:', error);
      this.updateProgress('error', 0, 'Export failed. Please try again.');
      throw error;
    }
  }

  /**
   * Export dashboard statistics
   */
  async exportDashboardStats(
    stats: any,
    chartData: any,
    options: Partial<ExportOptions> = {}
  ): Promise<void> {
    try {
      this.updateProgress('preparing', 0, 'Preparing dashboard export...');

      const exportData = {
        generatedAt: new Date().toISOString(),
        totalApplications: stats.totalApplications,
        categoryBreakdown: stats.applicationsByCategory,
        statusBreakdown: stats.applicationsByStatus,
        recentSubmissions: stats.recentSubmissions,
        trends: stats.trends,
        chartData: {
          genres: chartData.genres,
          countries: chartData.countries,
          trends: chartData.trends
        }
      };

      this.updateProgress('generating', 50, 'Generating report...');

      if (options.format === 'pdf') {
        await this.generateDashboardPDF(exportData);
      } else {
        await this.generateDashboardCSV(exportData);
      }

      this.updateProgress('complete', 100, 'Dashboard export completed!');
    } catch (error) {
      console.error('Dashboard export error:', error);
      this.updateProgress('error', 0, 'Dashboard export failed.');
      throw error;
    }
  }

  /**
   * Export individual application as PDF
   */
  async exportApplicationPDF(application: any): Promise<void> {
    try {
      this.updateProgress('preparing', 0, 'Preparing application PDF...');

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;

      // Header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('CIFAN 2025 - Film Application', margin, 30);

      // Application ID
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Application ID: ${application.id}`, pageWidth - margin - 60, 30);

      let yPosition = 50;

      // Film Information
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Film Information', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const filmInfo = [
        ['Title (EN):', application.filmTitle],
        ['Title (TH):', application.filmTitleTh || 'N/A'],
        ['Director:', application.directorName || application.submitterName],
        ['Category:', application.competitionCategory],
        ['Duration:', `${application.duration} minutes`],
        ['Format:', application.format],
        ['Status:', application.status],
        ['Submitted:', application.submittedAt ? format(application.submittedAt, 'PPP') : 'Draft']
      ];

      filmInfo.forEach(([label, value]) => {
        doc.text(label, margin, yPosition);
        doc.text(value, margin + 40, yPosition);
        yPosition += 8;
      });

      // Synopsis
      yPosition += 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Synopsis', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const splitSynopsis = doc.splitTextToSize(application.synopsis, pageWidth - 2 * margin);
      doc.text(splitSynopsis, margin, yPosition);
      yPosition += splitSynopsis.length * 5 + 10;

      // Scores (if available)
      if (application.scores && application.scores.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Evaluation Scores', margin, yPosition);
        yPosition += 10;

        const scoreHeaders = ['Judge', 'Technical', 'Story', 'Creativity', 'Overall', 'Total', 'Date'];
        const scoreData = application.scores.map((score: any) => [
          score.adminName,
          score.technical.toString(),
          score.story.toString(),
          score.creativity.toString(),
          score.overall.toString(),
          score.totalScore.toString(),
          format(score.scoredAt, 'PP')
        ]);

        (doc as any).autoTable({
          head: [scoreHeaders],
          body: scoreData,
          startY: yPosition,
          margin: { left: margin, right: margin },
          styles: { fontSize: 8 },
          headStyles: { fillColor: [170, 70, 38] }
        });
      }

      this.updateProgress('generating', 80, 'Finalizing PDF...');

      // Save the PDF
      const fileName = `CIFAN_Application_${application.id}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      doc.save(fileName);

      this.updateProgress('complete', 100, 'PDF generated successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      this.updateProgress('error', 0, 'PDF generation failed.');
      throw error;
    }
  }

  /**
   * Filter applications based on export options
   */
  private filterApplications(applications: any[], options: ExportOptions): any[] {
    let filtered = [...applications];

    // Filter by categories
    if (options.categories && options.categories.length > 0) {
      filtered = filtered.filter(app => options.categories!.includes(app.competitionCategory));
    }

    // Filter by statuses
    if (options.statuses && options.statuses.length > 0) {
      filtered = filtered.filter(app => options.statuses!.includes(app.status));
    }

    // Filter by date range
    if (options.dateRange) {
      filtered = filtered.filter(app => {
        const appDate = app.submittedAt || app.createdAt;
        if (options.dateRange!.start && appDate < options.dateRange!.start) return false;
        if (options.dateRange!.end && appDate > options.dateRange!.end) return false;
        return true;
      });
    }

    return filtered;
  }

  /**
   * Export to CSV format
   */
  private async exportToCSV(applications: any[], options: ExportOptions): Promise<void> {
    this.updateProgress('generating', 60, 'Generating CSV...');

    const headers = [
      'Application ID',
      'Film Title (EN)',
      'Film Title (TH)',
      'Director Name',
      'Category',
      'Status',
      'Duration (min)',
      'Format',
      'Country',
      'Submitted Date',
      'Created Date'
    ];

    if (options.includeScores) {
      headers.push('Average Score', 'Total Judges', 'Technical Avg', 'Story Avg', 'Creativity Avg', 'Overall Avg');
    }

    const csvContent = [
      headers.join(','),
      ...applications.map(app => {
        const row = [
          app.id,
          `"${app.filmTitle}"`,
          `"${app.filmTitleTh || ''}"`,
          `"${app.directorName || app.submitterName}"`,
          app.competitionCategory,
          app.status,
          app.duration,
          app.format,
          app.country,
          app.submittedAt ? format(app.submittedAt, 'yyyy-MM-dd') : '',
          format(app.createdAt, 'yyyy-MM-dd')
        ];

        if (options.includeScores && app.scores) {
          const avgScore = app.scores.reduce((sum: number, score: any) => sum + score.totalScore, 0) / app.scores.length;
          const avgTechnical = app.scores.reduce((sum: number, score: any) => sum + score.technical, 0) / app.scores.length;
          const avgStory = app.scores.reduce((sum: number, score: any) => sum + score.story, 0) / app.scores.length;
          const avgCreativity = app.scores.reduce((sum: number, score: any) => sum + score.creativity, 0) / app.scores.length;
          const avgOverall = app.scores.reduce((sum: number, score: any) => sum + score.overall, 0) / app.scores.length;

          row.push(
            avgScore.toFixed(1),
            app.scores.length.toString(),
            avgTechnical.toFixed(1),
            avgStory.toFixed(1),
            avgCreativity.toFixed(1),
            avgOverall.toFixed(1)
          );
        }

        return row.join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = `CIFAN_Applications_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    saveAs(blob, fileName);
  }

  /**
   * Export to Excel format (CSV with Excel MIME type)
   */
  private async exportToExcel(applications: any[], options: ExportOptions): Promise<void> {
    this.updateProgress('generating', 60, 'Generating Excel file...');

    // For now, use CSV format with Excel MIME type
    // In production, you might want to use a library like xlsx
    await this.exportToCSV(applications, options);
  }

  /**
   * Export to PDF format
   */
  private async exportToPDF(applications: any[], options: ExportOptions): Promise<void> {
    this.updateProgress('generating', 60, 'Generating PDF report...');

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;

    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('CIFAN 2025 - Applications Report', margin, 30);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${format(new Date(), 'PPP')}`, margin, 45);
    doc.text(`Total Applications: ${applications.length}`, margin, 55);

    // Table data
    const headers = ['Title', 'Director', 'Category', 'Status', 'Date'];
    const data = applications.map(app => [
      app.filmTitle.length > 30 ? app.filmTitle.substring(0, 30) + '...' : app.filmTitle,
      (app.directorName || app.submitterName).length > 25 ? (app.directorName || app.submitterName).substring(0, 25) + '...' : (app.directorName || app.submitterName),
      app.competitionCategory,
      app.status,
      app.submittedAt ? format(app.submittedAt, 'MM/dd/yyyy') : format(app.createdAt, 'MM/dd/yyyy')
    ]);

    (doc as any).autoTable({
      head: [headers],
      body: data,
      startY: 70,
      margin: { left: margin, right: margin },
      styles: { fontSize: 8 },
      headStyles: { fillColor: [170, 70, 38] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    const fileName = `CIFAN_Applications_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    doc.save(fileName);
  }

  /**
   * Generate dashboard CSV
   */
  private async generateDashboardCSV(data: any): Promise<void> {
    const csvContent = [
      'CIFAN 2025 Dashboard Statistics',
      `Generated: ${format(new Date(), 'PPP')}`,
      '',
      'Overall Statistics',
      `Total Applications,${data.totalApplications}`,
      `Recent Submissions (7 days),${data.recentSubmissions}`,
      '',
      'Category Breakdown',
      'Category,Count,Percentage',
      `Youth,${data.categoryBreakdown.youth},${((data.categoryBreakdown.youth / data.totalApplications) * 100).toFixed(1)}%`,
      `Future,${data.categoryBreakdown.future},${((data.categoryBreakdown.future / data.totalApplications) * 100).toFixed(1)}%`,
      `World,${data.categoryBreakdown.world},${((data.categoryBreakdown.world / data.totalApplications) * 100).toFixed(1)}%`,
      '',
      'Status Breakdown',
      'Status,Count,Percentage',
      `Draft,${data.statusBreakdown.draft},${((data.statusBreakdown.draft / data.totalApplications) * 100).toFixed(1)}%`,
      `Submitted,${data.statusBreakdown.submitted},${((data.statusBreakdown.submitted / data.totalApplications) * 100).toFixed(1)}%`
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = `CIFAN_Dashboard_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    saveAs(blob, fileName);
  }

  /**
   * Generate dashboard PDF
   */
  private async generateDashboardPDF(data: any): Promise<void> {
    const doc = new jsPDF();
    const margin = 20;

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('CIFAN 2025 Dashboard Report', margin, 30);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${format(new Date(), 'PPP')}`, margin, 45);

    let yPosition = 65;

    // Overall Statistics
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Overall Statistics', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Applications: ${data.totalApplications}`, margin, yPosition);
    yPosition += 10;
    doc.text(`Recent Submissions (7 days): ${data.recentSubmissions}`, margin, yPosition);
    yPosition += 20;

    // Category Breakdown Table
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Category Breakdown', margin, yPosition);
    yPosition += 10;

    const categoryData = [
      ['Youth', data.categoryBreakdown.youth.toString(), `${((data.categoryBreakdown.youth / data.totalApplications) * 100).toFixed(1)}%`],
      ['Future', data.categoryBreakdown.future.toString(), `${((data.categoryBreakdown.future / data.totalApplications) * 100).toFixed(1)}%`],
      ['World', data.categoryBreakdown.world.toString(), `${((data.categoryBreakdown.world / data.totalApplications) * 100).toFixed(1)}%`]
    ];

    (doc as any).autoTable({
      head: [['Category', 'Count', 'Percentage']],
      body: categoryData,
      startY: yPosition,
      margin: { left: margin, right: margin },
      styles: { fontSize: 10 },
      headStyles: { fillColor: [170, 70, 38] }
    });

    const fileName = `CIFAN_Dashboard_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    doc.save(fileName);
  }

  /**
   * Update progress callback
   */
  private updateProgress(
    stage: ExportProgress['stage'],
    progress: number,
    message: string,
    total?: number,
    current?: number
  ): void {
    this.onProgress?.({
      stage,
      progress,
      message,
      total,
      current
    });
  }
}

export default ExportService;