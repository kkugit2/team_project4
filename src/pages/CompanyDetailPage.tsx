import React, { useState, useMemo } from 'react';
import { Company, JobPosting } from '../types';
import { calculatePassingProbability, getPassingProbabilityColor } from '../utils/matching';
import { COMPANY_DUMMY_DATA, JOB_POSTINGS_DUMMY_DATA } from '../data/dummyData';

interface CompanyDetailPageProps {
  companyId?: string;
  isLoggedIn?: boolean;
  seekerGPA?: number | null;
  seekerSkills?: string[];
  seekerCareerHistory?: string;
  hasInternship?: boolean;
}

export const CompanyDetailPage: React.FC<CompanyDetailPageProps> = ({
  companyId = '1',
  isLoggedIn = true,
  seekerGPA = 3.8,
  seekerSkills = ['React', 'TypeScript', 'Node.js'],
  seekerCareerHistory = 'Backend Engineer 2021-2026',
  hasInternship = true,
}) => {
  const company = COMPANY_DUMMY_DATA.find(c => c.id === companyId) || COMPANY_DUMMY_DATA[0];
  const positions = JOB_POSTINGS_DUMMY_DATA.filter(j => j.company_id === companyId);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<'not_applied' | 'applied'>('not_applied');

  // 합격 확률 계산
  const passingProbability = useMemo(
    () => calculatePassingProbability(
      company,
      seekerGPA,
      seekerSkills,
      seekerCareerHistory,
      hasInternship
    ),
    [company, seekerGPA, seekerSkills, seekerCareerHistory, hasInternship]
  );

  const probabilityColor = getPassingProbabilityColor(passingProbability.percentage);

  // 색상 매핑
  const colorClasses = {
    green: 'bg-green-50 text-green-700',
    orange: 'bg-orange-50 text-orange-700',
    red: 'bg-red-50 text-red-700',
  };

  const textColorClasses = {
    green: 'text-green-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between h-15 z-40">
        <div className="flex items-center gap-2">
          <button className="text-gray-900 hover:text-gray-700 text-lg">{'<'}</button>
          <h1 className="text-xl font-bold text-gray-900">기업</h1>
        </div>
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`text-2xl transition-colors ${isBookmarked ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}
        >
          {isBookmarked ? '❤' : '🤍'}
        </button>
      </div>

      {/* 배경 이미지 */}
      <div
        className="h-48 sm:h-64 bg-gradient-to-br from-blue-400 to-blue-600 relative"
        style={{
          backgroundImage: `url(${company.background_image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      {/* 기업 정보 카드 (배경 위에 오버레이) */}
      <div className="px-4 sm:px-6 -mt-16 relative z-10 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-md p-4 sm:p-6">
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-3xl sm:text-4xl font-bold text-blue-600 shadow-sm flex-shrink-0"
              style={{
                backgroundImage: `url(${company.logo_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {company.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{company.name}</h1>
              <p className="text-blue-600 font-semibold text-lg mt-1">{company.industry}</p>
              <p className="text-sm text-gray-600 mt-1">📍 {company.size}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 space-y-6">
        {/* 합격 확률 카드 */}
        {isLoggedIn ? (
          <div className={`rounded-lg p-4 sm:p-6 border border-gray-200 ${colorClasses[probabilityColor]}`}>
            <h3 className="text-lg font-semibold mb-4">합격 확률</h3>
            <div className="mb-4">
              <div className={`text-4xl sm:text-5xl font-bold ${textColorClasses[probabilityColor]}`}>
                {passingProbability.percentage}%
              </div>
              <p className="text-sm mt-2">{passingProbability.description}</p>
            </div>

            {/* 요구사항 체크리스트 */}
            <div className="space-y-2 pt-4 border-t border-gray-300 border-opacity-30">
              <div className="flex items-center gap-2">
                {passingProbability.fulfills.gpa ? (
                  <span className="text-lg">✓</span>
                ) : (
                  <span className="text-lg">✗</span>
                )}
                <span className="text-sm">학점 ({company.preferred_gpa_min} 이상)</span>
              </div>
              <div className="flex items-center gap-2">
                {passingProbability.fulfills.skills ? (
                  <span className="text-lg">✓</span>
                ) : (
                  <span className="text-lg">✗</span>
                )}
                <span className="text-sm">기술스택 ({company.preferred_skills.join(', ')})</span>
              </div>
              <div className="flex items-center gap-2">
                {passingProbability.fulfills.experience ? (
                  <span className="text-lg">✓</span>
                ) : (
                  <span className="text-lg">✗</span>
                )}
                <span className="text-sm">경험 ({company.preferred_experience_type})</span>
              </div>
              <div className="flex items-center gap-2">
                {passingProbability.fulfills.internship ? (
                  <span className="text-lg">✓</span>
                ) : (
                  <span className="text-lg">✗</span>
                )}
                <span className="text-sm">인턴십 경험</span>
              </div>
            </div>

            <p className="text-xs text-gray-600 mt-4">
              정보를 업데이트하면 합격 확률이 변경됩니다
            </p>
          </div>
        ) : (
          <div className="rounded-lg p-4 sm:p-6 bg-gray-100 border border-gray-200 text-center">
            <p className="text-gray-900 font-semibold mb-4">
              로그인하면 당신의 적합도를 확인할 수 있습니다
            </p>
            <button className="w-full h-12 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              로그인 하기
            </button>
          </div>
        )}

        {/* 지원 버튼 */}
        <div className="flex gap-3">
          <a
            href={`https://www.wanted.co.kr/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 h-12 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            지원하기 <span className="text-lg">→</span>
          </a>
          {isLoggedIn && (
            <button
              onClick={() => setApplicationStatus(applicationStatus === 'applied' ? 'not_applied' : 'applied')}
              className={`flex-1 h-12 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                applicationStatus === 'applied'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-white border border-gray-400 text-gray-900 hover:bg-gray-50'
              }`}
            >
              {applicationStatus === 'applied' ? '✓ 지원됨' : '지원 완료'}
            </button>
          )}
        </div>

        {/* 기업 소개 */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">기업 소개</h2>
          <p className="text-gray-900 leading-relaxed line-clamp-4">
            {company.description}
          </p>
          <button className="text-blue-600 text-sm font-semibold mt-3 hover:text-blue-700">
            더 보기
          </button>
        </div>

        {/* 채용 포지션 */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            채용 중인 포지션 <span className="text-sm text-gray-600">({positions.length}개)</span>
          </h2>

          {positions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {positions.map(position => (
                <div key={position.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:border-blue-600 hover:shadow-md transition-all">
                  <h3 className="font-semibold text-gray-900 mb-3">{position.position_title}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>경력: {position.experience_requirement}</p>
                    <p>기술: {position.required_skills.join(', ')}</p>
                    <p>근무지: {position.location}</p>
                    <p className={position.deadline < '2026-07-30' ? 'text-orange-600 font-semibold' : ''}>
                      마감: {position.deadline}
                      {position.deadline < '2026-07-30' && (
                        <span className="ml-2 text-orange-600">🔴 임박</span>
                      )}
                    </p>
                  </div>
                  <a
                    href={`https://www.wanted.co.kr/wd/${position.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center gap-1"
                  >
                    공고 보기<span>→</span>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <p className="text-gray-600 text-sm">현재 모집 중인 포지션이 없습니다.</p>
            </div>
          )}
        </div>

        {/* 기업 정보 */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">기업 정보</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-900 mb-6">
            <div>
              <p className="text-gray-600 text-xs mb-1">업계</p>
              <p className="font-medium">{company.industry}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs mb-1">규모</p>
              <p className="font-medium">{company.size}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs mb-1">설립</p>
              <p className="font-medium">{company.founded_year}년</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs mb-1">근무 형태</p>
              <p className="font-medium">{company.work_type}</p>
            </div>
          </div>

          {/* 복리후생 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h3 className="font-semibold text-gray-900 mb-3">복리후생</h3>
            <ul className="space-y-2">
              {company.benefits.map((benefit, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex gap-2">
                  <span>•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 더 알아보기 */}
        <div className="border-t border-gray-200 pt-6 pb-6">
          <h3 className="font-semibold text-gray-900 mb-4">더 알아보기</h3>
          <div className="space-y-3">
            <a
              href={`https://${company.name.toLowerCase().replace(/\s+/g, '')}.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2"
            >
              회사 홈페이지 방문 <span>→</span>
            </a>
            <a
              href={`https://linkedin.com/company/${company.name.toLowerCase()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2"
            >
              LinkedIn 페이지 <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;
