/**
 * =============================================================================
 * CONTACT CONTROLLER
 * =============================================================================
 * Handles contact form submissions.
 * Input validation is handled by the validate middleware in contact.routes.js.
 * =============================================================================
 */

const Contact = require('./contact.model');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHelper');
const { sendContactEmail } = require('../../utils/emailService');
const logger = require('../../config/logger');
const AppError = require('../../utils/AppError');

/**
 * Submit contact form
 * POST /api/contact
 */
exports.submitContact = asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;
    
    // Link to user if authenticated
    const userId = req.user ? req.user.id : null;

    logger.info(`Processing contact form submission from: ${email}`);
    
    // Save to database
    const contact = await Contact.create({
        user: userId,
        name,
        email,
        subject,
        message
    });

    // Send email notification (optional/existing)
    try {
        await sendContactEmail({ name, email, subject, message });
    } catch (err) {
        logger.warn('Email notification failed for contact form, but record was saved to DB', { error: err.message });
    }

    logger.info(`Contact form submitted and saved to DB`, {
        id: contact._id,
        from: email,
        userId
    });

    sendSuccess(res, 201, 'Your message has been sent successfully. We will get back to you soon.', { contact });
});

/**
 * Get all inquiries (Admin: all, User: their own)
 * GET /api/contact/inquiries
 */
exports.getInquiries = asyncHandler(async (req, res) => {
    let query = {};
    
    // If not admin, only show their own
    if (req.user.role !== 'admin') {
        query.user = req.user.id;
    }

    const inquiries = await Contact.find(query).sort({ createdAt: -1 });

    sendSuccess(res, 200, 'Inquiries retrieved successfully', { inquiries });
});

/**
 * Reply to an inquiry (Admin only)
 * PATCH /api/contact/inquiries/:id/reply
 */
exports.replyToInquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { replyMessage } = req.body;

    if (!replyMessage) {
        throw new AppError('Reply message is required', 400);
    }

    const inquiry = await Contact.findById(id);

    if (!inquiry) {
        throw new AppError('Inquiry not found', 404);
    }

    // 1. Update the database record
    inquiry.replyMessage = replyMessage;
    inquiry.status = 'replied';
    inquiry.repliedBy = req.user.id;
    inquiry.repliedAt = Date.now();
    await inquiry.save();

    // 2. Send the actual email to the user
    try {
        await emailService.sendEmail({
            to: inquiry.email,
            subject: `Re: ${inquiry.subject}`,
            text: `Hello ${inquiry.name},\n\n${replyMessage}\n\nBest regards,\nAlzDetect Team`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #4f46e5; margin: 0;">🧠 AlzDetect</h1>
                    </div>
                    <div style="background: #f9fafb; border-radius: 12px; padding: 30px; border: 1px solid #e5e7eb;">
                        <p style="color: #1f2937; line-height: 1.6;">${replyMessage.replace(/\\n/g, '<br>')}</p>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                        <p style="color: #6b7280; font-size: 14px;">This is an official response from the AlzDetect Support Team.</p>
                    </div>
                </div>
            `,
            replyTo: process.env.SMTP_USER
        });
    } catch (err) {
        logger.warn(`Failed to send reply email to ${inquiry.email}, but DB was updated`, { error: err.message });
    }

    logger.info(`Admin replied to inquiry ${id} and email sent to ${inquiry.email}`, { adminId: req.user.id });

    sendSuccess(res, 200, 'Reply sent successfully', { inquiry });
});
