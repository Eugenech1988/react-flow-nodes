export type TJobStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type TJobDepartment = 'ENGINEERING' | 'DESIGN' | 'RESEARCH' | 'OPERATIONS';
export type TJobLevel = 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD';
export type TJobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';

export interface IJobTranslation {
  id: string;
  jobId: string;
  locale: string;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  metaTitle: string | null;
  metaDescription: string | null;
}

export interface IJob {
  id: string;
  slug: string;
  status: TJobStatus;
  department: TJobDepartment;
  level: TJobLevel;
  type: TJobType;
  location: string;
  icon: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  translations: IJobTranslation[];
}