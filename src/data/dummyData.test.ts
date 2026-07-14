import { SEEKER_DUMMY_DATA, COMPANY_DUMMY_DATA, JOB_POSTINGS_DUMMY_DATA } from './dummyData';
import { SeekerDummy, Company, JobPosting } from '../types';

describe('Dummy Data', () => {
  describe('SEEKER_DUMMY_DATA', () => {
    test('should have 10 seekers', () => {
      expect(SEEKER_DUMMY_DATA).toHaveLength(10);
    });

    test('should have valid seeker structure', () => {
      SEEKER_DUMMY_DATA.forEach((seeker: SeekerDummy) => {
        expect(seeker.id).toBeDefined();
        expect(seeker.name).toBeDefined();
        expect(seeker.email).toBeDefined();
        expect(seeker.gpa).toBeDefined();
        expect(seeker.skills).toBeDefined();
        expect(seeker.skills).toBeInstanceOf(Array);
        expect(seeker.career_history).toBeDefined();
        expect(seeker.internship_experience).toBeDefined();
        expect(typeof seeker.internship_experience).toBe('boolean');
        expect(seeker.created_at).toBeDefined();
      });
    });

    test('should have valid GPA values', () => {
      SEEKER_DUMMY_DATA.forEach((seeker) => {
        expect(seeker.gpa).toBeGreaterThanOrEqual(0);
        expect(seeker.gpa).toBeLessThanOrEqual(4.5);
      });
    });

    test('should have at least one skill per seeker', () => {
      SEEKER_DUMMY_DATA.forEach((seeker) => {
        expect(seeker.skills.length).toBeGreaterThan(0);
      });
    });

    test('should have valid email format', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      SEEKER_DUMMY_DATA.forEach((seeker) => {
        expect(emailRegex.test(seeker.email)).toBe(true);
      });
    });

    test('should have unique IDs', () => {
      const ids = SEEKER_DUMMY_DATA.map(s => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('should have valid created_at dates', () => {
      SEEKER_DUMMY_DATA.forEach((seeker) => {
        expect(() => new Date(seeker.created_at)).not.toThrow();
        expect(new Date(seeker.created_at).getTime()).toBeLessThanOrEqual(new Date().getTime());
      });
    });
  });

  describe('COMPANY_DUMMY_DATA', () => {
    test('should have 10 companies', () => {
      expect(COMPANY_DUMMY_DATA).toHaveLength(10);
    });

    test('should have valid company structure', () => {
      COMPANY_DUMMY_DATA.forEach((company: Company) => {
        expect(company.id).toBeDefined();
        expect(company.name).toBeDefined();
        expect(company.email).toBeDefined();
        expect(company.industry).toBeDefined();
        expect(company.description).toBeDefined();
        expect(company.preferred_gpa_min).toBeDefined();
        expect(company.preferred_skills).toBeDefined();
        expect(company.preferred_skills).toBeInstanceOf(Array);
        expect(company.preferred_experience_type).toBeDefined();
        expect(company.internship_required).toBeDefined();
        expect(typeof company.internship_required).toBe('boolean');
        expect(company.size).toBeDefined();
        expect(company.founded_year).toBeDefined();
        expect(company.work_type).toBeDefined();
        expect(company.benefits).toBeDefined();
        expect(company.benefits).toBeInstanceOf(Array);
      });
    });

    test('should have valid GPA requirements', () => {
      COMPANY_DUMMY_DATA.forEach((company) => {
        expect(company.preferred_gpa_min).toBeGreaterThanOrEqual(0);
        expect(company.preferred_gpa_min).toBeLessThanOrEqual(4.5);
      });
    });

    test('should have at least one skill requirement', () => {
      COMPANY_DUMMY_DATA.forEach((company) => {
        expect(company.preferred_skills.length).toBeGreaterThan(0);
      });
    });

    test('should have valid email format', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      COMPANY_DUMMY_DATA.forEach((company) => {
        expect(emailRegex.test(company.email)).toBe(true);
      });
    });

    test('should have unique IDs', () => {
      const ids = COMPANY_DUMMY_DATA.map(c => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('should have valid founded year', () => {
      COMPANY_DUMMY_DATA.forEach((company) => {
        expect(company.founded_year).toBeGreaterThan(1990);
        expect(company.founded_year).toBeLessThanOrEqual(new Date().getFullYear());
      });
    });

    test('should have at least one benefit', () => {
      COMPANY_DUMMY_DATA.forEach((company) => {
        expect(company.benefits.length).toBeGreaterThan(0);
      });
    });
  });

  describe('JOB_POSTINGS_DUMMY_DATA', () => {
    test('should have job postings', () => {
      expect(JOB_POSTINGS_DUMMY_DATA.length).toBeGreaterThan(0);
    });

    test('should have valid job posting structure', () => {
      JOB_POSTINGS_DUMMY_DATA.forEach((posting: JobPosting) => {
        expect(posting.id).toBeDefined();
        expect(posting.company_id).toBeDefined();
        expect(posting.company_name).toBeDefined();
        expect(posting.position_title).toBeDefined();
        expect(posting.experience_requirement).toBeDefined();
        expect(posting.required_skills).toBeDefined();
        expect(posting.required_skills).toBeInstanceOf(Array);
        expect(posting.location).toBeDefined();
        expect(posting.deadline).toBeDefined();
        expect(posting.description).toBeDefined();
      });
    });

    test('should have valid deadline dates', () => {
      JOB_POSTINGS_DUMMY_DATA.forEach((posting) => {
        expect(() => new Date(posting.deadline)).not.toThrow();
      });
    });

    test('should have at least one required skill', () => {
      JOB_POSTINGS_DUMMY_DATA.forEach((posting) => {
        expect(posting.required_skills.length).toBeGreaterThan(0);
      });
    });

    test('should reference valid companies', () => {
      const companyIds = COMPANY_DUMMY_DATA.map(c => c.id);
      JOB_POSTINGS_DUMMY_DATA.forEach((posting) => {
        expect(companyIds).toContain(posting.company_id);
      });
    });

    test('should have unique IDs', () => {
      const ids = JOB_POSTINGS_DUMMY_DATA.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('should have matching company names', () => {
      JOB_POSTINGS_DUMMY_DATA.forEach((posting) => {
        const company = COMPANY_DUMMY_DATA.find(c => c.id === posting.company_id);
        expect(company?.name).toBe(posting.company_name);
      });
    });
  });

  describe('Data Integrity', () => {
    test('should have consistent data relationships', () => {
      const companyIds = new Set(COMPANY_DUMMY_DATA.map(c => c.id));
      JOB_POSTINGS_DUMMY_DATA.forEach((posting) => {
        expect(companyIds.has(posting.company_id)).toBe(true);
      });
    });

    test('seeker skills should match available technologies', () => {
      const allSkills = new Set<string>();
      SEEKER_DUMMY_DATA.forEach(seeker => {
        seeker.skills.forEach(skill => allSkills.add(skill));
      });

      const companySkills = new Set<string>();
      COMPANY_DUMMY_DATA.forEach(company => {
        company.preferred_skills.forEach(skill => companySkills.add(skill));
      });

      // There should be some overlap
      const overlap = [...allSkills].filter(skill =>
        [...companySkills].some(cs =>
          cs.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(cs.toLowerCase())
        )
      );
      expect(overlap.length).toBeGreaterThan(0);
    });
  });
});
