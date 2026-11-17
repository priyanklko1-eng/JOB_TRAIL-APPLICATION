import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.mongo.repository.js';
import { AppError } from '../utils/AppError.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me';

function signToken(userId) {
  return jwt.sign({}, JWT_SECRET, {
    subject: String(userId),
    expiresIn: '1h',
  });
}

export const authService = {

  async register({ name, email, password }) {
    // 1. Validate required fields
    if (!name || !email || !password) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'Name, email, and password are required'
      );
    }

    if (name.trim().length < 2) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'Full name must be at least 2 characters'
      );
    }

    // 2. Validate password length (min 8 chars, max 72 UTF-8 bytes for bcrypt)
    if (password.length < 8) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'Password must be at least 8 characters long'
      );
    }

    if (Buffer.byteLength(password, 'utf8') > 72) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'Password must not exceed 72 bytes'
      );
    }

    // 3. Check for duplicate email (409 Conflict)
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError(
        409,
        'EMAIL_EXISTS',
        'An account with this email already exists.'
      );
    }

    // 4. Hash password & save user
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ name, email, passwordHash });

    // 5. Issue JWT token
    const token = signToken(user._id);

    return { user, token };
  },

  async login({ email, password }) {
    // 1. Validate input presence
    if (!email || !password) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Email and password are required');
    }

    // 2. Ask repository for user by email
    const userWithHash = await userRepository.findByEmail(email);
    if (!userWithHash) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    // 3. Compare plain password against stored bcrypt hash
    const isMatch = await bcrypt.compare(password, userWithHash.passwordHash);
    if (!isMatch) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const { passwordHash, ...safeUser } = userWithHash;
    const token = signToken(safeUser._id);

    return { user: safeUser, token };
  },

  async getMe(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError(401, 'UNAUTHORIZED', 'User account not found');
    }
    return user;
  },
};