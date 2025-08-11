
const quizData = [
  {
    round: 'Round 1 – Who’s Who? (Kelly or Will)',
    questions: [
      'Who’s the better cook? 🍳',
      'Who takes longer to get ready? ⏳',
      'Who’s more likely to start a random dance party? 💃',
      'Who’s the bigger chatterbox? 🗣️',
      'Who’s the first to say “sorry” after an argument? 🙊',
      'Who’s most likely to cry during a sad film? 😢',
      'Who snores louder? 💤',
      'Who’s more likely to spend all day binge-watching TV? 📺',
      'Who has the better fashion sense? 👗',
      'Who’s more likely to lose their keys? 🔑',
    ],
    type: 'choice',
    options: ['Kelly', 'Will'],
  },
  {
    round: 'Round 2 - The Funnier the Better',
    questions: [
      'If Kelly & Will were an animal mash-up (two animals combined), what would they be called? 🐯🦄',
      'If Kelly had a secret superpower, what would it be? 🦸‍♀️',
      'If they entered Britain’s Got Talent, what would their act be? 🎪',
      'What’s the most useless thing they could spend all their wedding money on? 💸',
      'If Will was a cocktail, what would be in it? 🍹',
      'What’s the weirdest thing Kelly could do that Will would still find cute? 🐙',
      'What would be the title of their Netflix show? 📺',
      'If their relationship was a smell, what would it smell like? 🌸🧄',
    ],
    type: 'text',
  },
  {
    round: 'Round 3 – Guess the Facts (Write your answer)',
    questions: [
      'If Kelly could eat one food forever, what would it be? 🍕',
      'What’s Will’s worst habit? 🤔',
      'What song always gets Kelly on the dance floor? 🎶',
      'If Will won the lottery, what’s the first thing he’d buy? 💷',
      'What’s their couple “pet name” for each other? 💌',
      'If they were a celebrity couple, what would their nickname be? (e.g., Brangelina) 🌟',
    ],
    type: 'text',
  },
];

import { useState } from 'react';

type AnswerState = Record<string, string>;

export default function WeddingQuiz() {
  const [answers, setAnswers] = useState<AnswerState>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setSubmitted(true);
      setAnswers({});
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-white text-center">
        <h2 className="text-3xl font-serif font-light mb-8">Thank you for playing!</h2>
        <button
          className="bg-white text-black font-serif px-8 py-3 rounded-full shadow hover:bg-gray-200 transition-all text-lg font-semibold tracking-wide"
          onClick={() => setSubmitted(false)}
        >
          Submit another quiz
        </button>
      </div>
    );
  }

  return (
    <form className="max-w-2xl mx-auto py-12 px-4 text-white" onSubmit={handleSubmit}>
      <h2 className="text-3xl font-serif font-light mb-8 text-center">Wedding Quiz</h2>
      {quizData.map((round, i) => (
        <section key={i} className="mb-10">
          <h3 className="text-xl font-serif font-semibold mb-4 border-b border-white/20 pb-2">{round.round}</h3>
          <div className="space-y-6">
            {round.questions.map((q, idx) => {
              const key = `q${i}_${idx}`;
              return (
                <div key={idx} className="bg-black/40 rounded-lg p-4 shadow border border-white/10">
                  <p className="mb-2 font-light text-lg">{q}</p>
                  {round.type === 'choice' ? (
                    <div className="flex gap-6 mt-2">
                      {round.options?.map((opt) => (
                        <label key={opt} className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={key}
                            className="accent-white"
                            value={opt}
                            checked={answers[key] === opt}
                            onChange={() => handleChange(key, opt)}
                            required
                          />
                          <span className="font-light">{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 font-light"
                      placeholder="Your answer..."
                      value={answers[key] || ''}
                      onChange={e => handleChange(key, e.target.value)}
                      required
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
      {error && <div className="text-red-400 text-center mb-4">{error}</div>}
      <div className="text-center mt-10">
        <button
          type="submit"
          className="bg-white text-black font-serif px-8 py-3 rounded-full shadow hover:bg-gray-200 transition-all text-lg font-semibold tracking-wide disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Answers'}
        </button>
      </div>
    </form>
  );
}
