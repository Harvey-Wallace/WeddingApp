'use client';

import { useState } from 'react';

const quizData = [
  {
    round: 'Round 1 - Who\'s Who?',
    description: 'Kelly or Will?',
    questions: [
      'Who\'s the better cook? 🍳',
      'Who takes longer to get ready? ⏳',
      'Who\'s more likely to start a random dance party? 💃',
      'Who\'s the bigger chatterbox? 🗣️',
      'Who\'s the first to say "sorry" after an argument? 🙊',
      'Who\'s most likely to cry during a sad film? 😢',
      'Who snores louder? 💤',
      'Who\'s more likely to spend all day binge-watching TV? 📺',
      'Who has the better fashion sense? 👗',
      'Who\'s more likely to lose their keys? 🔑',
    ],
    type: 'choice' as const,
    options: ['Kelly', 'Will'],
  },
  {
    round: 'Round 2 - The Funnier the Better',
    description: 'Get creative with your answers!',
    questions: [
      'If Kelly & Will were an animal mash-up (two animals combined), what would they be called? 🐯🦄',
      'If Kelly had a secret superpower, what would it be? 🦸‍♀️',
      'If they entered Britain\'s Got Talent, what would their act be? 🎪',
      'What\'s the most useless thing they could spend all their wedding money on? 💸',
      'If Will was a cocktail, what would be in it? 🍹',
      'What\'s the weirdest thing Kelly could do that Will would still find cute? 🐙',
      'What would be the title of their Netflix show? 📺',
      'If their relationship was a smell, what would it smell like? 🌸🧄',
    ],
    type: 'text' as const,
  },
  {
    round: 'Round 3 - Guess the Facts',
    description: 'What do you really know about Kelly & Will?',
    questions: [
      'If Kelly could eat one food forever, what would it be? 🍕',
      'What\'s Will\'s worst habit? 🤔',
      'What song always gets Kelly on the dance floor? 🎶',
      'If Will won the lottery, what\'s the first thing he\'d buy? 💷',
      'What\'s their couple "pet name" for each other? 💌',
      'If they were a celebrity couple, what would their nickname be? (e.g., Brangelina) 🌟',
    ],
    type: 'text' as const,
  },
];

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
      const response = await fetch('/api/quiz-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answers,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      setSubmitted(true);
      setAnswers({});
      
      // Auto-reset after 5 seconds for next user
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center pb-24">
        <div className="text-center px-6">
          {/* Elegant background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)]" />
          
          <div className="relative">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-white mb-4 tracking-wide">
              Thank You!
            </h2>
            <p className="text-lg text-gray-300 mb-8 font-light">
              Your answers have been submitted successfully.
            </p>
            
            {/* Elegant divider */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-px bg-gray-400"></div>
              <div className="mx-4 text-gray-400">♦</div>
              <div className="w-12 h-px bg-gray-400"></div>
            </div>
            
            <p className="text-sm text-gray-400 mb-8">
              Resetting for the next guest...
            </p>
            
            <button
              onClick={() => setSubmitted(false)}
              className="bg-white text-black font-serif px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 transition-all text-lg font-medium tracking-wide"
            >
              Submit Another Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Elegant background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)]" />
      
      <form className="relative max-w-lg mx-auto py-8 px-4 pb-32" onSubmit={handleSubmit}>
        <header className="text-center mb-12">
          {/* Monogram Style Header */}
          <div className="mb-6">
            <div className="text-4xl md:text-5xl text-white font-light tracking-widest">
              W<span className="mx-3 text-gray-400">|</span>K
            </div>
            <div className="w-24 h-px bg-white mx-auto mt-4 opacity-30"></div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-serif font-light text-white mb-4 tracking-wide">
            Wedding Quiz
          </h1>
          <p className="text-gray-300 font-light leading-relaxed">
            Test your knowledge about Kelly & Will!
          </p>
        </header>

        {quizData.map((round, roundIndex) => (
          <section key={roundIndex} className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-xl font-serif font-light text-white mb-2 tracking-wide">
                {round.round}
              </h2>
              <p className="text-sm text-gray-400 font-light">
                {round.description}
              </p>
              <div className="w-16 h-px bg-gray-600 mx-auto mt-3"></div>
            </div>

            <div className="space-y-6">
              {round.questions.map((question, questionIndex) => {
                const key = `round_${roundIndex}_q_${questionIndex}`;
                return (
                  <div 
                    key={questionIndex} 
                    className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg"
                  >
                    <p className="text-white font-light text-lg mb-4 leading-relaxed">
                      {question}
                    </p>

                    {round.type === 'choice' ? (
                      <div className="space-y-3">
                        {round.options?.map((option) => (
                          <label
                            key={option}
                            className="flex items-center p-4 rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all cursor-pointer group"
                          >
                            <input
                              type="radio"
                              name={key}
                              value={option}
                              checked={answers[key] === option}
                              onChange={() => handleChange(key, option)}
                              className="sr-only"
                              required
                            />
                            <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${
                              answers[key] === option 
                                ? 'border-white bg-white' 
                                : 'border-white/40 group-hover:border-white/60'
                            }`}>
                              {answers[key] === option && (
                                <div className="w-2 h-2 rounded-full bg-black"></div>
                              )}
                            </div>
                            <span className="text-white font-light text-lg flex-1">
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <textarea
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all font-light resize-none"
                        placeholder="Type your answer here..."
                        value={answers[key] || ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                        required
                        rows={3}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-4 mb-6 text-center">
            <p className="text-red-200 font-light">{error}</p>
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            disabled={submitting}
            className="bg-white text-black font-serif px-12 py-4 rounded-full shadow-lg hover:bg-gray-100 transition-all text-lg font-medium tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                Submitting...
              </span>
            ) : (
              'Submit Answers'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
