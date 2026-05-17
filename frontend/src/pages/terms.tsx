import React from 'react';
import Layout from '@theme/Layout';
import styles from './policy.module.css';

export default function Terms() {
  return (
    <Layout title="Terms of Service" description="AI Agents Course Terms of Service">
      <main className={styles.main}>
        <h1>Terms of Service</h1>
        <p className={styles.updated}>Last updated: May 2026</p>
        <p>Welcome to the AI Agents Development Course. By accessing or purchasing this course, you agree to the following terms.</p>

        <h2>1. Course Access</h2>
        <p>Upon successful payment, you will receive access to the course content for the duration of your active subscription. Access is granted to one individual only and may not be shared.</p>

        <h2>2. Intellectual Property</h2>
        <p>All course materials — including written lessons, code examples, quizzes, and AI tutor content — are the intellectual property of the course creator. You may not reproduce, distribute, or resell any part of this course without written permission.</p>

        <h2>3. Payment & Billing</h2>
        <p>Payments are processed securely through Paddle. By subscribing, you authorize recurring monthly charges of $19.99 until you cancel. You can cancel at any time from your account settings.</p>

        <h2>4. Acceptable Use</h2>
        <p>You agree to use this course for personal learning only. You may not use course content to create competing products or services without explicit permission.</p>

        <h2>5. Disclaimer</h2>
        <p>This course is provided for educational purposes. Results may vary. The course creator is not responsible for any outcomes resulting from the application of course material.</p>

        <h2>6. Changes to Terms</h2>
        <p>We reserve the right to update these terms at any time. Continued use of the course after changes constitutes acceptance of the new terms.</p>

        <h2>7. Contact</h2>
        <p>For any questions regarding these terms, contact us at: <a href="mailto:donia1510aptech@gmail.com">donia1510aptech@gmail.com</a></p>
      </main>
    </Layout>
  );
}
