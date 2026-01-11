import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as QRCode from 'qrcode';

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Initialize email transporter with Gmail credentials from environment
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER || 'tteeeey@gmail.com';
    const smtpPass = process.env.SMTP_PASS || 'galvez093003';

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false, // TLS = false for port 587
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  async sendRegistrationConfirmation(
    userEmail: string,
    userName: string,
    eventTitle: string,
    eventDate: string,
    eventLocation: string,
    ticketCode: string,
    qrCodeUrl: string,
  ): Promise<void> {
    try {
      // Convert data URL to Buffer for attachment
      const qrCodeBuffer = Buffer.from(qrCodeUrl.split(',')[1], 'base64');

      const mailOptions = {
        from: 'tteeeey@gmail.com',
        to: userEmail,
        subject: `Registration Confirmed: ${eventTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">🎉 Registration Confirmed!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Your ticket is ready</p>
            </div>
            
            <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
              <p style="color: #374151; font-size: 16px;">Hi ${userName},</p>
              
              <p style="color: #374151; font-size: 16px; margin: 20px 0;">
                You have successfully registered for:
              </p>
              
              <div style="background: #f3f4f6; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 4px;">
                <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 20px;">${eventTitle}</h2>
                <p style="margin: 5px 0; color: #4b5563;"><strong>📅 Date & Time:</strong> ${eventDate}</p>
                <p style="margin: 5px 0; color: #4b5563;"><strong>📍 Location:</strong> ${eventLocation}</p>
              </div>
              
              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <p style="color: #374151; font-size: 14px; margin: 0 0 15px 0;">Your QR Code (for check-in):</p>
                <img src="cid:qrcode" alt="QR Code" style="width: 200px; height: 200px; border: 2px solid #667eea; border-radius: 8px;">
                <p style="color: #374151; font-size: 14px; margin: 15px 0 0 0;"><strong>Ticket Code:</strong></p>
                <p style="color: #667eea; font-size: 16px; font-weight: bold; font-family: monospace; margin: 5px 0; word-break: break-all;">
                  ${ticketCode}
                </p>
              </div>
              
              <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                <p style="color: #15803d; font-size: 14px; margin: 0;">
                  <strong>💡 Tip:</strong> Save this email or the QR code. You'll need to show it at the event entrance for check-in.
                </p>
              </div>
              
              <p style="color: #374151; font-size: 14px; margin: 20px 0;">
                If you need to cancel your registration, visit your account on the Event Registration System.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="color: #6b7280; font-size: 12px; margin: 0; text-align: center;">
                Event Registration System | © 2026 All rights reserved
              </p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: 'qr-code.png',
            content: qrCodeBuffer,
            cid: 'qrcode',
          },
        ],
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Registration confirmation email sent to ${userEmail}`);
    } catch (error) {
      console.error('Error sending registration confirmation email:', error);
      // Don't throw error - registration should complete even if email fails
    }
  }

  async sendEventReminderEmail(
    userEmail: string,
    userName: string,
    eventTitle: string,
    eventDate: string,
    eventLocation: string,
    ticketCode: string,
  ): Promise<void> {
    try {
      const mailOptions = {
        from: 'tteeeey@gmail.com',
        to: userEmail,
        subject: `Reminder: ${eventTitle} is coming up!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">⏰ Event Reminder</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Don't forget about your registration!</p>
            </div>
            
            <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
              <p style="color: #374151; font-size: 16px;">Hi ${userName},</p>
              
              <p style="color: #374151; font-size: 16px; margin: 20px 0;">
                This is a reminder that you're registered for:
              </p>
              
              <div style="background: #fef2f2; padding: 20px; border-left: 4px solid #f97316; margin: 20px 0; border-radius: 4px;">
                <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 20px;">${eventTitle}</h2>
                <p style="margin: 5px 0; color: #4b5563;"><strong>📅 Date & Time:</strong> ${eventDate}</p>
                <p style="margin: 5px 0; color: #4b5563;"><strong>📍 Location:</strong> ${eventLocation}</p>
                <p style="margin: 5px 0; color: #4b5563;"><strong>🎟️ Ticket Code:</strong> ${ticketCode}</p>
              </div>
              
              <p style="color: #374151; font-size: 14px; margin: 20px 0;">
                Please arrive early and bring your QR code or ticket code for smooth check-in.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="color: #6b7280; font-size: 12px; margin: 0; text-align: center;">
                Event Registration System | © 2026 All rights reserved
              </p>
            </div>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Event reminder email sent to ${userEmail}`);
    } catch (error) {
      console.error('Error sending event reminder email:', error);
    }
  }

  async verifyEmailConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service is ready to send messages');
      return true;
    } catch (error) {
      console.error('Email service verification failed:', error);
      return false;
    }
  }
}
