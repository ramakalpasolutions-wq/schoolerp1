// lib/email.js

// Email configuration from environment
const EMAIL_CONFIG = {
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_PORT === "465",
  user: process.env.EMAIL_USER || "",
  pass: process.env.EMAIL_PASS || "",
  fromName: process.env.EMAIL_FROM_NAME || "School ERP",
  fromEmail: process.env.EMAIL_FROM || "noreply@schoolerp.com",
};

// ── Simple email via fetch (nodemailer alternative for edge) ─────
async function sendViaNodemailer(to, subject, html, text) {
  // Dynamically import nodemailer to keep it server-only
  const nodemailer = (await import("nodemailer")).default;

  const transporter = nodemailer.createTransport({
    host: EMAIL_CONFIG.host,
    port: EMAIL_CONFIG.port,
    secure: EMAIL_CONFIG.secure,
    auth: {
      user: EMAIL_CONFIG.user,
      pass: EMAIL_CONFIG.pass,
    },
    tls: { rejectUnauthorized: false },
  });

  const result = await transporter.sendMail({
    from: `"${EMAIL_CONFIG.fromName}" <${EMAIL_CONFIG.fromEmail}>`,
    to: Array.isArray(to) ? to.join(", ") : to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ""),
  });

  return {
    messageId: result.messageId,
    accepted: result.accepted,
    rejected: result.rejected,
  };
}

function sendMockEmail(to, subject, html) {
  const recipients = Array.isArray(to) ? to : [to];
  console.log(`\n[EMAIL MOCK] ─────────────────────────`);
  console.log(`To     : ${recipients.join(", ")}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body   : ${html.slice(0, 100)}...`);
  console.log(`──────────────────────────────────────\n`);
  return { messageId: `MOCK_EMAIL_${Date.now()}`, accepted: recipients };
}

// ══════════════════════════════════════════════════════════════════
// CORE SEND FUNCTIONS
// ══════════════════════════════════════════════════════════════════

/**
 * Send a single email
 */
