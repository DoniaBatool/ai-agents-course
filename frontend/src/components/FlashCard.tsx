import React, { useState } from "react";
import styles from "./FlashCard.module.css";

export interface FlashCardItem {
  question: string;
  answer: string;
}

interface FlashCardDeckProps {
  cards: FlashCardItem[];
  title?: string;
}

export default function FlashCardDeck({ cards, title = "Flash Cards" }: FlashCardDeckProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mastered, setMastered] = useState<Set<number>>(new Set());

  const card = cards[index];
  const total = cards.length;
  const masteredCount = mastered.size;

  const flip = () => setFlipped((f) => !f);

  const next = () => {
    setFlipped(false);
    setTimeout(() => setIndex((i) => (i + 1) % total), 150);
  };

  const prev = () => {
    setFlipped(false);
    setTimeout(() => setIndex((i) => (i - 1 + total) % total), 150);
  };

  const toggleMaster = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMastered((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const reset = () => {
    setIndex(0);
    setFlipped(false);
    setMastered(new Set());
  };

  return (
    <div className={styles.deck}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.icon}>🃏</span>
          <span className={styles.title}>{title}</span>
        </div>
        <div className={styles.progress}>
          <span className={styles.progressText}>
            {index + 1} / {total}
          </span>
          {masteredCount > 0 && (
            <span className={styles.masteredBadge}>
              ✓ {masteredCount} mastered
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className={styles.progressBar}>
        {cards.map((_, i) => (
          <div
            key={i}
            className={`${styles.progressSegment} ${
              mastered.has(i)
                ? styles.segmentMastered
                : i === index
                ? styles.segmentActive
                : i < index
                ? styles.segmentDone
                : ""
            }`}
          />
        ))}
      </div>

      {/* Flip card */}
      <div className={styles.cardWrapper} onClick={flip}>
        <div className={`${styles.card} ${flipped ? styles.cardFlipped : ""}`}>
          {/* Front */}
          <div className={styles.cardFront}>
            <span className={styles.sideLabel}>QUESTION</span>
            <p className={styles.cardText}>{card.question}</p>
            <span className={styles.flipHint}>Click to reveal answer</span>
          </div>
          {/* Back */}
          <div className={styles.cardBack}>
            <span className={styles.sideLabel}>ANSWER</span>
            <p className={styles.cardText}>{card.answer}</p>
            <span className={styles.flipHint}>Click to see question</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button className={styles.navBtn} onClick={prev} title="Previous">
          ← Prev
        </button>

        <button
          className={`${styles.masterBtn} ${mastered.has(index) ? styles.masterBtnActive : ""}`}
          onClick={toggleMaster}
        >
          {mastered.has(index) ? "✓ Mastered" : "Mark as Mastered"}
        </button>

        <button className={styles.navBtn} onClick={next} title="Next">
          Next →
        </button>
      </div>

      {/* Completion message */}
      {masteredCount === total && (
        <div className={styles.complete}>
          🎉 You mastered all {total} cards!
          <button className={styles.resetBtn} onClick={reset}>
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}
