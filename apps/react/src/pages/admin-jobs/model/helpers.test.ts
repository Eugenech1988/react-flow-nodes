import { describe, it, expect } from 'vitest';
import { splitLines, fillTranslation, buildTranslationPayload } from './helpers';
import type { IJobTranslation } from './types';

describe('helpers', () => {
  describe('splitLines', () => {
    it('splits by newline and trims', () => {
      expect(splitLines('a\nb\n  c  \n\n')).toEqual(['a', 'b', 'c']);
    });
    it('returns empty for empty string', () => {
      expect(splitLines('')).toEqual([]);
    });
  });

  describe('fillTranslation', () => {
    it('returns empty strings for undefined', () => {
      const result = fillTranslation(undefined);
      expect(result).toEqual({
        title: '',
        description: '',
        responsibilities: '',
        requirements: '',
        metaTitle: '',
        metaDescription: '',
      });
    });

    it('joins arrays by newline', () => {
      const tr: IJobTranslation = {
        id: 't1',
        jobId: 'j1',
        locale: 'en',
        title: 'Title',
        description: 'Desc',
        responsibilities: ['A', 'B'],
        requirements: ['X'],
        metaTitle: null,
        metaDescription: null,
      };
      const result = fillTranslation(tr);
      expect(result.responsibilities).toBe('A\nB');
      expect(result.requirements).toBe('X');
      expect(result.metaTitle).toBe('');
    });
  });

  describe('buildTranslationPayload', () => {
    it('splits responsibilities/requirements', () => {
      const result = buildTranslationPayload('en', {
        title: ' Title ',
        description: ' Desc ',
        responsibilities: 'A\nB',
        requirements: 'X\nY',
        metaTitle: ' MT ',
        metaDescription: ' MD ',
      });
      expect(result).toEqual({
        locale: 'en',
        title: 'Title',
        description: 'Desc',
        responsibilities: ['A', 'B'],
        requirements: ['X', 'Y'],
        metaTitle: 'MT',
        metaDescription: 'MD',
      });
    });

    it('omits empty meta fields', () => {
      const result = buildTranslationPayload('en', {
        title: 'T',
        description: 'D',
        responsibilities: '',
        requirements: '',
        metaTitle: '',
        metaDescription: '',
      });
      expect(result.metaTitle).toBeUndefined();
      expect(result.metaDescription).toBeUndefined();
    });
  });
});
