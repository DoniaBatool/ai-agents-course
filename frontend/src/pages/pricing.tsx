import React from 'react';
import Layout from '@theme/Layout';
import styles from './pricing.module.css';

export default function Pricing() {
  return (
    <Layout title="Pricing" description="AI Agents Development Course Pricing">
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Simple, Transparent Pricing</h1>
          <p className={styles.subtitle}>Everything you need to master AI Agents development</p>
        </div>

        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <div className={styles.badge}>Most Popular</div>
            <h2 className={styles.planName}>Full Access</h2>
            <div className={styles.price}>
              <span className={styles.currency}>$</span>
              <span className={styles.amount}>19.99</span>
              <span className={styles.period}>/month</span>
            </div>
            <p className={styles.priceNote}>Cancel anytime • No hidden fees</p>

            <ul className={styles.features}>
              <li>✅ All course modules & lessons</li>
              <li>✅ Interactive quizzes & flashcards</li>
              <li>✅ AI-powered course tutor (24/7)</li>
              <li>✅ Urdu & English support</li>
              <li>✅ Real-world projects & code examples</li>
              <li>✅ New content as it's added</li>
              <li>✅ Build & monetize your own AI products</li>
            </ul>

            <a
              href="https://ai-agents-course-w12u.vercel.app/signup"
              className={styles.ctaButton}
            >
              Start Learning Today
            </a>

            <p className={styles.guarantee}>🚀 This course is so practical, students build and launch their own AI products</p>
          </div>
        </div>

        <div className={styles.faq}>
          <h2>Frequently Asked Questions</h2>

          <div className={styles.faqItem}>
            <h3>Can I cancel anytime?</h3>
            <p>Yes! Cancel your subscription anytime from your account settings. No lock-in, no penalties.</p>
          </div>

          <div className={styles.faqItem}>
            <h3>What will I be able to build after this course?</h3>
            <p>You will be able to build fully deployed AI Agent applications — and even create your own AI-powered course or product to monetize, just like this one.</p>
          </div>

          <div className={styles.faqItem}>
            <h3>What payment methods are accepted?</h3>
            <p>We accept all major credit/debit cards, PayPal, and more — payments are processed securely via Paddle.</p>
          </div>

          <div className={styles.faqItem}>
            <h3>Is the course in Urdu or English?</h3>
            <p>Both! The AI tutor responds in whichever language you use, and lessons are written to be clear for Urdu-speaking students.</p>
          </div>

          <div className={styles.faqItem}>
            <h3>Do I need prior experience?</h3>
            <p>Basic Python knowledge is recommended. If you know Python fundamentals, you're ready to start.</p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
