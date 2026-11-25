// components/OMRSimulator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { LocalExam } from '@/lib/db';
import QRCode from 'qrcode';

interface OMRSimulatorProps {
  exam: LocalExam;
  examId: string;
  serialNumber: string;
}

const ORGANIZER_NAME = "Let's Inspire Bihar Madhubani Chapter";
const OPTIONS = ['A', 'B', 'C', 'D'];
const BOOKLET_SERIES_LIST = ['A', 'B', 'C', 'D'];

export default function OMRSimulator({ exam, examId, serialNumber }: OMRSimulatorProps) {
  const totalQuestions = exam.totalQuestions || 100;

  // Simulated candidate & sheet state
  const [candidateName, setCandidateName] = useState('');
  const [rollNumber, setRollNumber] = useState('1234567');
  const [centerCode, setCenterCode] = useState('9901');
  const [selectedBooklet, setSelectedBooklet] = useState('A');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Scanned image export state
  const [simulateRealScan, setSimulateRealScan] = useState<boolean>(false);
  const [isRenderingImage, setIsRenderingImage] = useState<boolean>(false);
  const [scannedImageUrl, setScannedImageUrl] = useState<string>('');

  useEffect(() => {
    let active = true;
    async function makeQr() {
      try {
        const payload = JSON.stringify({
          examId,
          title: exam.examTitle,
          questions: totalQuestions,
          duration: exam.durationMinutes,
          platform: 'Examvia-LYSS'
        });
        const url = await QRCode.toDataURL(payload, {
          width: 180,
          margin: 1,
          color: { dark: '#0f172a', light: '#ffffff' }
        });
        if (active) setQrDataUrl(url);
      } catch (err) {
        console.error('Failed to generate simulator QR code:', err);
      }
    }
    makeQr();
    return () => {
      active = false;
    };
  }, [examId, exam.examTitle, exam.durationMinutes, totalQuestions]);

  const columnsCount =
    totalQuestions > 120 ? 5 : totalQuestions > 75 ? 4 : totalQuestions > 30 ? 3 : 2;
  const questionsPerColumn = Math.ceil(totalQuestions / columnsCount);

  const handleBubbleClick = (qNum: number, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qNum]: prev[qNum] === option ? '' : option
    }));
  };

  const handleFillRandom = () => {
    const randomAnswers: Record<number, string> = {};
    for (let q = 1; q <= totalQuestions; q++) {
      // Leave ~10% unattempted to simulate realistic exam behavior
      if (Math.random() > 0.1) {
        randomAnswers[q] = OPTIONS[Math.floor(Math.random() * OPTIONS.length)];
      }
    }
    setAnswers(randomAnswers);
  };

  const handleClearAll = () => {
    setAnswers({});
    setScannedImageUrl('');
  };

  /**
   * Renders a full, unclipped A4 raster image (1240 x 1754 px @ 150 DPI) matching
   * the exact proportions and fiducial corner markers of OMRTemplate.tsx.
   */
  const generateScannedSheetImage = async (): Promise<string> => {
    // A4 proportions matching 595 x 842 pt scaled by ~2.083x (150 DPI)
    const A4_W = 1240;
    const A4_H = 1754;
    const SCALE = A4_W / 595; // ~2.084

    const canvas = document.createElement('canvas');
    canvas.width = A4_W;
    canvas.height = A4_H;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');

    // Fill background (slightly off-white if simulating real scan)
    ctx.fillStyle = simulateRealScan ? '#f7f6f2' : '#ffffff';
    ctx.fillRect(0, 0, A4_W, A4_H);

    ctx.save();

    // Apply subtle realistic camera/scanner skew if enabled
    if (simulateRealScan) {
      const angleRad = ((Math.random() * 2.4 - 1.2) * Math.PI) / 180; // ±1.2 deg skew
      ctx.translate(A4_W / 2, A4_H / 2);
      ctx.rotate(angleRad);
      ctx.scale(0.985, 0.985);
      ctx.translate(-A4_W / 2, -A4_H / 2);
    }

    const s = (pt: number) => pt * SCALE;

    // 1. Top & Bottom Corner Alignment Markers (matching pdfStyles.cornerBox: 16x16pt at 10pt padding)
    const pad = s(10);
    const markerSize = s(16);
    const topMarkerY = s(12);
    const bottomMarkerY = A4_H - s(88);

    ctx.fillStyle = '#000000';
    // Top-Left & Top-Right
    ctx.fillRect(pad, topMarkerY, markerSize, markerSize);
    ctx.fillRect(A4_W - pad - markerSize, topMarkerY, markerSize, markerSize);
    // Bottom-Left & Bottom-Right
    ctx.fillRect(pad, bottomMarkerY, markerSize, markerSize);
    ctx.fillRect(A4_W - pad - markerSize, bottomMarkerY, markerSize, markerSize);

    // 2. Header Section
    const headerY = s(32);
    const headerH = s(56);

    // Logo Box (Left)
    const logoW = s(80);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(pad, headerY, logoW, headerH);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = s(1);
    ctx.strokeRect(pad, headerY, logoW, headerH);

    ctx.fillStyle = '#334155';
    ctx.font = `700 ${s(7)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText("LET'S INSPIRE", pad + logoW / 2, headerY + headerH * 0.44);
    ctx.fillText('BIHAR', pad + logoW / 2, headerY + headerH * 0.64);

    // QR Badge Box (Right)
    const qrBoxW = s(55);
    const qrBoxX = A4_W - pad - qrBoxW;
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(qrBoxX, headerY, qrBoxW, headerH);
    ctx.strokeRect(qrBoxX, headerY, qrBoxW, headerH);

    if (qrDataUrl) {
      const qrImg = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = qrDataUrl;
      });
      const qrSize = s(44);
      ctx.drawImage(qrImg, qrBoxX + (qrBoxW - qrSize) / 2, headerY + s(2), qrSize, qrSize);
    }

    ctx.fillStyle = '#475569';
    ctx.font = `600 ${s(6)}px system-ui, sans-serif`;
    ctx.fillText(examId, qrBoxX + qrBoxW / 2, headerY + headerH - s(2.5));

    // Header Center Titles
    ctx.fillStyle = '#0f172a';
    ctx.font = `700 ${s(14.5)}px system-ui, sans-serif`;
    ctx.fillText(ORGANIZER_NAME.toUpperCase(), A4_W / 2, headerY + s(22));

    ctx.fillStyle = '#334155';
    ctx.font = `700 ${s(18)}px system-ui, sans-serif`;
    ctx.fillText((exam.examTitle || 'PRATIBHA KHOJ 2026').toUpperCase(), A4_W / 2, headerY + s(44));

    // Header Bottom Divider
    const headerBottomY = headerY + headerH + s(4);
    ctx.beginPath();
    ctx.moveTo(pad, headerBottomY);
    ctx.lineTo(A4_W - pad, headerBottomY);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = s(1.5);
    ctx.stroke();

    // 3. Top Section (Candidate Info + Instructions + Booklet Series)
    const topSecY = headerBottomY + s(5);
    const topSecH = s(112);
    const gap = s(4);
    const usableW = A4_W - pad * 2;

    // Proportional widths matching flex: 2.3 : 2.1 : 1
    const totalFlex = 2.3 + 2.1 + 1;
    const infoW = ((usableW - gap * 2) * 2.3) / totalFlex;
    const instW = ((usableW - gap * 2) * 2.1) / totalFlex;
    const seriesW = ((usableW - gap * 2) * 1.0) / totalFlex;

    const infoX = pad;
    const instX = infoX + infoW + gap;
    const seriesX = instX + instW + gap;

    const drawCard = (x: number, y: number, w: number, h: number) => {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = s(1);
      ctx.strokeRect(x, y, w, h);
    };

    drawCard(infoX, topSecY, infoW, topSecH);
    drawCard(instX, topSecY, instW, topSecH);
    drawCard(seriesX, topSecY, seriesW, topSecH);

    // 3a. Candidate Information Box
    const innerPad = s(5);
    const snBadgeH = s(16);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(infoX + innerPad, topSecY + innerPad, infoW - innerPad * 2, snBadgeH);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = s(0.6);
    ctx.strokeRect(infoX + innerPad, topSecY + innerPad, infoW - innerPad * 2, snBadgeH);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#1e293b';
    ctx.font = `700 ${s(7)}px system-ui, sans-serif`;
    ctx.fillText('OMR SHEET S/N:', infoX + innerPad + s(4), topSecY + innerPad + s(11));

    ctx.textAlign = 'right';
    ctx.fillStyle = '#0f172a';
    ctx.font = `700 ${s(8)}px system-ui, sans-serif`;
    ctx.fillText(serialNumber, infoX + infoW - innerPad - s(4), topSecY + innerPad + s(11));

    const titleY = topSecY + innerPad + snBadgeH + s(12);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0f172a';
    ctx.font = `700 ${s(8.5)}px system-ui, sans-serif`;
    ctx.fillText('CANDIDATE INFORMATION / परीक्षार्थी की जानकारी', infoX + innerPad, titleY);

    ctx.beginPath();
    ctx.moveTo(infoX + innerPad, titleY + s(3));
    ctx.lineTo(infoX + infoW - innerPad, titleY + s(3));
    ctx.strokeStyle = '#e2e8f0';
    ctx.stroke();

    const labelColW = s(72);
    const valX = infoX + innerPad + labelColW;

    // Row 1: Candidate Name
    let rowY = titleY + s(14);
    ctx.fillStyle = '#334155';
    ctx.font = `700 ${s(7.5)}px system-ui, sans-serif`;
    ctx.fillText('Candidate Name:', infoX + innerPad, rowY);
    ctx.fillStyle = '#64748b';
    ctx.font = `600 ${s(7)}px system-ui, sans-serif`;
    ctx.fillText('परीक्षार्थी का नाम:', infoX + innerPad, rowY + s(8));

    const nameBoxW = infoX + infoW - innerPad - valX;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(valX, rowY - s(6), nameBoxW, s(15));
    ctx.beginPath();
    ctx.moveTo(valX, rowY + s(9));
    ctx.lineTo(valX + nameBoxW, rowY + s(9));
    ctx.strokeStyle = '#94a3b8';
    ctx.stroke();

    if (candidateName.trim()) {
      ctx.fillStyle = '#0f172a';
      ctx.font = `600 ${s(8)}px system-ui, sans-serif`;
      ctx.fillText(candidateName.trim(), valX + s(4), rowY + s(5));
    }

    // Row 2: Roll Number Comb Boxes (7 digits)
    rowY += s(21);
    ctx.fillStyle = '#334155';
    ctx.font = `700 ${s(7.5)}px system-ui, sans-serif`;
    ctx.fillText('Roll Number:', infoX + innerPad, rowY);
    ctx.fillStyle = '#64748b';
    ctx.font = `600 ${s(7)}px system-ui, sans-serif`;
    ctx.fillText('रोल नंबर:', infoX + innerPad, rowY + s(8));

    const combW = s(16);
    const combH = s(16);
    const combGap = s(2);
    for (let c = 0; c < 7; c++) {
      const bx = valX + c * (combW + combGap);
      const by = rowY - s(6);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(bx, by, combW, combH);
      ctx.strokeStyle = '#94a3b8';
      ctx.strokeRect(bx, by, combW, combH);

      const digit = rollNumber[c] || '';
      if (digit) {
        ctx.fillStyle = '#0f172a';
        ctx.font = `700 ${s(9)}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(digit, bx + combW / 2, by + combH * 0.72);
        ctx.textAlign = 'left';
      }
    }

    // Row 3: Center Code Comb Boxes (4 digits)
    rowY += s(21);
    ctx.fillStyle = '#334155';
    ctx.font = `700 ${s(7.5)}px system-ui, sans-serif`;
    ctx.fillText('Center Code:', infoX + innerPad, rowY);
    ctx.fillStyle = '#64748b';
    ctx.font = `600 ${s(7)}px system-ui, sans-serif`;
    ctx.fillText('केंद्र कोड:', infoX + innerPad, rowY + s(8));

    for (let c = 0; c < 4; c++) {
      const bx = valX + c * (combW + combGap);
      const by = rowY - s(6);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(bx, by, combW, combH);
      ctx.strokeStyle = '#94a3b8';
      ctx.strokeRect(bx, by, combW, combH);

      const digit = centerCode[c] || '';
      if (digit) {
        ctx.fillStyle = '#0f172a';
        ctx.font = `700 ${s(9)}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(digit, bx + combW / 2, by + combH * 0.72);
        ctx.textAlign = 'left';
      }
    }

    // Row 4: Allotted Time
    rowY += s(20);
    ctx.fillStyle = '#334155';
    ctx.font = `700 ${s(7.5)}px system-ui, sans-serif`;
    ctx.fillText('Allotted Time:', infoX + innerPad, rowY);
    ctx.fillStyle = '#0f172a';
    ctx.font = `700 ${s(8)}px system-ui, sans-serif`;
    ctx.fillText(`${exam.durationMinutes} Minutes / मिनट`, valX, rowY);

    // 3b. Instructions Box
    ctx.fillStyle = '#0f172a';
    ctx.font = `700 ${s(8.5)}px system-ui, sans-serif`;
    ctx.fillText('INSTRUCTIONS / निर्देश', instX + innerPad, topSecY + innerPad + s(9));

    ctx.fillStyle = '#334155';
    ctx.font = `700 ${s(7)}px system-ui, sans-serif`;
    ctx.fillText('• Use Black/Blue Ballpoint pen only.', instX + innerPad, topSecY + innerPad + s(24));
    ctx.fillStyle = '#64748b';
    ctx.font = `600 ${s(6.5)}px system-ui, sans-serif`;
    ctx.fillText('• केवल काले/नीले बॉलपॉइंट पेन का उपयोग करें।', instX + innerPad, topSecY + innerPad + s(33));

    ctx.fillStyle = '#334155';
    ctx.font = `700 ${s(7)}px system-ui, sans-serif`;
    ctx.fillText('• Do not fold or make stray marks.', instX + innerPad, topSecY + innerPad + s(46));
    ctx.fillStyle = '#64748b';
    ctx.font = `600 ${s(6.5)}px system-ui, sans-serif`;
    ctx.fillText('• इसे मोड़ें नहीं या कोई अन्य निशान न लगाएं।', instX + innerPad, topSecY + innerPad + s(55));

    // Correct vs Wrong Bubble Legend
    const legY = topSecY + innerPad + s(74);
    ctx.beginPath();
    ctx.arc(instX + innerPad + s(6), legY, s(4.5), 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.fillStyle = '#334155';
    ctx.font = `700 ${s(6.5)}px system-ui, sans-serif`;
    ctx.fillText('Correct (सही)', instX + innerPad + s(14), legY + s(2));

    const wrongX = instX + instW * 0.52;
    ctx.beginPath();
    ctx.arc(wrongX, legY, s(4.5), 0, Math.PI * 2);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = s(0.8);
    ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.textAlign = 'center';
    ctx.fillText('✕', wrongX, legY + s(2));
    ctx.textAlign = 'left';
    ctx.fillStyle = '#334155';
    ctx.fillText('Wrong (गलत)', wrongX + s(8), legY + s(2));

    // 3c. Booklet Series Box (Filled Bubble for selectedBooklet)
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f172a';
    ctx.font = `700 ${s(8.5)}px system-ui, sans-serif`;
    ctx.fillText('BOOKLET', seriesX + seriesW / 2, topSecY + innerPad + s(9));
    ctx.fillStyle = '#64748b';
    ctx.font = `700 ${s(6.5)}px system-ui, sans-serif`;
    ctx.fillText('पुस्तिका', seriesX + seriesW / 2, topSecY + innerPad + s(18));

    const seriesStep = (seriesW - innerPad * 2) / 4;
    BOOKLET_SERIES_LIST.forEach((series, idx) => {
      const cx = seriesX + innerPad + seriesStep * idx + seriesStep / 2;
      const cy = topSecY + s(56);
      const r = s(7);
      const isFilled = selectedBooklet === series;

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = isFilled ? '#0f172a' : '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = s(1);
      ctx.stroke();

      ctx.fillStyle = isFilled ? '#ffffff' : '#0f172a';
      ctx.font = `700 ${s(7)}px system-ui, sans-serif`;
      ctx.fillText(series, cx, cy + s(2.5));
    });

    // 4. Meta Bar
    const metaY = topSecY + topSecH + s(5);
    const metaH = s(16);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(pad, metaY, usableW, metaH);

    ctx.fillStyle = '#ffffff';
    ctx.font = `700 ${s(7.5)}px system-ui, sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText('QUESTION RESPONSE AREA / प्रश्न उत्तर क्षेत्र', pad + s(6), metaY + s(11));
    ctx.textAlign = 'center';
    ctx.fillText(`SECURE CODE: ${examId}`, A4_W / 2, metaY + s(11));
    ctx.textAlign = 'right';
    ctx.fillText(`TOTAL Qs: ${totalQuestions}`, A4_W - pad - s(6), metaY + s(11));

    // 5. Question Response Grid (Exact SVG Geometry Mirror from OMRTemplate.tsx)
    const gridY = metaY + metaH + s(5);
    const gridH = s(515);
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(pad, gridY, usableW, gridH);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = s(1);
    ctx.strokeRect(pad, gridY, usableW, gridH);

    const gridInnerPad = s(4);
    const colAreaY = gridY + gridInnerPad;
    const svgColHeightPt = 507;
    const svgColWidthPt = Math.floor((565 - columnsCount * 4) / columnsCount);
    const rowStepPt = svgColHeightPt / Math.max(1, questionsPerColumn);

    const maxRadiusByRow = (rowStepPt - 2.2) / 2;
    const maxRadiusByWidth = (svgColWidthPt - 28) / 10;
    const baseRadius = totalQuestions > 120 ? 4.8 : totalQuestions > 75 ? 5.5 : 6.5;
    const bubbleRadiusPt = Math.max(3.2, Math.min(baseRadius, maxRadiusByRow, maxRadiusByWidth));
    const bubbleGapPt = Math.max(2.5, Math.min(4.5, (svgColWidthPt - 24 - bubbleRadiusPt * 8) / 4));
    const labelXPt = 16;
    const firstBubbleXPt = labelXPt + 8 + bubbleRadiusPt;
    const fontSizeNumPt = Math.min(7.5, Math.max(5.5, bubbleRadiusPt * 1.15));
    const optFontSizePt = bubbleRadiusPt * 0.9;

    const colSlotW = (usableW - gridInnerPad * 2) / columnsCount;

    for (let colIdx = 0; colIdx < columnsCount; colIdx++) {
      const startQ = colIdx * questionsPerColumn + 1;
      const endQ = Math.min((colIdx + 1) * questionsPerColumn, totalQuestions);
      const rowCount = endQ - startQ + 1;
      const colOriginX = pad + gridInnerPad + colIdx * colSlotW + s(2);

      for (let index = 0; index < rowCount; index++) {
        const qNum = startQ + index;
        const formattedQNum = qNum < 10 ? `0${qNum}` : `${qNum}`;
        const isGroupBoundary = qNum % 5 === 0 && qNum !== totalQuestions;
        const cy = colAreaY + s(index * rowStepPt + rowStepPt / 2);
        const dividerY = colAreaY + s((index + 1) * rowStepPt);

        // Question Number Label
        ctx.textAlign = 'right';
        ctx.fillStyle = '#1e293b';
        ctx.font = `700 ${s(fontSizeNumPt)}px system-ui, sans-serif`;
        ctx.fillText(formattedQNum, colOriginX + s(labelXPt), cy + s(fontSizeNumPt * 0.35));

        // Option Bubbles (A, B, C, D)
        OPTIONS.forEach((opt, optIdx) => {
          const cx = colOriginX + s(firstBubbleXPt + optIdx * (bubbleRadiusPt * 2 + bubbleGapPt));
          const r = s(bubbleRadiusPt);
          const isFilled = answers[qNum] === opt;

          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fillStyle = isFilled ? '#0f172a' : '#ffffff';
          ctx.fill();
          ctx.strokeStyle = isFilled ? '#0f172a' : '#475569';
          ctx.lineWidth = s(0.9);
          ctx.stroke();

          ctx.textAlign = 'center';
          ctx.fillStyle = isFilled ? '#ffffff' : '#334155';
          ctx.font = `700 ${s(optFontSizePt)}px system-ui, sans-serif`;
          ctx.fillText(opt, cx, cy + s(optFontSizePt * 0.35));
        });

        // 5-row Group Divider
        if (isGroupBoundary) {
          ctx.beginPath();
          ctx.moveTo(colOriginX + s(2), dividerY);
          ctx.lineTo(colOriginX + s(svgColWidthPt - 2), dividerY);
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = s(0.6);
          ctx.stroke();
        }
      }
    }

    // 6. Signature Lines & Footer
    const sigSectionY = bottomMarkerY + markerSize + s(6);
    ctx.beginPath();
    ctx.moveTo(pad, sigSectionY);
    ctx.lineTo(A4_W - pad, sigSectionY);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = s(0.6);
    ctx.stroke();

    const sigLineY = sigSectionY + s(32);
    const sigW = s(150);

    // Candidate Signature
    ctx.beginPath();
    ctx.moveTo(pad, sigLineY);
    ctx.lineTo(pad + sigW, sigLineY);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = s(1);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#1e293b';
    ctx.font = `700 ${s(6)}px system-ui, sans-serif`;
    ctx.fillText('Candidate Signature', pad, sigLineY + s(8));
    ctx.textAlign = 'right';
    ctx.fillStyle = '#64748b';
    ctx.font = `600 ${s(5.5)}px system-ui, sans-serif`;
    ctx.fillText('परीक्षार्थी के हस्ताक्षर', pad + sigW, sigLineY + s(8));

    // Invigilator Signature
    const invX = A4_W - pad - sigW;
    ctx.beginPath();
    ctx.moveTo(invX, sigLineY);
    ctx.lineTo(A4_W - pad, sigLineY);
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#1e293b';
    ctx.font = `700 ${s(6)}px system-ui, sans-serif`;
    ctx.fillText('Invigilator Signature / Stamp', invX, sigLineY + s(8));
    ctx.textAlign = 'right';
    ctx.fillStyle = '#64748b';
    ctx.font = `600 ${s(5.5)}px system-ui, sans-serif`;
    ctx.fillText('कक्ष निरीक्षक के हस्ताक्षर / मुहर', A4_W - pad, sigLineY + s(8));

    // Footer
    const footerY = sigLineY + s(18);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = `600 ${s(7)}px system-ui, sans-serif`;
    ctx.fillText('Powered By Examvia Platform by LYSS Technology, Madhubani.', A4_W / 2, footerY);

    ctx.restore();

    // Add subtle scanner grain/noise if simulating real scan
    if (simulateRealScan) {
      const imgData = ctx.getImageData(0, 0, A4_W, A4_H);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 16) {
        const noise = Math.floor(Math.random() * 14 - 7);
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
      }
      ctx.putImageData(imgData, 0, 0);
    }

    return canvas.toDataURL('image/png', 1.0);
  };

  const handleGenerateScannedImage = async () => {
    setIsRenderingImage(true);
    try {
      const dataUrl = await generateScannedSheetImage();
      setScannedImageUrl(dataUrl);

      const scanPayload = {
        examId,
        serialNumber,
        candidateName: candidateName.trim(),
        rollNumber,
        centerCode,
        bookletSeries: selectedBooklet,
        answers,
        imageResolution: '1240x1754 (A4 150 DPI)',
        simulatedScanNoise: simulateRealScan,
        timestamp: new Date().toISOString()
      };
      console.log('Generated Scannable OMR Image + Ground Truth Payload:', scanPayload);
    } catch (error) {
      console.error('Failed to generate scanned OMR image:', error);
      alert('Failed to render scanned OMR image. Check console for details.');
    } finally {
      setIsRenderingImage(false);
    }
  };

  const handleDownloadScannedImage = () => {
    if (!scannedImageUrl) return;
    const link = document.createElement('a');
    link.href = scannedImageUrl;
    link.download = `OMR_Scan_${serialNumber}_${selectedBooklet}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={simStyles.container}>
      <div style={simStyles.header}>
        <h2 style={simStyles.title}>Examvia Digital OMR Testing Simulator</h2>
        <p style={simStyles.subtitle}>
          Fill bubbles interactively, then render a full 150 DPI A4 scannable PNG image with corner alignment markers.
        </p>

        {/* Quick Simulator Utility Controls */}
        <div style={simStyles.toolbar}>
          <button type="button" onClick={handleFillRandom} style={simStyles.toolBtn}>
            Auto-Fill Random Answers
          </button>
          <button type="button" onClick={handleClearAll} style={simStyles.toolBtnSecondary}>
            Clear All Bubbles
          </button>
          <label style={simStyles.checkboxLabel}>
            <input
              type="checkbox"
              checked={simulateRealScan}
              onChange={(e) => setSimulateRealScan(e.target.checked)}
            />
            Simulate Real Scan Skew &amp; Noise
          </label>
        </div>
      </div>

      {/* Interactive A4-Proportioned OMR Sheet */}
      <div style={simStyles.sheet}>
        <div style={simStyles.cornerRow}>
          <div style={simStyles.cornerBox} />
          <div style={simStyles.cornerBox} />
        </div>

        <div style={simStyles.sheetHeader}>
          <div style={simStyles.logoBox}>
            <span style={simStyles.logoText}>LET&apos;S INSPIRE</span>
            <span style={simStyles.logoText}>BIHAR</span>
          </div>

          <div style={simStyles.headerCenter}>
            <div style={simStyles.organizerTitle}>{ORGANIZER_NAME.toUpperCase()}</div>
            <div style={simStyles.examTitle}>{(exam.examTitle || 'EXAMINATION').toUpperCase()}</div>
          </div>

          <div style={simStyles.qrBox}>
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Exam QR" style={simStyles.qrImg} />
            ) : (
              <div style={simStyles.qrFallback}>QR</div>
            )}
            <span style={simStyles.qrCodeLabel}>{examId}</span>
          </div>
        </div>

        <div style={simStyles.topSection}>
          <div style={simStyles.infoBox}>
            <div style={simStyles.serialRow}>
              <span style={simStyles.serialLabel}>OMR SHEET S/N:</span>
              <span style={simStyles.serialValue}>{serialNumber}</span>
            </div>
            <div style={simStyles.boxTitle}>CANDIDATE INFORMATION / परीक्षार्थी की जानकारी</div>

            <div style={simStyles.infoRow}>
              <div style={simStyles.labelPair}>
                <span style={simStyles.labelEn}>Candidate Name:</span>
                <span style={simStyles.labelHi}>परीक्षार्थी का नाम:</span>
              </div>
              <input
                type="text"
                placeholder="Enter full name..."
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                style={simStyles.nameInput}
              />
            </div>

            <div style={simStyles.infoRow}>
              <div style={simStyles.labelPair}>
                <span style={simStyles.labelEn}>Roll Number:</span>
                <span style={simStyles.labelHi}>रोल नंबर:</span>
              </div>
              <input
                type="text"
                maxLength={7}
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value.replace(/\D/g, '').slice(0, 7))}
                style={simStyles.combInput}
                aria-label="Roll Number"
              />
            </div>

            <div style={simStyles.infoRow}>
              <div style={simStyles.labelPair}>
                <span style={simStyles.labelEn}>Center Code:</span>
                <span style={simStyles.labelHi}>केंद्र कोड:</span>
              </div>
              <input
                type="text"
                maxLength={4}
                value={centerCode}
                onChange={(e) => setCenterCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                style={simStyles.combInputShort}
                aria-label="Center Code"
              />
            </div>

            <div style={simStyles.infoRow}>
              <div style={simStyles.labelPair}>
                <span style={simStyles.labelEn}>Allotted Time:</span>
                <span style={simStyles.labelHi}>निर्धारित समय:</span>
              </div>
              <span style={simStyles.staticValue}>{exam.durationMinutes} Minutes / मिनट</span>
            </div>
          </div>

          <div style={simStyles.instructionBox}>
            <div style={simStyles.boxTitle}>INSTRUCTIONS / निर्देश</div>
            <div style={simStyles.instItem}>
              <div style={simStyles.instEn}>• Use Black/Blue Ballpoint pen only.</div>
              <div style={simStyles.instHi}>• केवल काले/नीले बॉलपॉइंट पेन का उपयोग करें।</div>
            </div>
            <div style={simStyles.instItem}>
              <div style={simStyles.instEn}>• Do not fold or make stray marks.</div>
              <div style={simStyles.instHi}>• इसे मोड़ें नहीं या कोई अन्य निशान न लगाएं।</div>
            </div>

            <div style={simStyles.legendRow}>
              <div style={simStyles.legendItem}>
                <span style={simStyles.dotCorrect} />
                <div>
                  <div style={simStyles.legendEn}>Correct (पूर्ण)</div>
                  <div style={simStyles.legendHi}>सही तरीका</div>
                </div>
              </div>
              <div style={simStyles.legendItem}>
                <span style={simStyles.dotWrong}>✕</span>
                <div>
                  <div style={simStyles.legendEn}>Wrong (गलत)</div>
                  <div style={simStyles.legendHi}>गलत तरीका</div>
                </div>
              </div>
            </div>
          </div>

          <div style={simStyles.seriesBox}>
            <div style={simStyles.seriesTitleWrap}>
              <div style={simStyles.boxTitle}>BOOKLET</div>
              <div style={simStyles.seriesSubHi}>पुस्तिका</div>
            </div>
            <div style={simStyles.seriesList}>
              {BOOKLET_SERIES_LIST.map((series) => {
                const active = selectedBooklet === series;
                return (
                  <button
                    key={series}
                    type="button"
                    onClick={() => setSelectedBooklet(series)}
                    style={{
                      ...simStyles.seriesCircleBtn,
                      backgroundColor: active ? '#0f172a' : '#ffffff',
                      color: active ? '#ffffff' : '#0f172a'
                    }}
                  >
                    {series}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={simStyles.metaBar}>
          <span>QUESTION RESPONSE AREA / प्रश्न उत्तर क्षेत्र</span>
          <span>SECURE CODE: {examId}</span>
          <span>TOTAL Qs: {totalQuestions}</span>
        </div>

        <div
          style={{
            ...simStyles.gridColumnsWrap,
            gridTemplateColumns: `repeat(${columnsCount}, minmax(0, 1fr))`
          }}
        >
          {Array.from({ length: columnsCount }).map((_, colIdx) => {
            const startQ = colIdx * questionsPerColumn + 1;
            const endQ = Math.min((colIdx + 1) * questionsPerColumn, totalQuestions);
            const qNums = Array.from({ length: Math.max(0, endQ - startQ + 1) }, (__, idx) => startQ + idx);

            return (
              <div key={colIdx} style={simStyles.columnCard}>
                {qNums.map((qNum) => {
                  const formattedQ = qNum < 10 ? `0${qNum}` : `${qNum}`;
                  const isGroupBoundary = qNum % 5 === 0 && qNum !== totalQuestions;

                  return (
                    <div
                      key={qNum}
                      style={{
                        ...simStyles.questionRow,
                        borderBottom: isGroupBoundary ? '1px solid #cbd5e1' : 'none',
                        paddingBottom: isGroupBoundary ? '4px' : '2px',
                        marginBottom: isGroupBoundary ? '3px' : '1px'
                      }}
                    >
                      <span style={simStyles.qNum}>{formattedQ}</span>
                      <div style={simStyles.bubblesRow}>
                        {OPTIONS.map((opt) => {
                          const isSelected = answers[qNum] === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleBubbleClick(qNum, opt)}
                              style={{
                                ...simStyles.bubbleBtn,
                                backgroundColor: isSelected ? '#0f172a' : '#ffffff',
                                color: isSelected ? '#ffffff' : '#334155'
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div style={simStyles.cornerRow}>
          <div style={simStyles.cornerBox} />
          <div style={simStyles.cornerBox} />
        </div>

        <div style={simStyles.signatureRow}>
          <div style={simStyles.sigBlock}>
            <div style={simStyles.sigLine} />
            <div style={simStyles.sigLabels}>
              <span style={simStyles.sigEn}>Candidate Signature</span>
              <span style={simStyles.sigHi}>परीक्षार्थी के हस्ताक्षर</span>
            </div>
          </div>
          <div style={simStyles.sigBlock}>
            <div style={simStyles.sigLine} />
            <div style={simStyles.sigLabels}>
              <span style={simStyles.sigEn}>Invigilator Signature / Stamp</span>
              <span style={simStyles.sigHi}>कक्ष निरीक्षक के हस्ताक्षर / मुहर</span>
            </div>
          </div>
        </div>

        <div style={simStyles.footer}>
          Powered By Examvia Platform by LYSS Technology, Madhubani.
        </div>
      </div>

      {/* Generate & Download Scannable Image Actions */}
      <div style={simStyles.actionFooter}>
        <button
          type="button"
          onClick={handleGenerateScannedImage}
          disabled={isRenderingImage}
          style={simStyles.scanButton}
        >
          {isRenderingImage ? 'Rendering Scannable A4 Image...' : 'Generate Scanned OMR Image (PNG)'}
        </button>

        {scannedImageUrl && (
          <button
            type="button"
            onClick={handleDownloadScannedImage}
            style={simStyles.downloadButton}
          >
            Download PNG for Scanner ({serialNumber})
          </button>
        )}
      </div>

      {/* Generated Scannable Image Preview */}
      {scannedImageUrl && (
        <div style={simStyles.outputCard}>
          <div style={simStyles.outputHeader}>
            <span>Generated Scannable Image Output (1240 × 1754 px A4 @ 150 DPI)</span>
            <span style={simStyles.outputBadge}>Ready for CV / OMR Scanner</span>
          </div>
          <img
            src={scannedImageUrl}
            alt={`Scanned OMR Sheet ${serialNumber}`}
            style={simStyles.outputPreviewImg}
          />
        </div>
      )}
    </div>
  );
}

const simStyles: Record<string, React.CSSProperties> = {
  container: {
    padding: '20px',
    maxWidth: '920px',
    margin: '0 auto',
    fontFamily: '"Noto Sans Devanagari", system-ui, -apple-system, sans-serif'
  },
  header: {
    textAlign: 'center',
    marginBottom: '16px'
  },
  title: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#0f172a',
    margin: '0 0 4px 0'
  },
  subtitle: {
    fontSize: '13px',
    color: '#64748b',
    margin: '0 0 12px 0'
  },
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px'
  },
  toolBtn: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    border: 'none',
    padding: '7px 14px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer'
  },
  toolBtnSecondary: {
    backgroundColor: '#ffffff',
    color: '#0f172a',
    border: '1px solid #cbd5e1',
    padding: '7px 14px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer'
  },
  checkboxLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#334155',
    cursor: 'pointer',
    backgroundColor: '#f1f5f9',
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1'
  },
  sheet: {
    backgroundColor: '#ffffff',
    border: '1.5px solid #0f172a',
    borderRadius: '6px',
    padding: '12px',
    boxShadow: '0 6px 16px rgba(15, 23, 42, 0.08)'
  },
  cornerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
    marginTop: '2px'
  },
  cornerBox: {
    width: '14px',
    height: '14px',
    backgroundColor: '#0f172a'
  },
  sheetHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    borderBottom: '1.5px solid #0f172a',
    paddingBottom: '8px',
    marginBottom: '8px'
  },
  logoBox: {
    width: '72px',
    height: '52px',
    border: '1px solid #0f172a',
    backgroundColor: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  logoText: {
    fontSize: '8px',
    fontWeight: 700,
    color: '#334155',
    lineHeight: 1.2
  },
  headerCenter: {
    flex: 1,
    textAlign: 'center'
  },
  organizerTitle: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#0f172a',
    letterSpacing: '0.4px'
  },
  examTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#334155',
    marginTop: '2px'
  },
  qrBox: {
    width: '54px',
    border: '1px solid #0f172a',
    backgroundColor: '#f8fafc',
    padding: '3px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexShrink: 0
  },
  qrImg: {
    width: '44px',
    height: '44px'
  },
  qrFallback: {
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    color: '#64748b'
  },
  qrCodeLabel: {
    fontSize: '8px',
    color: '#475569',
    marginTop: '2px'
  },
  topSection: {
    display: 'grid',
    gridTemplateColumns: '2.3fr 2.1fr 0.85fr',
    gap: '8px',
    marginBottom: '8px'
  },
  infoBox: {
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    padding: '8px',
    backgroundColor: '#f8fafc'
  },
  serialRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e2e8f0',
    border: '1px solid #94a3b8',
    borderRadius: '3px',
    padding: '3px 6px',
    marginBottom: '6px'
  },
  serialLabel: {
    fontSize: '9px',
    fontWeight: 700,
    color: '#1e293b'
  },
  serialValue: {
    fontSize: '10px',
    fontWeight: 700,
    color: '#0f172a',
    letterSpacing: '0.5px'
  },
  boxTitle: {
    fontSize: '10px',
    fontWeight: 700,
    color: '#0f172a',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '3px',
    marginBottom: '6px'
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '6px',
    marginBottom: '6px'
  },
  labelPair: {
    width: '95px',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0
  },
  labelEn: {
    fontSize: '9.5px',
    fontWeight: 700,
    color: '#334155',
    lineHeight: 1.15
  },
  labelHi: {
    fontSize: '9px',
    color: '#64748b',
    lineHeight: 1.15
  },
  nameInput: {
    flex: 1,
    padding: '3px 6px',
    fontSize: '11px',
    color: '#0f172a',
    backgroundColor: '#ffffff',
    border: 'none',
    borderBottom: '1px solid #94a3b8',
    outline: 'none'
  },
  combInput: {
    width: '112px',
    padding: '3px 6px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '5px',
    color: '#0f172a',
    backgroundColor: '#ffffff',
    border: '1px solid #94a3b8',
    borderRadius: '2px',
    outline: 'none'
  },
  combInputShort: {
    width: '74px',
    padding: '3px 6px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '5px',
    color: '#0f172a',
    backgroundColor: '#ffffff',
    border: '1px solid #94a3b8',
    borderRadius: '2px',
    outline: 'none'
  },
  staticValue: {
    flex: 1,
    fontSize: '10px',
    fontWeight: 700,
    color: '#0f172a'
  },
  instructionBox: {
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    padding: '8px',
    backgroundColor: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  instItem: {
    marginBottom: '4px'
  },
  instEn: {
    fontSize: '9.5px',
    fontWeight: 700,
    color: '#334155',
    lineHeight: 1.2
  },
  instHi: {
    fontSize: '9px',
    color: '#64748b',
    lineHeight: 1.2
  },
  legendRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '6px',
    borderTop: '1px solid #cbd5e1',
    paddingTop: '5px',
    marginTop: '4px'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  dotCorrect: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#0f172a',
    display: 'inline-block'
  },
  dotWrong: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    border: '1px solid #ef4444',
    color: '#ef4444',
    fontSize: '7px',
    fontWeight: 700,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  legendEn: {
    fontSize: '8px',
    fontWeight: 700,
    color: '#334155',
    lineHeight: 1.1
  },
  legendHi: {
    fontSize: '8px',
    color: '#64748b',
    lineHeight: 1.1
  },
  seriesBox: {
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    padding: '8px 6px',
    backgroundColor: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  seriesTitleWrap: {
    textAlign: 'center',
    width: '100%'
  },
  seriesSubHi: {
    fontSize: '8.5px',
    fontWeight: 700,
    color: '#64748b',
    marginTop: '-4px',
    marginBottom: '4px'
  },
  seriesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    alignItems: 'center'
  },
  seriesCircleBtn: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    border: '1px solid #475569',
    fontSize: '10px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  metaBar: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    padding: '5px 10px',
    borderRadius: '3px',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px',
    fontWeight: 700,
    marginBottom: '8px'
  },
  gridColumnsWrap: {
    display: 'grid',
    gap: '8px',
    backgroundColor: '#fafafa',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    padding: '8px',
    maxHeight: '520px',
    overflowY: 'auto'
  },
  columnCard: {
    display: 'flex',
    flexDirection: 'column'
  },
  questionRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '4px'
  },
  qNum: {
    fontSize: '10px',
    fontWeight: 700,
    color: '#1e293b',
    width: '20px',
    textAlign: 'right'
  },
  bubblesRow: {
    display: 'flex',
    gap: '4px'
  },
  bubbleBtn: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: '1px solid #475569',
    fontSize: '9px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0
  },
  signatureRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '24px',
    borderTop: '1px solid #cbd5e1',
    paddingTop: '18px',
    marginTop: '8px'
  },
  sigBlock: {
    flex: 1,
    maxWidth: '220px'
  },
  sigLine: {
    borderBottom: '1px solid #0f172a',
    height: '14px',
    marginBottom: '3px'
  },
  sigLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '8.5px'
  },
  sigEn: {
    fontWeight: 700,
    color: '#1e293b'
  },
  sigHi: {
    color: '#64748b'
  },
  footer: {
    borderTop: '1px solid #e2e8f0',
    marginTop: '10px',
    paddingTop: '5px',
    textAlign: 'center',
    fontSize: '9.5px',
    color: '#64748b'
  },
  actionFooter: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '16px'
  },
  scanButton: {
    backgroundColor: '#059669',
    color: '#ffffff',
    border: 'none',
    padding: '11px 22px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(5, 150, 105, 0.25)'
  },
  downloadButton: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    border: 'none',
    padding: '11px 22px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(15, 23, 42, 0.25)'
  },
  outputCard: {
    marginTop: '20px',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)'
  },
  outputHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    backgroundColor: '#f1f5f9',
    borderBottom: '1px solid #cbd5e1',
    fontSize: '12px',
    fontWeight: 700,
    color: '#334155'
  },
  outputBadge: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '3px 8px',
    borderRadius: '9999px',
    fontSize: '11px',
    fontWeight: 700
  },
  outputPreviewImg: {
    display: 'block',
    width: '100%',
    maxWidth: '620px',
    margin: '16px auto',
    border: '1px solid #94a3b8',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)'
  }
};