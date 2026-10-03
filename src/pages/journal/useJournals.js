import { useState } from 'react';

const STORAGE_KEY = 'sidelark-journals';

const DUMMY_JOURNALS = [
  {
    id: '1',
    content: 'Today I made steady progress on the calendar view. The small details are starting to make the whole app feel more useful.',
    createdAt: '2026-09-28T08:30:00.000Z',
    updatedAt: '2026-09-28T08:30:00.000Z',
  },
  {
    id: '2',
    content: 'A quiet morning walk helped me clear my head. I want to protect more time for slow thinking this week.',
    createdAt: '2026-09-25T06:45:00.000Z',
    updatedAt: '2026-09-26T07:10:00.000Z',
  },
  {
    id: '3',
    content: 'Ideas for the next study session: review database normalization, finish the API notes, and leave time for questions.',
    createdAt: '2026-09-21T17:15:00.000Z',
    updatedAt: '2026-09-21T17:15:00.000Z',
  },
];

function readJournals() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DUMMY_JOURNALS;
  } catch {
    return DUMMY_JOURNALS;
  }
}

function writeJournals(journals) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(journals));
}

export function useJournals() {
  const [journals] = useState(readJournals);
  return { data: journals, isLoading: false, isError: false };
}

export function useJournal(id) {
  const [journal] = useState(() => readJournals().find((item) => item.id === id));
  return { data: journal, isLoading: false, isError: false };
}

export function useSaveJournal(id) {
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  const mutate = (content, { onSuccess } = {}) => {
    setIsPending(true);
    setIsError(false);

    try {
      const journals = readJournals();
      const now = new Date().toISOString();
      const existing = id ? journals.find((journal) => journal.id === id) : null;
      const saved = existing
        ? { ...existing, content, updatedAt: now }
        : { id: String(Date.now()), content, createdAt: now, updatedAt: now };
      const next = existing
        ? journals.map((journal) => (journal.id === id ? saved : journal))
        : [saved, ...journals];

      writeJournals(next);
      onSuccess?.(saved);
    } catch {
      setIsError(true);
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending, isError };
}

