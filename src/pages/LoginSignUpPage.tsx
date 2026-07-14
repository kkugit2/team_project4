import React, { useState, useMemo } from 'react';
import { LoginFormData, SignUpFormData, UserType, ValidationError } from '../types';
import { validateEmail, validatePassword, validatePasswordMatch, validateLoginForm, validateSignUpStep2, validateSignUpStep3 } from '../utils/validation';

const SKILLS_LIST = [
  'React', 'Vue', 'Angular', 'TypeScript', 'JavaScript',
  'Node.js', 'Python', 'Java', 'Go', 'Rust',
  'Django', 'Spring Boot', 'Express', 'GraphQL',
  'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes',
  'AWS', 'GCP', 'Azure', 'CSS', 'Tailwind',
  'C++', 'Solidity', 'Swift', 'Kotlin', 'OpenGL',
  'Pandas', 'Scikit-learn', 'TensorFlow', 'Oracle'
];

const EDUCATION_OPTIONS = [
  '대학교',
  '대학원',
  '고등학교',
  '전문대',
  '그 외',
  '해당사항 없음'
];

interface LoginSignUpPageProps {
  onLoginSuccess?: (email: string) => void;
  onSignUpSuccess?: (email: string, userType: UserType) => void;
}

export const LoginSignUpPage: React.FC<LoginSignUpPageProps> = ({
  onLoginSuccess,
  onSignUpSuccess,
}) => {
  const [currentPage, setCurrentPage] = useState<'login' | 'signup'>('login');
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // 로그인 상태
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [loginErrors, setLoginErrors] = useState<ValidationError[]>([]);

  // 회원가입 상태
  const [signupForm, setSignupForm] = useState<SignUpFormData>({
    userType: null,
    email: '',
    password: '',
    passwordConfirm: '',
    education: '',
    gpa: null,
    skills: [],
    experienceType: '',
    hasInternship: false,
  });
  const [signupErrors, setSignupErrors] = useState<ValidationError[]>([]);
  const [passwordValidation, setPasswordValidation] = useState({
    has8Chars: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
  });
  const [skillInput, setSkillInput] = useState('');

  // 로그인 입력 처리
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
    setLoginErrors(loginErrors.filter(err => err.field !== name));
  };

  // 로그인 제출
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateLoginForm(loginForm.email, loginForm.password);
    if (errors.length > 0) {
      setLoginErrors(errors);
      return;
    }
    setLoginErrors([]);
    onLoginSuccess?.(loginForm.email);
    setLoginForm({ email: '', password: '' });
  };

  // Step 1: 사용자 타입 선택
  const handleUserTypeSelect = (userType: UserType) => {
    setSignupForm(prev => ({ ...prev, userType }));
  };

  const canProceedStep1 = signupForm.userType !== null;

  // Step 2: 계정 정보
  const handleSignupStep2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({ ...prev, [name]: value }));
    setSignupErrors(signupErrors.filter(err => err.field !== name));

    if (name === 'password') {
      const validation = validatePassword(value);
      setPasswordValidation({
        has8Chars: validation.has8Chars,
        hasUppercase: validation.hasUppercase,
        hasLowercase: validation.hasLowercase,
        hasNumber: validation.hasNumber,
        hasSpecial: validation.hasSpecial,
      });
    }
  };

  const canProceedStep2 = useMemo(() => {
    return signupForm.email.trim() !== '' &&
      validateEmail(signupForm.email) &&
      validatePassword(signupForm.password).isValid &&
      validatePasswordMatch(signupForm.password, signupForm.passwordConfirm);
  }, [signupForm.email, signupForm.password, signupForm.passwordConfirm]);

  // Step 3: 프로필 정보
  const handleStep3Change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      setSignupForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setSignupForm(prev => ({ ...prev, [name]: value }));
    }
    setSignupErrors(signupErrors.filter(err => err.field !== name));
  };

  const handleGPAChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSignupForm(prev => ({ ...prev, gpa: value ? parseFloat(value) : null }));
  };

  const handleAddSkill = (skill: string) => {
    if (skill && !signupForm.skills.includes(skill)) {
      setSignupForm(prev => ({ ...prev, skills: [...prev.skills, skill] }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSignupForm(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const canProceedStep3 = signupForm.education !== '' &&
    signupForm.gpa !== null &&
    signupForm.skills.length > 0;

  // Step 진행
  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const errors = validateSignUpStep2(signupForm.email, signupForm.password, signupForm.passwordConfirm);
      if (errors.length > 0) {
        setSignupErrors(errors);
        return;
      }
      setSignupErrors([]);
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as 1 | 2 | 3);
      setSignupErrors([]);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateSignUpStep3(signupForm.education, signupForm.gpa, signupForm.skills);
    if (errors.length > 0) {
      setSignupErrors(errors);
      return;
    }
    setSignupErrors([]);
    onSignUpSuccess?.(signupForm.email, signupForm.userType as UserType);
    setSignupForm({
      userType: null,
      email: '',
      password: '',
      passwordConfirm: '',
      education: '',
      gpa: null,
      skills: [],
      experienceType: '',
      hasInternship: false,
    });
  };

  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
        {/* 로그인 페이지 */}
        <div className="w-full max-w-md">
          {/* 로고 */}
          <div className="text-center mb-8">
            <div className="text-4xl font-bold text-blue-600 mb-2">JobMatch</div>
            <p className="text-gray-600">채용 정보 플랫폼</p>
          </div>

          {/* 로그인 폼 */}
          <div className="bg-white p-8 rounded-lg border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">로그인</h1>
            <p className="text-gray-600 text-sm mb-6">계정으로 로그인하세요</p>

            <form onSubmit={handleLoginSubmit} className="space-y-6">
              {/* 이메일 */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-2">
                  이메일 <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  placeholder="example@email.com"
                  className={`w-full h-11 px-4 py-3 rounded-lg border ${
                    loginErrors.find(e => e.field === 'email')
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-400 bg-white'
                  } text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors`}
                />
                {loginErrors.find(e => e.field === 'email') && (
                  <p className="mt-2 text-sm text-red-600">
                    {loginErrors.find(e => e.field === 'email')?.message}
                  </p>
                )}
              </div>

              {/* 비밀번호 */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-2">
                  비밀번호 <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="••••••••••"
                  className={`w-full h-11 px-4 py-3 rounded-lg border ${
                    loginErrors.find(e => e.field === 'password')
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-400 bg-white'
                  } text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors`}
                />
                {loginErrors.find(e => e.field === 'password') && (
                  <p className="mt-2 text-sm text-red-600">
                    {loginErrors.find(e => e.field === 'password')?.message}
                  </p>
                )}
                <button
                  type="button"
                  className="text-blue-600 text-sm mt-2 hover:text-blue-700 transition-colors"
                >
                  비밀번호 찾기?
                </button>
              </div>

              {/* 로그인 버튼 */}
              <button
                type="submit"
                className="w-full h-12 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:translate-y-0.5 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                로그인 하기
              </button>
            </form>

            {/* 구분선 */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-sm text-gray-600">또는</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* 소셜 로그인 */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full h-10 bg-white border border-gray-400 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                구글로 로그인
              </button>
              <button
                type="button"
                className="w-full h-10 bg-white border border-gray-400 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                깃허브로 로그인
              </button>
            </div>

            {/* 회원가입 링크 */}
            <div className="text-center mt-8">
              <p className="text-gray-600 text-sm">
                계정이 없으신가요?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage('signup');
                    setCurrentStep(1);
                    setSignupForm({
                      userType: null,
                      email: '',
                      password: '',
                      passwordConfirm: '',
                      education: '',
                      gpa: null,
                      skills: [],
                      experienceType: '',
                      hasInternship: false,
                    });
                  }}
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  회원가입 하기
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 회원가입 페이지
  return (
    <div className="min-h-screen bg-white flex flex-col px-4 py-8">
      <div className="max-w-md mx-auto w-full">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrevStep}
            className={`text-lg ${
              currentStep === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900 hover:text-gray-700'
            }`}
            disabled={currentStep === 1}
          >
            {'<'} 뒤로
          </button>
          <h1 className="text-2xl font-bold text-gray-900">회원가입</h1>
          <button
            onClick={() => {
              setCurrentPage('login');
              setCurrentStep(1);
            }}
            className="text-lg text-gray-900 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* 진행률 바 */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden mb-2">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 text-right">{currentStep}/3</p>
        </div>

        {/* Step 1: 사용자 타입 선택 */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">당신은 누구신가요?</h2>
              <p className="text-gray-600 text-sm">다음 단계를 진행하기 위해 선택하세요</p>
            </div>

            <div className="space-y-4">
              {/* 구직자 카드 */}
              <button
                onClick={() => handleUserTypeSelect('job_seeker')}
                className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                  signupForm.userType === 'job_seeker'
                    ? 'border-blue-600 bg-gray-100'
                    : 'border-gray-300 bg-white hover:border-blue-600'
                }`}
              >
                <div className="text-2xl mb-2">📋</div>
                <h3 className="font-semibold text-gray-900 mb-1">구직자</h3>
                <p className="text-sm text-gray-600">채용공고 탐색 및</p>
                <p className="text-sm text-gray-600">자소서 분석</p>
              </button>

              {/* 기업 카드 */}
              <button
                onClick={() => handleUserTypeSelect('recruiter')}
                className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                  signupForm.userType === 'recruiter'
                    ? 'border-blue-600 bg-gray-100'
                    : 'border-gray-300 bg-white hover:border-blue-600'
                }`}
              >
                <div className="text-2xl mb-2">🏢</div>
                <h3 className="font-semibold text-gray-900 mb-1">기업 인사팀</h3>
                <p className="text-sm text-gray-600">인재상 등록 및</p>
                <p className="text-sm text-gray-600">인재 발굴</p>
              </button>
            </div>

            <button
              onClick={handleNextStep}
              disabled={!canProceedStep1}
              className={`w-full h-12 rounded-lg font-semibold transition-all ${
                canProceedStep1
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              다음 단계
            </button>

            <button
              type="button"
              className="w-full text-blue-600 text-sm font-semibold hover:text-blue-700"
            >
              건너뛰기
            </button>
          </div>
        )}

        {/* Step 2: 계정 정보 */}
        {currentStep === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">계정 정보</h2>

            {/* 이메일 */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                이메일 <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={signupForm.email}
                onChange={handleSignupStep2Change}
                placeholder="example@email.com"
                className={`w-full h-11 px-4 py-3 rounded-lg border ${
                  signupErrors.find(e => e.field === 'email')
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-400 bg-white'
                } text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600`}
              />
              {signupErrors.find(e => e.field === 'email') && (
                <p className="mt-2 text-sm text-red-600">{signupErrors.find(e => e.field === 'email')?.message}</p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                비밀번호 <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={signupForm.password}
                onChange={handleSignupStep2Change}
                placeholder="••••••••••"
                className={`w-full h-11 px-4 py-3 rounded-lg border ${
                  signupErrors.find(e => e.field === 'password')
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-400 bg-white'
                } text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600`}
              />
              {signupErrors.find(e => e.field === 'password') && (
                <p className="mt-2 text-sm text-red-600">{signupErrors.find(e => e.field === 'password')?.message}</p>
              )}
              <div className="mt-3 space-y-1 text-xs">
                <div className={passwordValidation.has8Chars ? 'text-green-600' : 'text-gray-600'}>
                  {passwordValidation.has8Chars ? '✓' : '○'} 8자 이상
                </div>
                <div className={passwordValidation.hasUppercase ? 'text-green-600' : 'text-gray-600'}>
                  {passwordValidation.hasUppercase ? '✓' : '○'} 대문자 포함
                </div>
                <div className={passwordValidation.hasLowercase ? 'text-green-600' : 'text-gray-600'}>
                  {passwordValidation.hasLowercase ? '✓' : '○'} 소문자 포함
                </div>
                <div className={passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-600'}>
                  {passwordValidation.hasNumber ? '✓' : '○'} 숫자 포함
                </div>
                <div className={passwordValidation.hasSpecial ? 'text-green-600' : 'text-gray-600'}>
                  {passwordValidation.hasSpecial ? '✓' : '○'} 특수문자 (!@#$%^&*) 포함
                </div>
              </div>
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                비밀번호 확인 <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                name="passwordConfirm"
                value={signupForm.passwordConfirm}
                onChange={handleSignupStep2Change}
                placeholder="••••••••••"
                className={`w-full h-11 px-4 py-3 rounded-lg border ${
                  signupErrors.find(e => e.field === 'passwordConfirm')
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-400 bg-white'
                } text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600`}
              />
              {signupErrors.find(e => e.field === 'passwordConfirm') && (
                <p className="mt-2 text-sm text-red-600">{signupErrors.find(e => e.field === 'passwordConfirm')?.message}</p>
              )}
              {signupForm.passwordConfirm && !signupErrors.find(e => e.field === 'passwordConfirm') && (
                <p className="mt-2 text-sm text-green-600">✓ 비밀번호가 일치합니다</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 h-10 bg-white border border-gray-400 text-gray-900 font-semibold rounded-lg hover:bg-gray-50"
              >
                이전 단계
              </button>
              <button
                type="submit"
                disabled={!canProceedStep2}
                className={`flex-1 h-12 rounded-lg font-semibold transition-all ${
                  canProceedStep2
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
              >
                다음 단계
              </button>
            </div>
          </form>
        )}

        {/* Step 3: 프로필 정보 */}
        {currentStep === 3 && (
          <form onSubmit={handleSignupSubmit} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">경력 정보 입력</h2>
              <p className="text-gray-600 text-sm mt-1">나중에 마이페이지에서도</p>
              <p className="text-gray-600 text-sm">입력 및 수정할 수 있습니다</p>
            </div>

            {/* 학적 */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                학적 <span className="text-red-600">*</span>
              </label>
              <select
                name="education"
                value={signupForm.education}
                onChange={handleStep3Change}
                className={`w-full h-11 px-4 py-3 rounded-lg border ${
                  signupErrors.find(e => e.field === 'education')
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-400 bg-white'
                } text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600`}
              >
                <option value="">학적 선택</option>
                {EDUCATION_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {signupErrors.find(e => e.field === 'education') && (
                <p className="mt-2 text-sm text-red-600">{signupErrors.find(e => e.field === 'education')?.message}</p>
              )}
            </div>

            {/* 학점 */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                학점 <span className="text-red-600">*</span>
              </label>
              <select
                value={signupForm.gpa !== null ? signupForm.gpa : ''}
                onChange={handleGPAChange}
                className={`w-full h-11 px-4 py-3 rounded-lg border ${
                  signupErrors.find(e => e.field === 'gpa')
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-400 bg-white'
                } text-gray-900 focus:outline-none focus:border-blue-600`}
              >
                <option value="">학점 선택</option>
                {Array.from({ length: 46 }, (_, i) => (i * 0.1).toFixed(1)).map(gpa => (
                  <option key={gpa} value={gpa}>{gpa} / 4.5</option>
                ))}
              </select>
              {signupErrors.find(e => e.field === 'gpa') && (
                <p className="mt-2 text-sm text-red-600">{signupErrors.find(e => e.field === 'gpa')?.message}</p>
              )}
            </div>

            {/* 기술스택 */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                기술 스택 <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-2 mb-3">
                <select
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="flex-1 h-11 px-4 py-3 rounded-lg border border-gray-400 bg-white text-gray-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="">기술 선택</option>
                  {SKILLS_LIST.filter(skill => !signupForm.skills.includes(skill)).map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleAddSkill(skillInput)}
                  className="h-11 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                  추가
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {signupForm.skills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-blue-700 hover:text-blue-900 font-bold"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              {signupErrors.find(e => e.field === 'skills') && (
                <p className="mt-2 text-sm text-red-600">{signupErrors.find(e => e.field === 'skills')?.message}</p>
              )}
            </div>

            {/* 경력 경험 */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">경력</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4" /> <span className="ml-2 text-gray-900">신입 (경력 0년)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasInternship"
                    checked={signupForm.hasInternship}
                    onChange={handleStep3Change}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-gray-900">인턴십 경험 있음</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4" /> <span className="ml-2 text-gray-900">1년 이상 경력</span>
                </label>
              </div>
              <button type="button" className="text-blue-600 text-sm font-semibold mt-3 hover:text-blue-700">
                + 경력 상세 추가
              </button>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 h-10 bg-white border border-gray-400 text-gray-900 font-semibold rounded-lg hover:bg-gray-50"
              >
                이전 단계
              </button>
              <button
                type="submit"
                disabled={!canProceedStep3}
                className={`flex-1 h-12 rounded-lg font-semibold transition-all ${
                  canProceedStep3
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
              >
                회원가입 완료
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginSignUpPage;
