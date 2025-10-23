import React, { useState, useCallback } from 'react';

// TypeScript declarations for CDN libraries
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

const sanitizeFilename = (name: string): string => {
  const sanitized = name
    .replace(/[<>:"/\\|?*]+/g, '') // Remove characters forbidden in Windows filenames
    .replace(/\s+/g, '-') // Replace whitespace with hyphens
    .trim();
  return sanitized.slice(0, 60); // Truncate to a reasonable length
};


export const usePdfDownloader = (elementRef: React.RefObject<HTMLDivElement>) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPdf = useCallback(async (filename: string = 'ai-conversation') => {
    const element = elementRef.current;
    if (!element || isDownloading) {
      return;
    }

    setIsDownloading(true);

    try {
      // @ts-ignore
      const { jsPDF } = window.jspdf;
      // @ts-ignore
      const canvas = await window.html2canvas(element, {
        backgroundColor: '#0f172a', // Solid slate-900 to match theme and improve rendering
        scale: 4, // Further increased scale for better quality
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4',
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      
      const margin = 20; // Margin in pixels
      let finalImgWidth = pdfWidth - (margin * 2);
      let finalImgHeight = finalImgWidth / ratio;
      
      if (finalImgHeight > pdfHeight - (margin * 2)) {
          finalImgHeight = pdfHeight - (margin * 2);
          finalImgWidth = finalImgHeight * ratio;
      }

      const x = (pdfWidth - finalImgWidth) / 2;
      const y = (pdfHeight - finalImgHeight) / 2;
      
      // Add a background color to the PDF page
      pdf.setFillColor(15, 23, 42); // slate-900
      pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F');

      pdf.addImage(imgData, 'PNG', x, y, finalImgWidth, finalImgHeight);
      
      // Add footer watermark
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128); // A subtle gray
      pdf.text('webo.online', pdfWidth / 2, pdfHeight - 10, { align: 'center' });
      
      const finalFilename = sanitizeFilename(filename);
      pdf.save(`${finalFilename}.pdf`);

    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('An error occurred while generating the PDF.');
    } finally {
      setIsDownloading(false);
    }
  }, [elementRef, isDownloading]);

  return { downloadPdf, isDownloading };
};
