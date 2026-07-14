import { ValidationError } from '../types';

// 이메일 유효성 검증
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 비밀번호 유효성 검증
export const validatePassword = (password: string): {
  isValid: boolean;
  has8Chars: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
} => {
  return {
    isValid: password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password),
    has8Chars: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*]/.test(password),
  };
};

// 비밀번호 확인
export const validatePasswordMatch = (password: string, passwordConfirm: string): boolean => {
  return password === passwordConfirm && password.length > 0;
};

// GPA 유효성 검증
export const validateGPA = (gpa: number | null): boolean => {
  if (gpa === null) return false;
  return gpa >= 0 && gpa <= 4.5;
};

// 날짜 유효성 검증
export const validateDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;

  const [year, month, day] = date.split('-').map(Number);

  // 월 범위 확인
  if (month < 1 || month > 12) return false;

  // 일 범위 확인
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return false;

  return true;
};

// 날짜 순서 검증 (시작일 < 종료일)
export const validateDateRange = (startDate: string, endDate: string | null): boolean => {
  if (!endDate) return true; // 종료일 없음은 가능 (현직)
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start < end;
};

// 로그인 폼 전체 검증
export const validateLoginForm = (email: string, password: string): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!email.trim()) {
    errors.push({ field: 'email', message: '이메일을 입력하세요' });
  } else if (!validateEmail(email)) {
    errors.push({ field: 'email', message: '유효한 이메일을 입력하세요' });
  }

  if (!password.trim()) {
    errors.push({ field: 'password', message: '비밀번호를 입력하세요' });
  }

  return errors;
};

// 회원가입 Step 2 검증 (계정 정보)
export const validateSignUpStep2 = (
  email: string,
  password: string,
  passwordConfirm: string
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!email.trim()) {
    errors.push({ field: 'email', message: '이메일을 입력하세요' });
  } else if (!validateEmail(email)) {
    errors.push({ field: 'email', message: '유효한 이메일을 입력하세요' });
  }

  if (!password.trim()) {
    errors.push({ field: 'password', message: '비밀번호를 입력하세요' });
  } else {
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      if (!passwordValidation.has8Chars) {
        errors.push({ field: 'password', message: '8자 이상이어야 합니다' });
      } else {
        errors.push({ field: 'password', message: '대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다' });
      }
    }
  }

  if (!passwordConfirm.trim()) {
    errors.push({ field: 'passwordConfirm', message: '비밀번호 확인을 입력하세요' });
  } else if (!validatePasswordMatch(password, passwordConfirm)) {
    errors.push({ field: 'passwordConfirm', message: '비밀번호가 일치하지 않습니다' });
  }

  return errors;
};

// 회원가입 Step 3 검증 (프로필 정보)
export const validateSignUpStep3 = (
  education: string,
  gpa: number | null,
  skills: string[]
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!education.trim()) {
    errors.push({ field: 'education', message: '학적을 선택하세요' });
  }

  if (!validateGPA(gpa)) {
    errors.push({ field: 'gpa', message: '유효한 학점을 선택하세요' });
  }

  if (skills.length === 0) {
    errors.push({ field: 'skills', message: '최소 1개의 기술스택을 입력하세요' });
  }

  return errors;
};

// 자격증 추가 폼 검증
export const validateCertification = (
  certName: string,
  issuedDate: string,
  expiresAt: string | null
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!certName.trim()) {
    errors.push({ field: 'certName', message: '자격증명을 입력하세요' });
  }

  if (!issuedDate.trim()) {
    errors.push({ field: 'issuedDate', message: '취득 일자를 입력하세요' });
  } else if (!validateDate(issuedDate)) {
    errors.push({ field: 'issuedDate', message: '유효한 날짜를 입력하세요 (YYYY-MM-DD)' });
  }

  if (expiresAt && !validateDate(expiresAt)) {
    errors.push({ field: 'expiresAt', message: '유효한 날짜를 입력하세요 (YYYY-MM-DD)' });
  }

  if (expiresAt && !validateDateRange(issuedDate, expiresAt)) {
    errors.push({ field: 'expiresAt', message: '만료 일자는 취득 일자보다 뒤여야 합니다' });
  }

  return errors;
};

// 경력 추가 폼 검증
export const validateExperience = (
  companyName: string,
  jobTitle: string,
  startDate: string,
  endDate: string | null
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!companyName.trim()) {
    errors.push({ field: 'companyName', message: '회사명을 입력하세요' });
  }

  if (!jobTitle.trim()) {
    errors.push({ field: 'jobTitle', message: '직급/직무를 입력하세요' });
  }

  if (!startDate.trim()) {
    errors.push({ field: 'startDate', message: '시작 날짜를 입력하세요' });
  } else if (!validateDate(startDate)) {
    errors.push({ field: 'startDate', message: '유효한 날짜를 입력하세요 (YYYY-MM-DD)' });
  }

  if (endDate && !validateDate(endDate)) {
    errors.push({ field: 'endDate', message: '유효한 날짜를 입력하세요 (YYYY-MM-DD)' });
  }

  if (endDate && !validateDateRange(startDate, endDate)) {
    errors.push({ field: 'endDate', message: '종료 일자는 시작 일자보다 뒤여야 합니다' });
  }

  return errors;
};
