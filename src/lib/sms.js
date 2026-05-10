// lib/sms.js

const SMS_API_KEY = process.env.SMS_API_KEY || "";
const SMS_SENDER_ID = process.env.SMS_SENDER_ID || "SCHOOL";
const SMS_PROVIDER = process.env.SMS_PROVIDER || "fast2sms";

// ── Rate limit tracker (simple in-memory) ───────────────────────
const rateLimitMap = new Map();

function checkRateLimit(phone) {
  const key = phone;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxPerWindow = 5;

  const entry = rateLimitMap.get(key) || { count: 0, resetAt: now + windowMs };

  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }

  if (entry.count >= maxPerWindow) {
    return { allowed: false, resetIn: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  rateLimitMap.set(key, entry);
  return { allowed: true };
}

/**
 * Clean phone number — remove country code, spaces, dashes
 */
function cleanPhone(phone) {
  return String(phone)
    .replace(/\D/g, "")
    .replace(/^91/, "")
    .slice(-10);
}

/**
 * Validate Indian mobile number
 */
function validatePhone(phone) {
  const cleaned = cleanPhone(phone);
  return /^[6-9]\d{9}$/.test(cleaned);
}

// ══════════════════════════════════════════════════════════════════
// PROVIDER ADAPTERS
// ══════════════════════════════════════════════════════════════════

async function sendViaFast2SMS(phone, message) {
  const url = "https://www.fast2sms.com/dev/bulkV2";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      authorization: SMS_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      route: "q",
      message,
      flash: 0,
      numbers: phone,
      sender_id: SMS_SENDER_ID,
    }),
  });
  const data = await response.json();
  if (!response.ok || data.return === false) {
    throw new Error(data.message || "Fast2SMS API error");
  }
  return { messageId: data.request_id, provider: "fast2sms" };
}

async function sendViaTwilio(phone, message) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  const body = new URLSearchParams({
    To: `+91${cleanPhone(phone)}`,
    From: from,
    Body: message,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Twilio API error");
  }
  return { messageId: data.sid, provider: "twilio" };
}

async function sendViaMSG91(phone, message) {
  const url = "https://api.msg91.com/api/v5/flow/";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      authkey: SMS_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: SMS_SENDER_ID,
      short_url: 0,
      mobiles: `91${cleanPhone(phone)}`,
      message,
    }),
  });
  const data = await response.json();
  if (data.type !== "success") {
    throw new Error(data.message || "MSG91 API error");
  }
  return { messageId: data.request_id, provider: "msg91" };
}

// Development mock
function sendMockSMS(phone, message) {
  console.log(`\n[SMS MOCK] ──────────────────────────`);
  console.log(`To     : ${phone}`);
  console.log(`Message: ${message}`);
  console.log(`───────────────────────────────────\n`);
  return {
    messageId: `MOCK_${Date.now()}`,
    provider: "mock",
    phone,
    message,
  };
}

// ══════════════════════════════════════════════════════════════════
// CORE SEND FUNCTIONS
// ══════════════════════════════════════════════════════════════════

/**
 * Send a single SMS
 */
export async function sendSMS(phone, message) {
  const cleaned = cleanPhone(phone);

  if (!validatePhone(cleaned)) {
    return {
      success: false,
      phone: cleaned,
      error: `Invalid phone number: ${phone}`,
    };
  }

  const rateCheck = checkRateLimit(cleaned);
  if (!rateCheck.allowed) {
    return {
      success: false,
      phone: cleaned,
      error: `Rate limit exceeded. Retry in ${rateCheck.resetIn}s`,
    };
  }

  // Truncate message to 160 chars (1 SMS unit)
  const truncatedMessage = message.slice(0, 160);

  try {
    let result;

    if (process.env.NODE_ENV === "development" && !SMS_API_KEY) {
      result = sendMockSMS(cleaned, truncatedMessage);
    } else {
      switch (SMS_PROVIDER) {
        case "twilio":
          result = await sendViaTwilio(cleaned, truncatedMessage);
          break;
        case "msg91":
          result = await sendViaMSG91(cleaned, truncatedMessage);
          break;
        case "fast2sms":
        default:
          result = await sendViaFast2SMS(cleaned, truncatedMessage);
      }
    }

    return {
      success: true,
      phone: cleaned,
      messageId: result.messageId,
      provider: result.provider,
      message: truncatedMessage,
    };
  } catch (error) {
    console.error(`[SMS Error] Failed to ${cleaned}:`, error.message);
    return {
      success: false,
      phone: cleaned,
      error: error.message,
    };
  }
}

/**
 * Send SMS to multiple recipients
 */
export async function sendBulkSMS(phones = [], message) {
  if (!phones.length) {
    return { success: false, error: "No phone numbers provided." };
  }

  const results = await Promise.allSettled(
    phones.map((phone) => sendSMS(phone, message))
  );

  const processed = results.map((r) =>
    r.status === "fulfilled" ? r.value : { success: false, error: r.reason?.message }
  );

  const sent = processed.filter((r) => r.success).length;
  const failed = processed.filter((r) => !r.success).length;

  console.log(`[Bulk SMS] Total: ${phones.length} | Sent: ${sent} | Failed: ${failed}`);

  return {
    success: true,
    total: phones.length,
    sent,
    failed,
    results: processed,
  };
}

// ══════════════════════════════════════════════════════════════════
// TEMPLATE MESSAGES
// ══════════════════════════════════════════════════════════════════

const SCHOOL_NAME = process.env.SCHOOL_NAME || "School";

/**
 * Attendance SMS to parent
 */
export async function sendAttendanceSMS(studentName, status, time, parentPhone, schoolName = SCHOOL_NAME) {
  const messages = {
    PRESENT: `Dear Parent, ${studentName} is PRESENT today at ${time}. - ${schoolName}`,
    ABSENT: `Dear Parent, ${studentName} is ABSENT today. Please contact school if unwell. - ${schoolName}`,
    LATE: `Dear Parent, ${studentName} arrived LATE at ${time} today. - ${schoolName}`,
    HALFDAY: `Dear Parent, ${studentName} attended HALF DAY today. - ${schoolName}`,
  };

  const message = messages[status] || messages.PRESENT;
  return sendSMS(parentPhone, message);
}

/**
 * Fee reminder SMS
 */
export async function sendFeeReminderSMS(studentName, amount, dueDate, parentPhone, schoolName = SCHOOL_NAME) {
  const message = `Dear Parent, ${studentName}'s fee of Rs.${amount.toLocaleString("en-IN")} is due on ${dueDate}. Please pay at school to avoid late charges. - ${schoolName}`;
  return sendSMS(parentPhone, message);
}

/**
 * Exam result SMS
 */
export async function sendExamResultSMS(studentName, examName, percentage, grade, parentPhone, schoolName = SCHOOL_NAME) {
  const message = `Dear Parent, ${studentName}'s ${examName} result: ${percentage}% | Grade: ${grade}. Collect report card from school. - ${schoolName}`;
  return sendSMS(parentPhone, message);
}

/**
 * General announcement SMS
 */
export async function sendAnnouncementSMS(message, phones = [], schoolName = SCHOOL_NAME) {
  const fullMessage = `${message} - ${schoolName}`;
  return sendBulkSMS(phones, fullMessage);
}

/**
 * Holiday notice SMS
 */
export async function sendHolidayNoticeSMS(date, reason, phones = [], schoolName = SCHOOL_NAME) {
  const message = `Dear Parents, school will be CLOSED on ${date} due to ${reason}. - ${schoolName}`;
  return sendBulkSMS(phones, message);
}