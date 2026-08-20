'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  academyLessons,
  lessonsForTrack,
  type AcademyTrack,
} from '@/lib/stubbs-ai/academy';
import { createClient } from '@/lib/supabase/client';

const trackLabels: Record<AcademyTrack, string> = {
  tryamm_onboarding: 'Learn TRYAMM',
  creator_live: 'LIVE Creator School',
  marketplace_seller: 'Marketplace Seller School',
  hologpt_holoforge: 'HoloGPT + HoloForge',
  financial_basics: 'Financial Basics',
  credit: 'Credit Education',
  bills_budgeting: 'Bills + Budgeting',
  middleverse_markets: 'Middleverse Markets',
  forex: 'Forex Lab',
  small_business: 'Small Business',
};

const defaultTrack: AcademyTrack = 'tryamm_onboarding';

export default function AcademyPage() {
  const [track, setTrack] = useState<AcademyTrack>(defaultTrack);
  const [completed, setCompleted] = useState<string[]>([]);
  const [question, setQuestion] = useState('');
  const [signedIn, setSignedIn] = useState(false);
  const [coachMessage, setCoachMessage] = useState(
    'Choose a lesson. Stubbs AI will guide you step by step and keep education separate from real money actions.',
  );

  const lessons = useMemo(() => lessonsForTrack(track), [track]);
  const completedSet = useMemo(() => new Set(completed), [completed]);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function loadProgress() {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      setSignedIn(Boolean(session?.user));
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('academy_progress')
        .select('lesson_id')
        .eq('user_id', session.user.id);

      if (cancelled) return;
      if (error) {
        setCoachMessage('Academy is available, but saved progress could not be loaded. Verify migration 013 and RLS before release.');
        return;
      }
      setCompleted((data ?? []).map((row) => row.lesson_id));
    }

    void loadProgress();
    const { data: subscription } = supabase.auth.onAuthStateChange(() => {
      void loadProgress();
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  function selectLesson(id: string) {
    const lesson = academyLessons.find((item) => item.id === id);
    if (!lesson) return;
    const prerequisitesMet = lesson.prerequisites.every((prerequisite) => completedSet.has(prerequisite));
    if (!prerequisitesMet) {
      setCoachMessage(`Complete these first: ${lesson.prerequisites.join(', ')}`);
      return;
    }
    setCoachMessage(
      `${lesson.title}: ${lesson.objective}${lesson.regulatedBoundary ? ` Safety boundary: ${lesson.regulatedBoundary}` : ''}`,
    );
  }

  async function markComplete(id: string) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      setCoachMessage('Sign in to save Academy progress. You can still read and practice lessons without saving.');
      return;
    }

    const { error } = await supabase
      .from('academy_progress')
      .upsert({ user_id: session.user.id, lesson_id: id }, { onConflict: 'user_id,lesson_id' });

    if (error) {
      setCoachMessage('Progress was not saved. Verify the Academy migration/RLS before release.');
      return;
    }

    setCompleted((current) => (current.includes(id) ? current : [...current, id]));
    setCoachMessage('Lesson checkpoint saved. Next, choose another unlocked lesson.');
  }

  function askCoach() {
    const trimmed = question.trim();
    if (!trimmed) return;
    const normalized = trimmed.toLowerCase();
    if (normalized.includes('buy') || normalized.includes('trade') || normalized.includes('pay')) {
      setCoachMessage(
        'I can teach and simulate that here, but Academy does not move real money, place real trades, pay bills, top up balances, or initiate payouts. Use the separate authorized product flow for real transactions.',
      );
    } else {
      setCoachMessage(
        `Stubbs AI Academy guidance: break “${trimmed}” into one safe practice step, complete it in simulation or guided mode, review the result, then continue.`,
      );
    }
    setQuestion('');
  }

  return (
    <main className="container" style={{ paddingTop: 28, paddingBottom: 80 }}>
      <section style={{ marginBottom: 28 }}>
        <p style={{ marginBottom: 8, opacity: 0.75 }}>TRYAMM Learning</p>
        <h1 style={{ marginBottom: 12 }}>Stubbs AI Academy + Middleverse Financial Academy</h1>
        <p style={{ maxWidth: 820, lineHeight: 1.6 }}>
          Learn the app, creator tools, bills and budgeting, credit fundamentals, paper stocks, fractional paper shares,
          simulated ETF baskets, Forex and market stress testing. Education and simulation stay separate from real payment,
          securities, crypto and leveraged-FX execution.
        </p>
        <p><strong>Progress:</strong> {signedIn ? `${completed.length} lesson checkpoints saved` : 'sign in to save progress'}</p>
      </section>

      <section aria-label="Academy tracks" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
        {(Object.keys(trackLabels) as AcademyTrack[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTrack(key)}
            aria-pressed={track === key}
            style={{ padding: '10px 14px', borderRadius: 999, cursor: 'pointer' }}
          >
            {trackLabels[key]}
          </button>
        ))}
      </section>

      <section
        aria-label="Stubbs AI coach"
        style={{ padding: 20, border: '1px solid currentColor', borderRadius: 16, marginBottom: 28 }}
      >
        <h2>Stubbs AI Coach</h2>
        <p aria-live="polite" style={{ lineHeight: 1.6 }}>{coachMessage}</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') askCoach();
            }}
            placeholder="Ask how to use TRYAMM or a financial concept"
            aria-label="Ask Stubbs AI Academy"
            style={{ minWidth: 280, flex: 1, padding: 12 }}
          />
          <button type="button" onClick={askCoach}>Ask Stubbs AI</button>
        </div>
      </section>

      <section aria-labelledby="lessons-heading">
        <h2 id="lessons-heading">{trackLabels[track]}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {lessons.map((lesson) => {
            const unlocked = lesson.prerequisites.every((id) => completedSet.has(id));
            const done = completedSet.has(lesson.id);
            return (
              <article key={lesson.id} style={{ padding: 18, border: '1px solid currentColor', borderRadius: 14 }}>
                <p style={{ margin: 0, opacity: 0.7 }}>
                  {lesson.practiceMode.toUpperCase()} · {lesson.estimatedMinutes} min
                </p>
                <h3>{lesson.title}</h3>
                <p style={{ lineHeight: 1.55 }}>{lesson.objective}</p>
                {lesson.regulatedBoundary && (
                  <p style={{ fontSize: 14 }}><strong>Boundary:</strong> {lesson.regulatedBoundary}</p>
                )}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button type="button" disabled={!unlocked} onClick={() => selectLesson(lesson.id)}>
                    {unlocked ? 'Start lesson' : 'Locked'}
                  </button>
                  <button type="button" disabled={!unlocked || done} onClick={() => void markComplete(lesson.id)}>
                    {done ? 'Completed' : 'Save checkpoint'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section style={{ marginTop: 32, padding: 20, border: '1px solid currentColor', borderRadius: 16 }}>
        <h2>Middleverse Market Safety Gate</h2>
        <p style={{ lineHeight: 1.6 }}>
          Paper stocks, paper ETF baskets, fractional paper shares and paper Forex may be used for education. Real securities,
          real crypto and real leveraged Forex remain outside the launch gate until separate compliance approval and licensed
          execution/custody infrastructure are configured.
        </p>
      </section>
    </main>
  );
}
