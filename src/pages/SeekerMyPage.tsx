import React, { useState } from 'react';
import { Certification, Experience } from '../types';

interface SeekerMyPageProps {
  userEmail?: string;
  userName?: string;
  initialEducation?: string;
  initialGPA?: number;
  initialCertifications?: Certification[];
  initialExperiences?: Experience[];
}

export const SeekerMyPage: React.FC<SeekerMyPageProps> = ({
  userEmail = 'user@example.com',
  userName = 'John Doe',
  initialEducation = '서울대학교 컴퓨터공학과',
  initialGPA = 3.8,
  initialCertifications = [
    {
      id: '1',
      user_id: 'user1',
      cert_name: 'AWS Certified Solutions Architect',
      issued_date: '2024-03-15',
      expires_at: '2026-03-15',
      created_at: '2024-03-15',
      updated_at: '2024-03-15',
    },
  ],
  initialExperiences = [
    {
      id: '1',
      user_id: 'user1',
      company_name: '스타트업 X',
      job_title: 'Senior Engineer',
      start_date: '2021-01-15',
      end_date: null,
      description: '백엔드 개발, 인프라 구축',
      created_at: '2021-01-15',
      updated_at: '2021-01-15',
    },
  ],
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'certifications' | 'experiences' | 'scouts'>('profile');
  const [editMode, setEditMode] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const [education, setEducation] = useState(initialEducation);
  const [gpa, setGPA] = useState(initialGPA);
  const [certifications, setCertifications] = useState(initialCertifications);
  const [experiences, setExperiences] = useState(initialExperiences);

  // 모달 상태
  const [showCertModal, setShowCertModal] = useState(false);
  const [showExpModal, setShowExpModal] = useState(false);
  const [newCert, setNewCert] = useState({ name: '', issuedDate: '', expiresAt: '' });
  const [newExp, setNewExp] = useState({ company: '', title: '', startDate: '', endDate: '', description: '', isCurrently: true });

  // 자격증 추가
  const handleAddCertification = () => {
    if (newCert.name && newCert.issuedDate) {
      const cert: Certification = {
        id: String(Math.random()),
        user_id: 'user1',
        cert_name: newCert.name,
        issued_date: newCert.issuedDate,
        expires_at: newCert.expiresAt || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setCertifications([...certifications, cert]);
      setNewCert({ name: '', issuedDate: '', expiresAt: '' });
      setShowCertModal(false);
    }
  };

  // 자격증 삭제
  const handleDeleteCertification = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setCertifications(certifications.filter(c => c.id !== id));
    }
  };

  // 경력 추가
  const handleAddExperience = () => {
    if (newExp.company && newExp.title && newExp.startDate) {
      const exp: Experience = {
        id: String(Math.random()),
        user_id: 'user1',
        company_name: newExp.company,
        job_title: newExp.title,
        start_date: newExp.startDate,
        end_date: newExp.isCurrently ? null : newExp.endDate,
        description: newExp.description || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setExperiences([...experiences, exp]);
      setNewExp({ company: '', title: '', startDate: '', endDate: '', description: '', isCurrently: true });
      setShowExpModal(false);
    }
  };

  // 경력 삭제
  const handleDeleteExperience = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setExperiences(experiences.filter(e => e.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between h-15">
        <div className="flex items-center gap-2">
          <button className="text-gray-900 hover:text-gray-700 text-lg">{'<'}</button>
          <h1 className="text-xl font-bold text-gray-900">마이페이지</h1>
        </div>
        <button className="text-gray-900 hover:text-gray-700 text-2xl">⚙</button>
      </div>

      {/* 프로필 헤더 카드 */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
            {userName.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{userName}</h2>
            <p className="text-sm text-gray-600">{userEmail}</p>
            <button className="text-blue-600 text-sm font-semibold mt-2 hover:text-blue-700">
              프로필 편집
            </button>
          </div>
        </div>
      </div>

      {/* 프로필 컨텐츠 */}
      <div className="p-4 sm:p-6">
        {/* 학적 카드 */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6 hover:border-blue-600 hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">학적</h3>
              <div className="border-t border-gray-200 my-3"></div>
              <p className="text-gray-900 font-medium">{education}</p>
              <p className="text-xs text-gray-600 mt-1">2023년 졸업</p>
            </div>
            <button className="text-blue-600 text-sm font-semibold hover:text-blue-700">
              수정
            </button>
          </div>
        </div>

        {/* 학점 카드 */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6 hover:border-blue-600 hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">학점</h3>
              <div className="border-t border-gray-200 my-3"></div>
              <p className="text-2xl font-bold text-gray-900">{gpa} / 4.5</p>
            </div>
            <button className="text-blue-600 text-sm font-semibold hover:text-blue-700">
              수정
            </button>
          </div>
        </div>

        {/* 자격증 섹션 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">자격증</h2>
          <div className="space-y-4">
            {certifications.length > 0 ? (
              certifications.map(cert => (
                <div key={cert.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:border-blue-600 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{cert.cert_name}</h3>
                      <p className="text-xs text-gray-600">{cert.issued_date} 취득</p>
                      {cert.expires_at && (
                        <p className="text-xs text-gray-600">{cert.expires_at} 만료</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-600 text-xs font-semibold hover:text-blue-700">수정</button>
                      <button
                        onClick={() => handleDeleteCertification(cert.id)}
                        className="text-red-600 text-xs font-semibold hover:text-red-700"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-100 rounded-lg p-6 text-center">
                <p className="text-gray-600 text-sm">아직 등록한 자격증이 없습니다.</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowCertModal(true)}
            className="text-blue-600 text-sm font-semibold mt-4 hover:text-blue-700"
          >
            + 자격증 추가
          </button>
        </div>

        {/* 경력 섹션 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">경력</h2>
          <div className="space-y-4">
            {experiences.length > 0 ? (
              experiences.map(exp => (
                <div key={exp.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:border-blue-600 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{exp.job_title}</h3>
                      <p className="text-sm text-gray-600">{exp.company_name} | {exp.start_date}-{exp.end_date || '현직'}</p>
                      {exp.description && (
                        <p className="text-xs text-gray-600 mt-2 line-clamp-2">{exp.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-600 text-xs font-semibold hover:text-blue-700">수정</button>
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="text-red-600 text-xs font-semibold hover:text-red-700"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-100 rounded-lg p-6 text-center">
                <p className="text-gray-600 text-sm">아직 등록한 경력이 없습니다.</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowExpModal(true)}
            className="text-blue-600 text-sm font-semibold mt-4 hover:text-blue-700"
          >
            + 경력 추가
          </button>
        </div>

        {/* 스카웃 섹션 */}
        <div className="mb-8">
          <div className="flex gap-4 mb-4 border-b border-gray-200">
            <button className="text-gray-900 font-semibold pb-3 border-b-2 border-blue-600">받은 스카웃: 3개</button>
            <button className="text-gray-600 font-semibold pb-3 hover:text-gray-900">거절한 스카웃</button>
            <button className="text-gray-600 font-semibold pb-3 hover:text-gray-900">수락한 스카웃</button>
          </div>

          {/* 스카웃 카드 예시 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:border-blue-600 hover:shadow-md transition-all">
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900">회사 A</h3>
              <p className="text-sm text-gray-600">Senior Backend Engineer</p>
            </div>
            <div className="border-t border-gray-200 py-3">
              <p className="text-sm text-gray-600 mb-2">"당신의 기술 스택이 우리 팀과 잘 맞습니다."</p>
              <p className="text-xs text-gray-600">연봉: 공개 안됨</p>
              <p className="text-xs text-red-600 font-semibold mt-1">🔴 만료까지: 3일</p>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="flex-1 h-12 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                수락
              </button>
              <button className="flex-1 h-12 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
                거절
              </button>
            </div>
          </div>
        </div>

        {/* 하단 액션 */}
        <div className="space-y-3 pt-6">
          <button className="w-full h-11 bg-white border border-gray-400 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
            로그아웃
          </button>
          <button className="w-full text-gray-600 text-sm font-semibold hover:text-gray-900 transition-colors">
            계정 삭제
          </button>
        </div>
      </div>

      {/* 자격증 추가 모달 */}
      {showCertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-4 z-50">
          <div className="bg-white rounded-t-lg sm:rounded-lg w-full sm:max-w-md p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">자격증 추가</h2>
              <button
                onClick={() => setShowCertModal(false)}
                className="text-2xl text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">자격증명 *</label>
                <input
                  type="text"
                  value={newCert.name}
                  onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                  placeholder="예: AWS Certified Solutions Architect"
                  className="w-full h-10 px-3 py-2 rounded-lg border border-gray-400 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">취득 일자 *</label>
                <input
                  type="date"
                  value={newCert.issuedDate}
                  onChange={(e) => setNewCert({ ...newCert, issuedDate: e.target.value })}
                  className="w-full h-10 px-3 py-2 rounded-lg border border-gray-400 text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">만료 일자</label>
                <input
                  type="date"
                  value={newCert.expiresAt}
                  onChange={(e) => setNewCert({ ...newCert, expiresAt: e.target.value })}
                  className="w-full h-10 px-3 py-2 rounded-lg border border-gray-400 text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCertModal(false)}
                className="flex-1 h-10 bg-white border border-gray-400 text-gray-900 font-semibold rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleAddCertification}
                className="flex-1 h-10 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 경력 추가 모달 */}
      {showExpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-4 z-50">
          <div className="bg-white rounded-t-lg sm:rounded-lg w-full sm:max-w-md p-6 shadow-lg max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">경력 추가</h2>
              <button
                onClick={() => setShowExpModal(false)}
                className="text-2xl text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">회사명 *</label>
                <input
                  type="text"
                  value={newExp.company}
                  onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                  placeholder="예: 스타트업 X"
                  className="w-full h-10 px-3 py-2 rounded-lg border border-gray-400 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">직급/직무 *</label>
                <input
                  type="text"
                  value={newExp.title}
                  onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                  placeholder="예: Senior Engineer"
                  className="w-full h-10 px-3 py-2 rounded-lg border border-gray-400 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">시작 날짜 *</label>
                <input
                  type="date"
                  value={newExp.startDate}
                  onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
                  className="w-full h-10 px-3 py-2 rounded-lg border border-gray-400 text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    checked={newExp.isCurrently}
                    onChange={(e) => setNewExp({ ...newExp, isCurrently: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-sm text-gray-900">현직</span>
                </label>
                {!newExp.isCurrently && (
                  <input
                    type="date"
                    value={newExp.endDate}
                    onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
                    className="w-full h-10 px-3 py-2 rounded-lg border border-gray-400 text-gray-900 focus:outline-none focus:border-blue-600"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">업무 설명</label>
                <textarea
                  value={newExp.description}
                  onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                  placeholder="주요 업무 내용을 입력하세요"
                  className="w-full h-20 px-3 py-2 rounded-lg border border-gray-400 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowExpModal(false)}
                className="flex-1 h-10 bg-white border border-gray-400 text-gray-900 font-semibold rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleAddExperience}
                className="flex-1 h-10 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeekerMyPage;
