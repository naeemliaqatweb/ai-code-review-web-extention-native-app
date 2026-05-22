import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { CodeSubmission } from '@/types/submission';
import { format } from 'date-fns';

export const generatePDFReport = (submission: CodeSubmission) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const date = format(new Date(submission.created_at), 'MMM dd, yyyy');
  
  // 1. Header & Branding
  doc.setFillColor(79, 70, 229); // Indigo 600
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Code Analysis Report', 20, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`ReviewAI - Personalized AI Code Review`, pageWidth - 20, 25, { align: 'right' });
  
  // 2. Submission Info
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(submission.title, 20, 55);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Language: ${submission.language}`, 20, 62);
  doc.text(`Date: ${date}`, 20, 67);
  doc.text(`Submission ID: #${submission.id}`, 20, 72);
  
  // 3. Score Section
  const score = submission.analysis?.score || 0;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 80, pageWidth - 20, 80);
  
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Overall Quality Score', 20, 95);
  
  doc.setFontSize(36);
  const scoreColor = score >= 8 ? [16, 185, 129] : score >= 6 ? [245, 158, 11] : [239, 68, 68];
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.text(`${score}/10`, 20, 112);
  
  // 4. Findings Tables
  let currentY = 125;
  
  if (submission.analysis) {
    const findings = [
      { title: 'Bugs & Logic Errors', data: submission.analysis.bugs, color: [239, 68, 68] },
      { title: 'Security Vulnerabilities', data: submission.analysis.security_issues, color: [245, 158, 11] },
      { title: 'Optimization & Clean Code', data: submission.analysis.improvements, color: [59, 130, 246] }
    ];
    
    findings.forEach(category => {
      if (category.data && category.data.length > 0) {
        doc.setTextColor(category.color[0], category.color[1], category.color[2]);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(category.title, 20, currentY);
        
        autoTable(doc, {
          startY: currentY + 5,
          theme: 'striped',
          head: [['#', 'Finding Description']],
          body: category.data.map((item, index) => [index + 1, item]),
          headStyles: { fillColor: category.color as [number, number, number] },
          margin: { left: 20, right: 20 },
          styles: { fontSize: 9 }
        });
        
        currentY = (doc as any).lastAutoTable.finalY + 15;
        
        // Add new page if needed
        if (currentY > pageHeight - 30) {
          doc.addPage();
          currentY = 20;
        }
      }
    });
  }
  
  // 5. Source Code Section
  doc.addPage();
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.rect(15, 15, pageWidth - 30, 12, 'F');
  
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Original Source Code', 20, 23);
  
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 70);
  
  // Pagination for long source code
  const splitCode = doc.splitTextToSize(submission.content, pageWidth - 40);
  let codeY = 35;
  const lineHeight = 5;
  
  splitCode.forEach((line: string) => {
    if (codeY > pageHeight - 20) {
      doc.addPage();
      codeY = 20;
    }
    doc.text(line, 20, codeY);
    codeY += lineHeight;
  });
  
  // 6. Save PDF
  doc.save(`ReviewAI-Report-${submission.id}.pdf`);
};
