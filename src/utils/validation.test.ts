import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateGPA,
  validateDate,
  validateDateRange,
  validateLoginForm,
  validateSignUpStep2,
  validateSignUpStep3,
  validateCertification,
  validateExperience,
} from './validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    test('should validate correct email format', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user@domain.co.kr')).toBe(true);
    });

    test('should reject invalid email format', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('should validate strong password', () => {
      const result = validatePassword('SecurePass123!');
      expect(result.isValid).toBe(true);
      expect(result.has8Chars).toBe(true);
      expect(result.hasUppercase).toBe(true);
      expect(result.hasLowercase).toBe(true);
      expect(result.hasNumber).toBe(true);
      expect(result.hasSpecial).toBe(true);
    });

    test('should reject weak password', () => {
      const result = validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.has8Chars).toBe(false);
    });

    test('should check password requirements individually', () => {
      const result = validatePassword('NoSpecial123');
      expect(result.hasSpecial).toBe(false);
      expect(result.has8Chars).toBe(true);
      expect(result.hasUppercase).toBe(true);
      expect(result.hasLowercase).toBe(true);
      expect(result.hasNumber).toBe(true);
    });
  });

  describe('validatePasswordMatch', () => {
    test('should match identical passwords', () => {
      expect(validatePasswordMatch('Pass123!', 'Pass123!')).toBe(true);
    });

    test('should reject different passwords', () => {
      expect(validatePasswordMatch('Pass123!', 'Pass456!')).toBe(false);
    });
  });

  describe('validateGPA', () => {
    test('should validate GPA in range 0-4.5', () => {
      expect(validateGPA(3.8)).toBe(true);
      expect(validateGPA(0)).toBe(true);
      expect(validateGPA(4.5)).toBe(true);
    });

    test('should reject GPA outside range', () => {
      expect(validateGPA(-0.1)).toBe(false);
      expect(validateGPA(4.6)).toBe(false);
    });

    test('should reject null GPA', () => {
      expect(validateGPA(null)).toBe(false);
    });
  });

  describe('validateDate', () => {
    test('should validate correct date format', () => {
      expect(validateDate('2026-01-15')).toBe(true);
      expect(validateDate('2024-12-31')).toBe(true);
    });

    test('should reject invalid date format', () => {
      expect(validateDate('01/15/2026')).toBe(false);
      expect(validateDate('2026-1-15')).toBe(false);
      expect(validateDate('invalid')).toBe(false);
    });

    test('should reject invalid dates', () => {
      expect(validateDate('2026-13-01')).toBe(false);
      expect(validateDate('2026-02-30')).toBe(false);
    });
  });

  describe('validateDateRange', () => {
    test('should validate correct date range', () => {
      expect(validateDateRange('2021-01-15', '2026-01-15')).toBe(true);
    });

    test('should reject invalid date range', () => {
      expect(validateDateRange('2026-01-15', '2021-01-15')).toBe(false);
    });

    test('should allow null end date', () => {
      expect(validateDateRange('2021-01-15', null)).toBe(true);
    });
  });

  describe('validateLoginForm', () => {
    test('should validate correct login form', () => {
      const errors = validateLoginForm('test@example.com', 'password123');
      expect(errors.length).toBe(0);
    });

    test('should reject invalid email', () => {
      const errors = validateLoginForm('invalid-email', 'password123');
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.field === 'email')).toBe(true);
    });

    test('should reject empty fields', () => {
      const errors = validateLoginForm('', '');
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateSignUpStep2', () => {
    test('should validate correct signup step 2', () => {
      const errors = validateSignUpStep2('test@example.com', 'SecurePass123!', 'SecurePass123!');
      expect(errors.length).toBe(0);
    });

    test('should reject weak password', () => {
      const errors = validateSignUpStep2('test@example.com', 'weak', 'weak');
      expect(errors.length).toBeGreaterThan(0);
    });

    test('should reject mismatched passwords', () => {
      const errors = validateSignUpStep2('test@example.com', 'SecurePass123!', 'DifferentPass123!');
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.field === 'passwordConfirm')).toBe(true);
    });
  });

  describe('validateSignUpStep3', () => {
    test('should validate correct step 3', () => {
      const errors = validateSignUpStep3('대학교', 3.8, ['React', 'TypeScript']);
      expect(errors.length).toBe(0);
    });

    test('should reject without education', () => {
      const errors = validateSignUpStep3('', 3.8, ['React']);
      expect(errors.length).toBeGreaterThan(0);
    });

    test('should reject invalid GPA', () => {
      const errors = validateSignUpStep3('대학교', null, ['React']);
      expect(errors.length).toBeGreaterThan(0);
    });

    test('should reject without skills', () => {
      const errors = validateSignUpStep3('대학교', 3.8, []);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateCertification', () => {
    test('should validate correct certification', () => {
      const errors = validateCertification('AWS Certified', '2024-01-15', '2026-01-15');
      expect(errors.length).toBe(0);
    });

    test('should reject without certification name', () => {
      const errors = validateCertification('', '2024-01-15', '2026-01-15');
      expect(errors.length).toBeGreaterThan(0);
    });

    test('should reject with expire date before issued date', () => {
      const errors = validateCertification('AWS Certified', '2026-01-15', '2024-01-15');
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateExperience', () => {
    test('should validate correct experience', () => {
      const errors = validateExperience('Company A', 'Engineer', '2021-01-15', '2026-01-15');
      expect(errors.length).toBe(0);
    });

    test('should allow no end date (currently working)', () => {
      const errors = validateExperience('Company A', 'Engineer', '2021-01-15', null);
      expect(errors.length).toBe(0);
    });

    test('should reject with end date before start date', () => {
      const errors = validateExperience('Company A', 'Engineer', '2026-01-15', '2021-01-15');
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
