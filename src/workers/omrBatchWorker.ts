// workers/omrBatchWorker.ts
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export interface WorkerRequest {
  templatePdfBuffer: ArrayBuffer;
  organizerName: string;
  examTitle: string;
  sheetCount: number;
}

export type WorkerResponse =
  | { type: 'PROGRESS'; current: number; total: number }
  | { type: 'DONE'; pdfBuffer: ArrayBuffer }
  | { type: 'ERROR'; message: string };

function generateSerialNumber(
  organizerName: string,
  examTitle: string,
  sequenceNum: number
): string {
  const orgInitials = organizerName
    .split(/\s+/)
    .map((word) => word.replace(/[^a-zA-Z]/g, '').charAt(0))
    .join('')
    .toUpperCase();

  const examInitials = examTitle
    .split(/\s+/)
    .map((word) => word.replace(/[^a-zA-Z]/g, '').charAt(0))
    .join('')
    .toUpperCase();

  const year = new Date().getFullYear();
  const seq = String(sequenceNum).padStart(4, '0');

  return `${orgInitials}${examInitials}${year}${seq}`;
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { templatePdfBuffer, organizerName, examTitle, sheetCount } = event.data;

  try {
    const templateDoc = await PDFDocument.load(templatePdfBuffer);
    const outDoc = await PDFDocument.create();
    const boldFont = await outDoc.embedFont(StandardFonts.HelveticaBold);

    // Pre-build an array of template page indices [0, 0, 0, ...] so pdf-lib shares the underlying page resources
    const pageIndices = Array.from({ length: sheetCount }, () => 0);
    const copiedPages = await outDoc.copyPages(templateDoc, pageIndices);

    const fontSize = 8;
    const textColor = rgb(0.059, 0.09, 0.165); // #0f172a

    // Coordinates aligned to the right side of serialBadgeRow inside infoBox (A4 height = 841.89pt)
    const badgeRightEdgeX = 240;
    const badgeTextY = 752;

    for (let i = 0; i < sheetCount; i++) {
      const page = copiedPages[i];
      const serial = generateSerialNumber(organizerName, examTitle, i + 1);
      const textWidth = boldFont.widthOfTextAtSize(serial, fontSize);

      page.drawText(serial, {
        x: badgeRightEdgeX - textWidth,
        y: badgeTextY,
        size: fontSize,
        font: boldFont,
        color: textColor,
      });

      outDoc.addPage(page);

      // Post progress every 25 sheets to keep main-thread messaging lightweight
      if ((i + 1) % 25 === 0 || i === sheetCount - 1) {
        const progressMsg: WorkerResponse = {
          type: 'PROGRESS',
          current: i + 1,
          total: sheetCount,
        };
        self.postMessage(progressMsg);
      }
    }

    const pdfBytes = await outDoc.save();
    const arrayBuffer = pdfBytes.buffer.slice(
      pdfBytes.byteOffset,
      pdfBytes.byteOffset + pdfBytes.byteLength
    ) as ArrayBuffer;

    const doneMsg: WorkerResponse = { type: 'DONE', pdfBuffer: arrayBuffer };
self.postMessage(doneMsg, { transfer: [arrayBuffer] });
  } catch (err) {
    const errorMsg: WorkerResponse = {
      type: 'ERROR',
      message: err instanceof Error ? err.message : 'Unknown worker error',
    };
    self.postMessage(errorMsg);
  }
};