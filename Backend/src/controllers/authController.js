import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import sendEmail from '../utils/sendEmail.js';


// Helper: generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Helper: generate a random 6-digit OTP and its sha256 hash
const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
  return { otp, hashedOTP };
};

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, phone } = req.body;

    if (password !== confirmPassword) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Passwords do not match');
    }

    const user = await User.create({ firstName, lastName, email, password, phone });

    // Generate verification OTP
    const { otp, hashedOTP } = generateOTP();
    user.emailVerificationOTP = hashedOTP;
    user.emailVerificationOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    // Send verification email
    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 8px;">
        <h2 style="color: #0f172a; margin-bottom: 16px;">Welcome to Zaheer eCommerce!</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
          Thank you for registering. Use the following 6-digit code to verify your email address. This code is valid for 10 minutes:
        </p>
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="background-color: #f1f5f9; color: #0f172a; padding: 16px 32px; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 8px; display: inline-block; font-family: monospace;">${otp}</span>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 24px;" />
        <p style="color: #94a3b8; font-size: 14px;">
          If you did not create an account, please ignore this email.
        </p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify Your Email - Zaheer eCommerce',
        message: `Your email verification code is: ${otp}. It is valid for 10 minutes.`,
        html: htmlMessage,
      });

      console.log(`\n📧 VERIFICATION OTP email sent to ${email}\n`);
    } catch (err) {
      console.error('Email sending failed:', err);
      // Clean up OTP fields on email failure
      user.emailVerificationOTP = undefined;
      user.emailVerificationOTPExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw new AppError(500, 'EMAIL_ERROR', 'Verification email could not be sent. Please try again later.');
    }

    // Do NOT issue a JWT — user must verify first
    res.status(201).json({
      success: true,
      message: 'Registration successful. A verification OTP has been sent to your email.',
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/verify-otp
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Email and OTP are required');
    }

    const hashedOTP = crypto.createHash('sha256').update(otp.toString().trim()).digest('hex');

    const user = await User.findOne({
      email,
      emailVerificationOTP: hashedOTP,
      emailVerificationOTPExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError(400, 'INVALID_OTP', 'Invalid or expired OTP. Please try again.');
    }

    // Mark email as verified and clean up OTP fields
    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationOTPExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // Issue JWT and log the user in
    const token = generateToken(user._id, user.role);

    res.json({
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/resend-otp
export const resendVerificationOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Email is required');
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal whether the email exists
      return res.json({ success: true, message: 'If that email exists, a new verification OTP has been sent.' });
    }

    if (user.isEmailVerified) {
      throw new AppError(400, 'ALREADY_VERIFIED', 'This email is already verified. Please log in.');
    }

    // Generate a new OTP
    const { otp, hashedOTP } = generateOTP();
    user.emailVerificationOTP = hashedOTP;
    user.emailVerificationOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 8px;">
        <h2 style="color: #0f172a; margin-bottom: 16px;">Your New Verification Code</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
          You requested a new verification code. Use the code below to verify your email address. This code is valid for 10 minutes:
        </p>
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="background-color: #f1f5f9; color: #0f172a; padding: 16px 32px; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 8px; display: inline-block; font-family: monospace;">${otp}</span>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 24px;" />
        <p style="color: #94a3b8; font-size: 14px;">
          If you did not request this code, please ignore this email.
        </p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'New Verification Code - Zaheer eCommerce',
        message: `Your new verification code is: ${otp}. It is valid for 10 minutes.`,
        html: htmlMessage,
      });

      console.log(`\n📧 RESEND VERIFICATION OTP email sent to ${email}\n`);
    } catch (err) {
      console.error('Email sending failed:', err);
      throw new AppError(500, 'EMAIL_ERROR', 'Verification email could not be sent. Please try again later.');
    }

    res.json({ success: true, message: 'A new verification OTP has been sent to your email.' });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Email and password are required');
    }

    // +password because select: false in schema
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    if (!user.isActive) {
      throw new AppError(403, 'FORBIDDEN', 'Account is deactivated. Contact admin.');
    }

    // Block unverified users
    if (!user.isEmailVerified) {
      throw new AppError(403, 'UNVERIFIED_EMAIL', 'Please verify your email before logging in. Check your inbox for the verification code.');
    }

    const token = generateToken(user._id, user.role);

    res.json({
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Always return 200 — don't reveal if email exists
    if (!user) {
      return res.json({ data: { message: 'If that email exists, a recovery OTP has been sent' } });
    }

    // Generate 6-digit password reset OTP
    const { otp, hashedOTP } = generateOTP();
    user.resetPasswordToken = hashedOTP;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 8px;">
        <h2 style="color: #0f172a; margin-bottom: 16px;">Password Recovery Request</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
          You requested a password reset for your Zaheer eCommerce account. Use the following 6-digit code to reset your password. This code is valid for 10 minutes:
        </p>
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="background-color: #f1f5f9; color: #0f172a; padding: 16px 32px; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 8px; display: inline-block; font-family: monospace;">${otp}</span>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 24px;" />
        <p style="color: #94a3b8; font-size: 14px;">
          If you did not request a password reset, please ignore this email. Your password will remain unchanged.
        </p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Recovery OTP - Zaheer eCommerce',
        message: `Your password recovery code is: ${otp}. It is valid for 10 minutes.`,
        html: htmlMessage,
      });

      console.log(`\n📧 PASSWORD RESET OTP email sent to ${email}\n`);
      res.json({ data: { message: 'If that email exists, a recovery OTP has been sent' } });
    } catch (err) {
      console.error('Email sending failed:', err);
      // Clean up token if email send fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      throw new AppError(500, 'EMAIL_ERROR', 'Email could not be sent. Please try again later.');
    }
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      throw new AppError(400, 'VALIDATION_ERROR', 'OTP code and new password are required');
    }

    const hashedToken = crypto.createHash('sha256').update(token.toString().trim()).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError(400, 'INVALID_TOKEN', 'Invalid or expired OTP code');
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ data: { message: 'Password reset successful' } });
  } catch (error) {
    next(error);
  }
};
