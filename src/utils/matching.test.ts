import {
  calculatePassingProbability,
  getPassingProbabilityColor,
  getPassingProbabilityLevel,
} from './matching';
import { Company } from '../types';

describe('Matching Utils', () => {
  const mockCompany: Company = {
    id: '1',
    name: 'Tech Company',
    email: 'hr@tech.com',
    industry: 'IT/Software',
    description: 'Tech Company Description',
    preferred_gpa_min: 3.5,
    preferred_skills: ['React', 'TypeScript'],
    preferred_experience_type: 'Backend Engineer',
    internship_required: true,
    size: '50-100',
    founded_year: 2020,
    work_type: 'Full-time',
    benefits: ['Insurance', 'Vacation'],
    logo_url: 'https://placeholder.com/logo.png',
    background_image_url: 'https://placeholder.com/bg.png',
  };

  describe('calculatePassingProbability', () => {
    test('should calculate 100% when all requirements met', () => {
      const result = calculatePassingProbability(
        mockCompany,
        3.8, // >= 3.5
        ['React', 'TypeScript'], // matching skills
        'Backend Engineer 2021-2026', // matching experience
        true // has internship
      );

      expect(result.percentage).toBe(100);
      expect(result.fulfills.gpa).toBe(true);
      expect(result.fulfills.skills).toBe(true);
      expect(result.fulfills.experience).toBe(true);
      expect(result.fulfills.internship).toBe(true);
      expect(result.fulfilled_count).toBe(4);
      expect(result.total_requirements).toBe(4);
    });

    test('should calculate 50% when half requirements met', () => {
      const result = calculatePassingProbability(
        mockCompany,
        3.2, // < 3.5
        ['React', 'TypeScript'], // matching skills
        'Backend Engineer 2021-2026', // matching experience
        false // no internship
      );

      expect(result.percentage).toBe(50);
      expect(result.fulfills.gpa).toBe(false);
      expect(result.fulfills.skills).toBe(true);
      expect(result.fulfills.experience).toBe(true);
      expect(result.fulfills.internship).toBe(false);
      expect(result.fulfilled_count).toBe(2);
      expect(result.total_requirements).toBe(4);
    });

    test('should calculate 0% when no requirements met', () => {
      const result = calculatePassingProbability(
        mockCompany,
        3.2, // < 3.5
        ['Python', 'Java'], // no matching skills
        'Data Analyst', // no matching experience
        false // no internship
      );

      expect(result.percentage).toBe(0);
      expect(result.fulfills.gpa).toBe(false);
      expect(result.fulfills.skills).toBe(false);
      expect(result.fulfills.experience).toBe(false);
      expect(result.fulfills.internship).toBe(false);
    });

    test('should handle partial skill matching', () => {
      const result = calculatePassingProbability(
        mockCompany,
        3.8,
        ['React'], // only one matching skill
        'Backend Engineer',
        true
      );

      expect(result.fulfills.skills).toBe(true);
      expect(result.percentage).toBeGreaterThan(0);
    });

    test('should calculate 100% with no requirements set', () => {
      const companyNoRequirements: Company = {
        ...mockCompany,
        preferred_gpa_min: 0,
        preferred_skills: [],
        preferred_experience_type: '',
        internship_required: false,
      };

      const result = calculatePassingProbability(
        companyNoRequirements,
        3.0,
        ['Java'],
        '',
        false
      );

      expect(result.percentage).toBe(100);
      expect(result.total_requirements).toBe(1);
      expect(result.fulfilled_count).toBe(1);
    });

    test('should match skills case-insensitively', () => {
      const result = calculatePassingProbability(
        mockCompany,
        3.8,
        ['react', 'typescript'], // lowercase
        'Backend Engineer',
        true
      );

      expect(result.fulfills.skills).toBe(true);
    });

    test('should match experience keywords', () => {
      const result = calculatePassingProbability(
        mockCompany,
        3.8,
        ['React', 'TypeScript'],
        'Developer 2021-2026', // "Developer" includes "engineer" context
        true
      );

      expect(result.fulfills.experience).toBe(true);
    });

    test('should count requirements correctly', () => {
      const companyMinimalRequirements: Company = {
        ...mockCompany,
        preferred_skills: [], // no skill requirement
        internship_required: false, // no internship requirement
      };

      const result = calculatePassingProbability(
        companyMinimalRequirements,
        3.2, // < 3.5
        ['Java'],
        'Backend Engineer',
        false
      );

      // Only GPA and experience are required
      expect(result.total_requirements).toBe(2);
    });
  });

  describe('getPassingProbabilityColor', () => {
    test('should return green for >= 75%', () => {
      expect(getPassingProbabilityColor(100)).toBe('green');
      expect(getPassingProbabilityColor(75)).toBe('green');
    });

    test('should return orange for 50-74%', () => {
      expect(getPassingProbabilityColor(74)).toBe('orange');
      expect(getPassingProbabilityColor(50)).toBe('orange');
    });

    test('should return red for < 50%', () => {
      expect(getPassingProbabilityColor(49)).toBe('red');
      expect(getPassingProbabilityColor(0)).toBe('red');
    });
  });

  describe('getPassingProbabilityLevel', () => {
    test('should return "높음" for >= 75%', () => {
      expect(getPassingProbabilityLevel(100)).toBe('높음');
      expect(getPassingProbabilityLevel(75)).toBe('높음');
    });

    test('should return "중간" for 50-74%', () => {
      expect(getPassingProbabilityLevel(74)).toBe('중간');
      expect(getPassingProbabilityLevel(50)).toBe('중간');
    });

    test('should return "낮음" for < 50%', () => {
      expect(getPassingProbabilityLevel(49)).toBe('낮음');
      expect(getPassingProbabilityLevel(0)).toBe('낮음');
    });
  });
});
