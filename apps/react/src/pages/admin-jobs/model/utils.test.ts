import { describe, it, expect } from 'vitest';
import {
  getEnTitle,
  getLocalesLabel,
  getStatusConfig,
  getSortValue,
  sortJobs,
} from './utils';
import { STATUS_CONFIG, FALLBACK_STATUS } from './constants';
import type { IJob } from './types';

const makeJob = (overrides: Partial<IJob> = {}): IJob => ({
  id: 'j1',
  slug: 'senior-dev',
  status: 'DRAFT',
  department: 'ENGINEERING',
  level: 'MID',
  type: 'FULL_TIME',
  location: 'Remote',
  icon: null,
  publishedAt: null,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  translations: [],
  ...overrides,
});

describe('utils', () => {
  describe('getEnTitle', () => {
    it('returns en title', () => {
      const job = makeJob({
        translations: [
          {
            id: 't1',
            jobId: 'j1',
            locale: 'en',
            title: 'Senior Dev',
            description: '',
            responsibilities: [],
            requirements: [],
            metaTitle: null,
            metaDescription: null,
          },
        ],
      });
      expect(getEnTitle(job)).toBe('Senior Dev');
    });

    it('returns empty when no en translation', () => {
      expect(getEnTitle(makeJob())).toBe('');
    });
  });

  describe('getLocalesLabel', () => {
    it('joins locales', () => {
      const job = makeJob({
        translations: [
          {
            id: 't1',
            jobId: 'j1',
            locale: 'en',
            title: '',
            description: '',
            responsibilities: [],
            requirements: [],
            metaTitle: null,
            metaDescription: null,
          },
          {
            id: 't2',
            jobId: 'j1',
            locale: 'ua',
            title: '',
            description: '',
            responsibilities: [],
            requirements: [],
            metaTitle: null,
            metaDescription: null,
          },
        ],
      });
      expect(getLocalesLabel(job)).toBe('en, ua');
    });

    it('returns — for no translations', () => {
      expect(getLocalesLabel(makeJob())).toBe('—');
    });
  });

  describe('getStatusConfig', () => {
    it('returns known config', () => {
      expect(getStatusConfig('DRAFT')).toBe(STATUS_CONFIG.DRAFT);
      expect(getStatusConfig('PUBLISHED')).toBe(STATUS_CONFIG.PUBLISHED);
    });

    it('returns fallback for unknown', () => {
      expect(getStatusConfig('UNKNOWN')).toBe(FALLBACK_STATUS);
    });
  });

  describe('getSortValue', () => {
    it('handles all keys', () => {
      const job = makeJob({ slug: 'abc' });
      expect(getSortValue(job, 'slug')).toBe('abc');
      expect(getSortValue(job, 'department')).toBe('ENGINEERING');
      expect(getSortValue(job, 'status')).toBe('DRAFT');
      expect(getSortValue(job, 'locales')).toBe('');
    });
  });

  describe('sortJobs', () => {
    const a = makeJob({ id: 'a', slug: 'aaa' });
    const b = makeJob({ id: 'b', slug: 'bbb' });
    const c = makeJob({ id: 'c', slug: 'ccc' });

    it('returns original when no sorting', () => {
      const jobs = [c, a, b];
      expect(sortJobs(jobs, [])).toBe(jobs);
    });

    it('sorts ascending', () => {
      const sorted = sortJobs([c, a, b], [{ id: 'slug', desc: false }]);
      expect(sorted.map((j) => j.id)).toEqual(['a', 'b', 'c']);
    });

    it('sorts descending', () => {
      const sorted = sortJobs([c, a, b], [{ id: 'slug', desc: true }]);
      expect(sorted.map((j) => j.id)).toEqual(['c', 'b', 'a']);
    });

    it('does not mutate original', () => {
      const jobs = [c, a, b];
      sortJobs(jobs, [{ id: 'slug', desc: false }]);
      expect(jobs.map((j) => j.id)).toEqual(['c', 'a', 'b']);
    });
  });
});
