import React from 'react';

// This declaration is needed because jsPDF is loaded from a CDN
declare global {
  interface Window {
    jspdf: any;
  }
}

interface DownloadResponseButtonProps {
  textToDownload: string;
  prompt: string;
}

const sanitizeFilename = (name: string): string => {
  const sanitized = name
    .replace(/[<>:"/\\|?*]+/g, '')
    .replace(/\s+/g, '-')
    .trim();
  return sanitized.slice(0, 60);
};


export const DownloadResponseButton: React.FC<DownloadResponseButtonProps> = ({ textToDownload, prompt }) => {
  const handleDownload = () => {
    if (!textToDownload) return;

    // @ts-ignore
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    const margin = 15; // in mm
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - margin * 2;
    let cursorY = margin;

    // --- Add Title ---
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    const title = `AI Response for: "${prompt}"`;
    const titleLines = doc.splitTextToSize(title, maxWidth);
    doc.text(titleLines, margin, cursorY);
    cursorY += (titleLines.length * 7) + 10; // Move cursor down, with a 10mm gap

    // --- Add Response Body ---
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(11);
    const lineHeight = 6; // approximate line height in mm for font size 11
    const lines = doc.splitTextToSize(textToDownload, maxWidth);

    // Iterate over lines and add them to the PDF, handling page breaks
    lines.forEach((line: string) => {
      // Check if the current line would go off the page
      if (cursorY + lineHeight > pageHeight - margin) {
        doc.addPage();
        cursorY = margin; // Reset cursor to top of new page
      }
      doc.text(line, margin, cursorY);
      cursorY += lineHeight; // Move cursor down for the next line
    });


    const filename = prompt ? `${sanitizeFilename(prompt)}-response.pdf` : 'ai-response.pdf';
    doc.save(filename);
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center space-x-2 px-3 py-1.5 text-xs rounded-full bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-cyan-400 transition-all duration-200"
      aria-label="Save AI response as a text-based PDF"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <span>Save Text as PDF</span>
    </button>
  );
};