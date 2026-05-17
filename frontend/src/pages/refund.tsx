import React from 'react';
import Layout from '@theme/Layout';
import styles from './policy.module.css';

export default function Refund() {
  return (
    <Layout title="Refund Policy" description="AI Agents Course Refund Policy">
      <main className={styles.main}>
        <h1>Refund Policy</h1>
        <p className={styles.updated}>Last updated: May 2026</p>

        <p>
          The AI Agents Development Course is designed to deliver real, practical value.
          By the end of this course, students have the skills to build and monetize their
          own AI-powered products — making this one of the highest-return investments in
          your learning journey.
        </p>

        <h2>Our Policy</h2>
        <p>
          Due to the digital nature of this course and the immediate access to all
          content upon subscription, <strong>we do not offer refunds</strong>. We stand
          behind the quality of our content and encourage you to explore the free lessons
          before subscribing.
        </p>

        <h2>Subscription Cancellation</h2>
        <p>
          You can cancel your subscription at any time from your account settings.
          Cancellation stops all future billing immediately. You will continue to have
          access until the end of your current billing period.
        </p>

        <h2>Have Questions Before Subscribing?</h2>
        <p>
          We are happy to answer any questions before you commit. Reach out at{' '}
          <a href="mailto:donia1510aptech@gmail.com">donia1510aptech@gmail.com</a> and
          we will get back to you promptly.
        </p>

        <h2>Contact</h2>
        <p>
          For billing or subscription questions:{' '}
          <a href="mailto:donia1510aptech@gmail.com">donia1510aptech@gmail.com</a>
        </p>
      </main>
    </Layout>
  );
}
