/**
 * =============================================================================
 * EMAIL SERVICE (API-BASED)
 * =============================================================================
 * Handles email delivery via the Brevo (formerly Sendinblue) REST API.
 * Used instead of SMTP to bypass cloud network restrictions (e.g. Hugging Face).
 * =============================================================================
 */

const axios = require('axios');
const logger = require('../config/logger');

/**
 * Send an email using the Brevo API
 * @param {object} options - { to, subject, text, html, replyTo }
 * @returns {Promise<void>}
 */
exports.sendEmail = async ({ to, subject, text, html, replyTo }) => {
    const apiKey = process.env.SMTP_PASS; // We reuse SMTP_PASS for the API Key
    const fromEmail = process.env.SMTP_USER || 'noreply@alzdetect.com';
    const fromName = process.env.SMTP_FROM || 'AlzDetect System';

    if (!apiKey) {
        logger.warn('Email API Key (SMTP_PASS) not configured. Logging to console instead.');
        logger.info('=== DEV EMAIL (API Mode) ===');
        logger.info(`To: ${to}`);
        logger.info(`Subject: ${subject}`);
        logger.info(`Body: ${text || html}`);
        logger.info('=== END DEV EMAIL ===');
        return { messageId: 'dev-mode', to, subject };
    }

    // DEBUG: Verify which key is being loaded (logs only first 4 chars for security)
    logger.info(`Attempting to send email using API Key starting with: ${apiKey.substring(0, 4)}...`);

    try {
        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: { name: fromName, email: fromEmail },
                to: [{ email: to }],
                subject: subject,
                htmlContent: html,
                textContent: text,
                replyEmail: replyTo,
            },
            {
                headers: {
                    'api-key': apiKey,
                    'Content-Type': 'application/json',
                },
            }
        );

        logger.info(`Email sent successfully via Brevo API to ${to}. MessageID: ${response.data.messageId}`);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message || error.message;
        logger.error(`Brevo API Email failed: ${errorMsg}`, {
            status: error.response?.status,
            data: error.response?.data,
        });
        throw new Error(`Email delivery failed: ${errorMsg}`);
    }
};

/**
 * Send password reset email with OTP
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit OTP code
 */
exports.sendPasswordResetEmail = async (email, otp) => {
    const subject = 'Your Password Reset Code — AlzDetect';
    const html = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #4f46e5; margin: 0;">🧠 AlzDetect</h1>
                <p style="color: #6b7280; margin-top: 5px;">Early Alzheimer Disease Detection System</p>
            </div>
            <div style="background: #f9fafb; border-radius: 12px; padding: 30px; border: 1px solid #e5e7eb;">
                <h2 style="color: #1f2937; margin-top: 0; text-align: center;">Verification Code</h2>
                <p style="color: #4b5563; line-height: 1.6; text-align: center;">
                    You requested a password reset. Use the 6-digit code below to set a new password.
                    This code will expire in <strong>10 minutes</strong>.
                </p>
                <div style="text-align: center; margin: 40px 0;">
                    <div style="background: #ffffff; color: #4f46e5; border: 2px dashed #4f46e5; font-size: 36px; font-weight: 800; letter-spacing: 12px; padding: 20px; display: inline-block; border-radius: 12px;">
                        ${otp}
                    </div>
                </div>
                <p style="color: #6b7280; font-size: 14px; text-align: center;">
                    If you didn't request this, please ignore this email. Your password will remain unchanged.
                </p>
            </div>
        </div>
    `;
    const text = `Password Reset Code: ${otp}

You requested a password reset. Use this code to set a new password (expires in 10 minutes): ${otp}

If you didn't request this, ignore this email.`;

    await exports.sendEmail({ to: email, subject, text, html });
};

/**
 * Send contact form email
 * @param {object} data - { name, email, subject, message }
 */
exports.sendContactEmail = async ({ name, email, subject, message }) => {
    const adminEmail = process.env.CONTACT_RECIPIENT || process.env.SMTP_USER || 'admin@alzdetect.com';
    const mailSubject = `Contact Form: ${subject}`;
    const html = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #4f46e5; margin: 0;">🧠 AlzDetect — Contact Form</h1>
            </div>
            <div style="background: #f9fafb; border-radius: 12px; padding: 30px; border: 1px solid #e5e7eb;">
                <h2 style="color: #1f2937; margin-top: 0;">New Contact Message</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Name:</td><td style="padding: 8px 0; color: #1f2937;">${name}</td></tr>
                    <tr><td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Email:</td><td style="padding: 8px 0; color: #1f2937;">${email}</td></tr>
                    <tr><td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Subject:</td><td style="padding: 8px 0; color: #1f2937;">${subject}</td></tr>
                </table>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                <p style="color: #1f2937; line-height: 1.6;">${message.replace(/
/g, '<br>')}</p>
            </div>
        </div>
    `;
    const text = `Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}`;

    await exports.sendEmail({ 
        to: adminEmail, 
        subject: mailSubject, 
        text, 
        html, 
        replyTo: email 
    });
};
