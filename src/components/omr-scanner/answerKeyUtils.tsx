// components/omr-scanner/answerKeyUtils.ts
import type { AnswerKeyMap, BookletSetCode, OptionLetter } from './types';

export function normalizeAnswerMap(raw: unknown): AnswerKeyMap {
  const map: AnswerKeyMap = {};
  if (!raw || typeof raw !== 'object') return map;

  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    const qNum = Number(k);
    if (!Number.isInteger(qNum) || qNum <= 0) continue;
    const opt = String(v ?? '').toUpperCase().trim();
    if (opt === 'A' || opt === 'B' || opt === 'C' || opt === 'D') {
      map[qNum] = opt;
    }
  }
  return map;
}

export function extractAnswersFromQuestions(list: unknown): AnswerKeyMap {
  const map: AnswerKeyMap = {};
  if (!Array.isArray(list)) return map;

  list.forEach((q: any, idx: number) => {
    const qNum = Number(q?.id || q?.questionNumber || idx + 1);
    const ans = String(q?.correctAnswer || q?.answer || '').toUpperCase().trim();
    if (qNum > 0 && (ans === 'A' || ans === 'B' || ans === 'C' || ans === 'D')) {
      map[qNum] = ans;
    }
  });
  return map;
}

export function resolveSetAnswerKeyFromRecord(
  record: any,
  detectedSet: BookletSetCode
): { keyMap: AnswerKeyMap; sourceLabel: string } {
  if (!record || typeof record !== 'object') {
    return { keyMap: {}, sourceLabel: 'None' };
  }

  const isSetLetter =
    detectedSet === 'A' ||
    detectedSet === 'B' ||
    detectedSet === 'C' ||
    detectedSet === 'D';

  if (isSetLetter) {
    const setKeyUpper = `SET_${detectedSet}`;
    const rawAnswerKeys = (record.answerKeys || {}) as Record<string, unknown>;
    const rawNestedAnswerKey =
      record.answerKey && typeof record.answerKey === 'object'
        ? (record.answerKey as Record<string, unknown>)
        : {};
    const rawAllSetsQuestions = (record.allSetsQuestions || {}) as Record<string, unknown>;

    const fromAllSets = extractAnswersFromQuestions(
      rawAllSetsQuestions[setKeyUpper] ?? rawAllSetsQuestions[detectedSet]
    );
    const fromNested = normalizeAnswerMap(
      rawNestedAnswerKey[detectedSet] ?? rawNestedAnswerKey[setKeyUpper]
    );
    const fromAnswerKeys = normalizeAnswerMap(
      rawAnswerKeys[setKeyUpper] ?? rawAnswerKeys[detectedSet]
    );

    const setSpecific = { ...fromAllSets, ...fromNested, ...fromAnswerKeys };
    if (Object.keys(setSpecific).length > 0) {
      return {
        keyMap: setSpecific,
        sourceLabel: `Set ${detectedSet} (IndexedDB)`,
      };
    }
  }

  const flatKey = normalizeAnswerMap(record.answerKey);
  const paperKey = extractAnswersFromQuestions(record.questionPaper);
  const legacyKey = extractAnswersFromQuestions(record.questions);
  const fallback = { ...legacyKey, ...paperKey, ...flatKey };

  if (Object.keys(fallback).length > 0) {
    return {
      keyMap: fallback,
      sourceLabel: isSetLetter
        ? `Master DB Key (Set ${detectedSet} fallback)`
        : 'Master DB Key',
    };
  }

  return { keyMap: {}, sourceLabel: 'No Key in DB' };
}

export function parseAnswerKeyInput(raw: string, maxQ: number): Record<number, OptionLetter> {
  const trimmed = raw.trim();
  if (!trimmed) return {};

  const parsed: Record<number, OptionLetter> = {};

  if (trimmed.startsWith('{')) {
    try {
      const obj = JSON.parse(trimmed);
      for (const [k, v] of Object.entries(obj)) {
        const qNum = Number(k);
        const opt = String(v).toUpperCase().trim();
        if (qNum >= 1 && qNum <= maxQ && (opt === 'A' || opt === 'B' || opt === 'C' || opt === 'D')) {
          parsed[qNum] = opt;
        }
      }
      return parsed;
    } catch {
      // Fallback to pattern parsing
    }
  }

  const pairMatches = [...trimmed.matchAll(/(\d+)\s*[:=\-.)]\s*([A-Da-d])/g)];
  if (pairMatches.length > 0) {
    for (const match of pairMatches) {
      const qNum = Number(match[1]);
      const opt = match[2].toUpperCase() as OptionLetter;
      if (qNum >= 1 && qNum <= maxQ) {
        parsed[qNum] = opt;
      }
    }
    return parsed;
  }

  const lettersOnly = trimmed.toUpperCase().replace(/[^A-D]/g, '');
  for (let i = 0; i < Math.min(lettersOnly.length, maxQ); i++) {
    parsed[i + 1] = lettersOnly[i] as OptionLetter;
  }

  return parsed;
}