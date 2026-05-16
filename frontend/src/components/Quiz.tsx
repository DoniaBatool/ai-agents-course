import React, { useState } from "react";
import styles from "./Quiz.module.css";

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;       // 0-based index
  explanation?: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  title?: string;
}

export default function Quiz({ questions, title = "Chapter Quiz" }: QuizProps) {
  const [current, setCurrent]   = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers]   = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  const isAnswered = answers[current] !== null;
  const score = answers.filter((a, i) => a === questions[i].correct).length;

  const choose = (idx: number) => {
    if (isAnswered) return;
    setSelected(idx);
    const next = [...answers];
    next[current] = idx;
    setAnswers(next);
  };

  const advance = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(answers[current + 1]);
    } else {
      setFinished(true);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers(Array(questions.length).fill(null));
    setFinished(false);
  };

  const getGrade = () => {
    const pct = (score / questions.length) * 100;
    if (pct === 100) return { label: "Perfect! 🏆",  color: "#fbbf24" };
    if (pct >= 80)   return { label: "Excellent! 🎉", color: "#4ade80" };
    if (pct >= 60)   return { label: "Good job! 👍",  color: "#60a5fa" };
    return               { label: "Keep going! 💪",   color: "#f87171" };
  };

  /* ── Finished screen ─────────────────────────────────────────────────────── */
  if (finished) {
    const grade = getGrade();
    return (
      <div className={styles.quiz}>
        <div className={styles.header}>
          <span className={styles.icon}>📝</span>
          <span className={styles.title}>{title}</span>
        </div>
        <div className={styles.results}>
          <div className={styles.scoreCircle} style={{ borderColor: grade.color }}>
            <span className={styles.scoreNum}>{score}</span>
            <span className={styles.scoreDen}>/ {questions.length}</span>
          </div>
          <p className={styles.gradeLabel} style={{ color: grade.color }}>
            {grade.label}
          </p>
          <p className={styles.gradeNote}>
            You answered {score} out of {questions.length} questions correctly.
          </p>

          {/* Review */}
          <div className={styles.review}>
            {questions.map((q, i) => (
              <div
                key={i}
                className={`${styles.reviewItem} ${
                  answers[i] === q.correct ? styles.reviewCorrect : styles.reviewWrong
                }`}
              >
                <span className={styles.reviewNum}>Q{i + 1}.</span>
                <span className={styles.reviewQ}>{q.question}</span>
                <span className={styles.reviewResult}>
                  {answers[i] === q.correct ? "✓" : `✗ → ${q.options[q.correct]}`}
                </span>
              </div>
            ))}
          </div>

          <button className={styles.retryBtn} onClick={restart}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* ── Question screen ──────────────────────────────────────────────────────── */
  return (
    <div className={styles.quiz}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.icon}>📝</span>
          <span className={styles.title}>{title}</span>
        </div>
        <span className={styles.counter}>
          {current + 1} / {questions.length}
        </span>
      </div>

      {/* Progress dots */}
      <div className={styles.dots}>
        {questions.map((_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${
              answers[i] !== null
                ? answers[i] === questions[i].correct
                  ? styles.dotCorrect
                  : styles.dotWrong
                : i === current
                ? styles.dotActive
                : ""
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <div className={styles.questionBox}>
        <p className={styles.question}>
          <span className={styles.qNum}>Q{current + 1}.</span> {q.question}
        </p>
      </div>

      {/* Options */}
      <div className={styles.options}>
        {q.options.map((opt, i) => {
          const letter = ["A", "B", "C", "D"][i];
          let state = "";
          if (isAnswered) {
            if (i === q.correct)        state = styles.optCorrect;
            else if (i === answers[current]) state = styles.optWrong;
          } else if (i === selected)    state = styles.optSelected;

          return (
            <button
              key={i}
              className={`${styles.option} ${state}`}
              onClick={() => choose(i)}
              disabled={isAnswered}
            >
              <span className={styles.optLetter}>{letter}</span>
              <span className={styles.optText}>{opt}</span>
              {isAnswered && i === q.correct && (
                <span className={styles.optIcon}>✓</span>
              )}
              {isAnswered && i === answers[current] && i !== q.correct && (
                <span className={styles.optIcon}>✗</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {isAnswered && q.explanation && (
        <div className={`${styles.explanation} ${
          answers[current] === q.correct ? styles.explanationGood : styles.explanationBad
        }`}>
          <span className={styles.explanationLabel}>
            {answers[current] === q.correct ? "✓ Correct!" : "✗ Not quite."}
          </span>
          <p>{q.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {isAnswered && (
        <div className={styles.footer}>
          <button className={styles.nextBtn} onClick={advance}>
            {current < questions.length - 1 ? "Next Question →" : "See Results →"}
          </button>
        </div>
      )}
    </div>
  );
}
