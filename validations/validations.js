import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be at least 5 characters long').isLength({ min: 5 }),
];

export const registerValidation = [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'ПPassword must be at least 5 characters long').isLength({ min: 5 }),
  body('fullName', 'Enter a name (at least 2 characters').isLength({ min: 2 }),
  body('avatarUrl', 'Invalid URL format for avatar').optional().isURL(),
];

export const resetPasswordValidation = [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be at least 5 characters long').isLength({ min: 5 }),
];

export const saveProgressValidation = [
  body('moduleId', 'Укажите ID модуля').isString(),
  body('progressData', 'Укажите данные прогресса').isObject(),
];

export const saveLabProgressValidation = [
  body('labId', 'Lab ID is required').isString(),
  body('progressData', 'Lab progress data is required').isObject(),
];

export const validateSaveProgress = [
  body('labId').isString().withMessage('Lab ID must be a string'),
  body('progressData').isObject().withMessage('Progress data must be an object'),
];
