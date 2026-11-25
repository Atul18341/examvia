// utils/examShuffle.ts

export interface QuestionItem {
  id: number;
  questionText: string;
  options: { A: string; B: string; C: string; D: string };
  correctAnswer?: 'Select Correct Option' | 'A' | 'B' | 'C' | 'D' | null;
}

export interface SubjectSection {
  name: string;
  questionsCount: number;
}

export function shuffleExamData(
  masterQuestions: QuestionItem[],
  subjects?: SubjectSection[],
  seedOffset: number = 13
): QuestionItem[] {
  let currentIndex = 0;
  const shuffledQuestions: QuestionItem[] = [];

  // Fallback to a single general section if no subjects are defined
  const subjectsList = subjects && subjects.length > 0 
    ? subjects 
    : [{ name: 'General', questionsCount: masterQuestions.length }];

  // Step 1: Shuffle questions independently within each section boundary
  subjectsList.forEach((sub, subIdx) => {
    const count = sub.questionsCount || 0;
    const sectionQuestions = masterQuestions.slice(currentIndex, currentIndex + count);
    currentIndex += count;

    const clonedSection = sectionQuestions.map((q) => ({
      ...q,
      options: { ...q.options }
    }));

    // Fisher-Yates deterministic shuffle per section
    for (let i = clonedSection.length - 1; i > 0; i--) {
      const j = (i * 31 + seedOffset + (subIdx + 1) * 17) % (i + 1);
      [clonedSection[i], clonedSection[j]] = [clonedSection[j], clonedSection[i]];
    }

    shuffledQuestions.push(...clonedSection);
  });

  // Handle any remaining unassigned questions
  if (currentIndex < masterQuestions.length) {
    const remaining = masterQuestions.slice(currentIndex);
    shuffledQuestions.push(...remaining);
  }

  // Step 2: Re-index global question IDs sequentially from 1 to N
  return shuffledQuestions.map((q, idx) => ({
    ...q,
    id: idx + 1
  }));
}