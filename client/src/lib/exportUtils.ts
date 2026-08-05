import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// ── CSV Export ─────────────────────────────────────────────────────────────────
export const exportToCSV = (
  data: Record<string, unknown>[],
  filename: string,
  headersMap: Record<string, string>,
) => {
  if (!data || !data.length) return;

  const keys = Object.keys(headersMap);
  const headerRow = Object.values(headersMap).join(',');

  const rows = data.map((item) =>
    keys
      .map((key) => {
        let val: unknown = item[key] !== undefined && item[key] !== null ? item[key] : '';
        if (typeof val === 'string') {
          val = `"${(val as string).replace(/"/g, '""')}"`;
        }
        return val;
      })
      .join(','),
  );

  const csvContent = 'data:text/csv;charset=utf-8,' + [headerRow, ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ── PDF Export (renders a DOM element to a paginated PDF) ─────────────────────
export const exportToPDF = async (elementId: string, title: string) => {
  const el = document.getElementById(elementId);
  if (!el) {
    console.error(`exportToPDF: element #${elementId} not found`);
    alert('Could not find the table element to export. Please try again.');
    return;
  }

  try {
    // Force the element to be visible for capture
    const originalDisplay = el.style.display;
    el.style.display = 'block';
    
    // Create a clone of the element to avoid modifying the original
    const clone = el.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    clone.style.width = el.offsetWidth + 'px';
    clone.style.background = '#ffffff';
    document.body.appendChild(clone);
    
    // Remove all oklch colors from the clone
    const allElements = clone.querySelectorAll('*');
    allElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.background = '';
      htmlElement.style.backgroundImage = '';
      htmlElement.style.color = '';
    });
    
    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: true,
    });
    
    // Clean up the clone
    document.body.removeChild(clone);
    el.style.display = originalDisplay;

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentW = pageW - margin * 2;

    // Title bar
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageW, pageH, 'F');
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.text(title, margin, margin + 6);
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, margin + 12);

    // Content image
    const imgH = (canvas.height / canvas.width) * contentW;
    const startY = margin + 18;
    let remaining = imgH;
    let srcY = 0;

    while (remaining > 0) {
      const sliceH = Math.min(remaining, pageH - startY - margin);
      const sliceRatio = sliceH / imgH;
      const srcSliceH = sliceRatio * canvas.height;

      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = srcSliceH;
      const ctx = sliceCanvas.getContext('2d')!;
      ctx.drawImage(canvas, 0, srcY, canvas.width, srcSliceH, 0, 0, canvas.width, srcSliceH);

      pdf.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', margin, startY, contentW, sliceH);

      remaining -= sliceH;
      srcY += srcSliceH;

      if (remaining > 0) {
        pdf.addPage();
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, pageW, pageH, 'F');
      }
    }

    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${safeTitle}_${new Date().toISOString().substring(0, 10)}.pdf`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    // Wait a bit before cleanup to ensure download starts
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl);
    }, 100);
  } catch (err) {
    console.error('PDF export failed:', err);
    alert('PDF export failed. Please check console for details and try again.');
  }
};