export async function sendEmail(to, subject, html, text = "") {
  if (!to || (Array.isArray(to) && to.length === 0)) {
    return { success: false, error: "No recipient email provided." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emails = Array.isArray(to) ? to : [to];
  const invalidEmails = emails.filter((e) => !emailRegex.test(e));

  if (invalidEmails.length > 0) {
    return {
      success: false,
      error: `Invalid email addresses: ${invalidEmails.join(", ")}`,
    };
  }

  try {
    let result;

    if (process.env.NODE_ENV === "development" && !EMAIL_CONFIG.user) {
      result = sendMockEmail(to, subject, html);
    } else {
      result = await sendViaNodemailer(to, subject, html, text);
    }

    return {
      success: true,
      messageId: result.messageId,
      accepted: result.accepted || emails,
      rejected: result.rejected || [],
    };
  } catch (error) {
    console.error("[Email Error]:", error.message);
    return {
      success: false,
      error: error.message || "Failed to send email.",
    };
  }
}

/**
 * Send to multiple recipients individually (personalized)
 */
export async function sendBulkEmail(emailList = [], subject, htmlTemplate) {
  if (!emailList.length) {
    return { success: false, error: "No email addresses provided." };
  }

  const results = await Promise.allSettled(
    emailList.map(async ({ email, data = {} }) => {
      // Replace template variables
      let personalizedHtml = htmlTemplate;
      Object.entries(data).forEach(([key, val]) => {
        personalizedHtml = personalizedHtml.replace(
          new RegExp(`{{${key}}}`, "g"),
          val || ""
        );
      });
      return sendEmail(email, subject, personalizedHtml);
    })
  );

  const processed = results.map((r) =>
    r.status === "fulfilled" ? r.value : { success: false, error: r.reason?.message }
  );

  const sent = processed.filter((r) => r.success).length;
  const failed = processed.filter((r) => !r.success).length;

  return { success: true, total: emailList.length, sent, failed, results: processed };
}

// ══════════════════════════════════════════════════════════════════
// EMAIL TEMPLATES
// ══════════════════════════════════════════════════════════════════

function baseTemplate(content, schoolName = "School ERP") {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: Arial, sans-serif; background: #f1f5f9; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.07); }
        .header { background: linear-gradient(135deg, #1e40af, #4f46e5); padding: 24px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 22px; }
        .header p { color: #bfdbfe; margin: 4px 0 0; font-size: 13px; }
        .body { padding: 28px 32px; }
        .footer { background: #f8fafc; padding: 16px 32px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        .btn { display: inline-block; background: #2563eb; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .badge-green { background: #d1fae5; color: #065f46; }
        .badge-red { background: #fee2e2; color: #991b1b; }
        .badge-blue { background: #dbeafe; color: #1e40af; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        th { background: #f8fafc; padding: 10px; text-align: left; font-size: 12px; color: #64748b; border: 1px solid #e2e8f0; }
        td { padding: 10px; border: 1px solid #e2e8f0; font-size: 13px; color: #374151; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏫 ${schoolName}</h1>
          <p>School Management Portal</p>
        </div>
        <div class="body">${content}</div>
        <div class="footer">
          © ${new Date().getFullYear()} ${schoolName} • This is an automated message.
        </div>
      </div>
    </body>
    </html>
  `;
}

export function feeReminderEmail(studentName, amount, dueDate, schoolName) {
  const content = `
    <h2 style="color:#1e40af;margin:0 0 16px">Fee Payment Reminder</h2>
    <p>Dear Parent,</p>
    <p>This is a reminder that the fee payment for <strong>${studentName}</strong> is due.</p>
    <table>
      <tr><th>Student Name</th><td>${studentName}</td></tr>
      <tr><th>Amount Due</th><td><strong style="color:#dc2626">₹${parseInt(amount).toLocaleString("en-IN")}</strong></td></tr>
      <tr><th>Due Date</th><td>${dueDate}</td></tr>
      <tr><th>School</th><td>${schoolName}</td></tr>
    </table>
    <p>Please pay at the school office or via online portal to avoid late charges.</p>
    <p style="color:#6b7280;font-size:13px">If you have already paid, please ignore this message.</p>
  `;
  return baseTemplate(content, schoolName);
}

export function attendanceAlertEmail(studentName, status, date, schoolName) {
  const statusColors = {
    ABSENT: { badge: "badge-red", text: "ABSENT", icon: "❌" },
    LATE: { badge: "badge-blue", text: "LATE", icon: "⚠️" },
    PRESENT: { badge: "badge-green", text: "PRESENT", icon: "✅" },
  };
  const s = statusColors[status] || statusColors.ABSENT;
  const content = `
    <h2 style="color:#1e40af;margin:0 0 16px">Attendance Alert ${s.icon}</h2>
    <p>Dear Parent,</p>
    <p>This is to inform you about <strong>${studentName}</strong>'s attendance today.</p>
    <table>
      <tr><th>Student</th><td>${studentName}</td></tr>
      <tr><th>Date</th><td>${date}</td></tr>
      <tr><th>Status</th><td><span class="badge ${s.badge}">${s.text}</span></td></tr>
      <tr><th>School</th><td>${schoolName}</td></tr>
    </table>
    ${status === "ABSENT" ? "<p>Please contact the school if your child is unwell.</p>" : ""}
  `;
  return baseTemplate(content, schoolName);
}

export function welcomeEmail(userName, role, schoolName, loginUrl) {
  const content = `
    <h2 style="color:#1e40af;margin:0 0 16px">Welcome to ${schoolName}! 🎉</h2>
    <p>Dear <strong>${userName}</strong>,</p>
    <p>Your account has been created on <strong>${schoolName}</strong>'s School ERP portal.</p>
    <table>
      <tr><th>Name</th><td>${userName}</td></tr>
      <tr><th>Role</th><td><span class="badge badge-blue">${role}</span></td></tr>
      <tr><th>School</th><td>${schoolName}</td></tr>
    </table>
    <p>You can now login to access your dashboard:</p>
    <a href="${loginUrl}" class="btn">Login to Portal</a>
    <p style="color:#ef4444;font-size:12px">⚠️ Please change your password after first login.</p>
  `;
  return baseTemplate(content, schoolName);
}

export function examResultEmail(studentName, examName, results, schoolName) {
  const rows = results
    .map((r) => `<tr><td>${r.subject}</td><td>${r.marks}/${r.maxMarks}</td><td>${r.grade}</td></tr>`)
    .join("");
  const content = `
    <h2 style="color:#1e40af;margin:0 0 16px">📊 Exam Results Available</h2>
    <p>Dear Parent, the results for <strong>${studentName}</strong> are now available.</p>
    <p><strong>Exam:</strong> ${examName}</p>
    <table>
      <tr><th>Subject</th><th>Marks</th><th>Grade</th></tr>
      ${rows}
    </table>
    <p>Please visit the school or login to the portal to download the detailed report card.</p>
  `;
  return baseTemplate(content, schoolName);
}