import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface CertEmailOptions {
  toEmail:     string;
  studentName: string;
  certId:      string;
  certLink:    string;
}

export async function sendCertificateEmail({
  toEmail,
  studentName,
  certId,
  certLink,
}: CertEmailOptions) {
  const firstName = studentName.split(" ")[0];
  const year      = new Date().getFullYear();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Georgia, serif; background: #f5f5f5; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #06041a; border-radius: 12px; overflow: hidden; }
    .banner { background: linear-gradient(135deg, #7c3aed, #6366f1); padding: 32px 40px; text-align: center; }
    .banner h1 { color: #f0d080; margin: 0; font-size: 22px; letter-spacing: 3px; }
    .banner p  { color: #a5b4fc; margin: 8px 0 0; font-size: 13px; }
    .body  { padding: 40px; color: #e0e0e0; }
    .body p { line-height: 1.7; margin: 0 0 16px; }
    .cert-box {
      border: 2px solid #c9a84c;
      border-radius: 8px;
      padding: 24px 32px;
      text-align: center;
      margin: 24px 0;
      background: rgba(99, 102, 241, 0.1);
    }
    .cert-box .name  { font-size: 26px; color: #f0d080; font-style: italic; margin: 0 0 8px; }
    .cert-box .course { font-size: 14px; color: #a5b4fc; margin: 0 0 4px; }
    .cert-box .id    { font-size: 11px; color: #6b7280; letter-spacing: 2px; margin: 8px 0 0; }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #7c3aed, #6366f1);
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-size: 15px;
      margin: 16px 0;
    }
    .footer { padding: 24px 40px; border-top: 1px solid #1e1b4b; text-align: center; }
    .footer p { color: #4b5563; font-size: 12px; margin: 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="banner">
      <h1>AI  AGENTS  ACADEMY</h1>
      <p>Certificate of Completion</p>
    </div>
    <div class="body">
      <p>Congratulations <strong style="color:#f0d080">${firstName}</strong>!</p>
      <p>
        We are proud to inform you that you have successfully completed all modules of the
        <strong style="color:#a5b4fc">AI Agents Development Course</strong>.
        This is a significant achievement and reflects your dedication and hard work.
      </p>
      <div class="cert-box">
        <p class="name">${studentName}</p>
        <p class="course">has successfully completed</p>
        <p class="course"><strong>AI Agents Development Course</strong></p>
        <p class="id">Certificate ID: ${certId}</p>
      </div>
      <p style="text-align:center">
        <a class="btn" href="${certLink}">View &amp; Download Your Certificate →</a>
      </p>
      <p style="font-size:13px; color:#6b7280">
        You can open the certificate link above in your browser and use
        <strong>Ctrl+P → Save as PDF</strong> to download a PDF copy.
        Keep it safe — it has a unique ID that can be verified online.
      </p>
    </div>
    <div class="footer">
      <p>AI Agents Academy &nbsp;|&nbsp; Instructor: Donia Batool &nbsp;|&nbsp; ${year}</p>
      <p style="margin-top:6px"><a href="https://ai-agents-course-xi.vercel.app" style="color:#6366f1">ai-agents-course-xi.vercel.app</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();

  await resend.emails.send({
    from:    "AI Agents Academy <onboarding@resend.dev>",
    to:      toEmail,
    subject: `🎓 Congratulations ${firstName}! Your Certificate is Ready`,
    html,
  });
}
