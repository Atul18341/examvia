'use server';
import { prisma } from '../lib/prisma'; // Assumes Prisma setup

export async function syncOfflineScans(scans: Array<{
  examId: string;
  studentRoll: string;
  answers: Record<string, string>;
  confidenceScore: number;
}>) {
  try {
    for (const scan of scans) {
      await prisma.result.create({
        data: {
          examId: scan.examId,
          studentRoll: scan.studentRoll,
          answers: scan.answers,
          confidenceScore: scan.confidenceScore,
        },
      });
    }
    return { success: true, syncedCount: scans.length };
  } catch (error) {
    console.error("Sync failed:", error);
    return { success: false, error: "Database sync failed" };
  }
}