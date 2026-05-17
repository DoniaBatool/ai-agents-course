import React from 'react';
import Layout from '@theme/Layout';
import styles from './policy.module.css';

export default function Privacy() {
  return (
    <Layout title="Privacy Policy" description="AI Agents Course Privacy Policy">
      <main className={styles.main}>
        <h1>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: May 2026</p>
        <p>Your privacy is important to us. This policy explains what information we collect and how we use it.</p>

        <h2>1. Information We Collect</h2>
        <ul>
          <li><strong>Account information:</strong> Name and email address when you sign up</li>
          <li><strong>Payment information:</strong> Processed securely by Paddle — we never store your card details</li>
          <li><strong>Usage data:</strong> Which lessons you access, quiz results, and chatbot interactions (used to improve the course)</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To provide and manage your course access</li>
          <li>To send important account and course updates</li>
          <li>To improve the course content and AI tutor responses</li>
          <li>We do not sell your personal data to third parties</li>
        </ul>

        <h2>3. Third-Party Services</h2>
        <p>We use the following third-party services:</p>
        <ul>
          <li><strong>Paddle</strong> — payment processing (<a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer">Paddle Privacy Policy</a>)</li>
          <li><strong>Neon</strong> — database hosting</li>
          <li><strong>OpenAI</strong> — AI tutor functionality</li>
          <li><strong>Vercel</strong> — website hosting</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>We take reasonable measures to protect your personal information. All data is transmitted over HTTPS.</p>

        <h2>5. Your Rights</h2>
        <p>You may request deletion of your account and associated data at any time by contacting us.</p>

        <h2>6. Contact</h2>
        <p>For privacy-related questions: <a href="mailto:donia1510aptech@gmail.com">donia1510aptech@gmail.com</a></p>
      </main>
    </Layout>
  );
}
