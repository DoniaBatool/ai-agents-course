import React from 'react';
import Layout from '@theme/Layout';
import styles from './policy.module.css';

export default function Refund() {
  return (
    <Layout title="Refund Policy" description="AI Agents Course Refund Policy">
      <main className={styles.main}>
        <h1>Refund Policy</h1>
        <p className={styles.updated}>Last updated: May 2026</p>
        <p>We want you to be completely satisfied with the AI Agents Development Course.</p>

        <h2>7-Day Money-Back Guarantee</h2>
        <p>If you are not satisfied with the course for any reason, you may request a full refund within <strong>7 days</strong> of your first payment. No questions asked.</p>

        <h2>How to Request a Refund</h2>
        <p>Email us at <a href="mailto:donia1510aptech@gmail.com">donia1510aptech@gmail.com</a> with:</p>
        <ul>
          <li>Your registered email address</li>
          <li>Your reason for the refund (optional but appreciated)</li>
        </ul>
        <p>Refunds are processed within 5–10 business days back to your original payment method.</p>

        <h2>Subscription Cancellation</h2>
        <p>You can cancel your subscription at any time from your account settings. Cancellation stops future billing immediately. No refund is issued for the current billing period after the 7-day window.</p>

        <h2>Exceptions</h2>
        <p>Refunds will not be issued if:</p>
        <ul>
          <li>More than 7 days have passed since your first payment</li>
          <li>There is evidence of course content misuse or sharing</li>
        </ul>

        <h2>Contact</h2>
        <p>For refund requests or questions: <a href="mailto:donia1510aptech@gmail.com">donia1510aptech@gmail.com</a></p>
      </main>
    </Layout>
  );
}
