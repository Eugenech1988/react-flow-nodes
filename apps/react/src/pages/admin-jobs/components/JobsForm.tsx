import { useState, useEffect, type FormEvent } from 'react';
import {
  AppButton,
  FloatingInput,
  FloatingTextarea,
  FloatingSelect,
  Tabs,
  LocalAlert,
  GlobalLoader,
} from '@/shared/ui';
import { useAdminJob, useJobMutations } from '../hooks';
import { DEPT_OPTIONS, LEVEL_OPTIONS, TYPE_OPTIONS, STATUS_OPTIONS } from '../model/constants';
import type { IJob, TJobDepartment, TJobLevel, TJobStatus, TJobType } from '../model';

interface JobFormProps {
  jobId: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

type TFormTab = 'details' | 'en' | 'uk';

interface TranslationState {
  title: string;
  description: string;
  responsibilities: string;
  requirements: string;
  metaTitle: string;
  metaDescription: string;
}

const EMPTY_TRANSLATION: TranslationState = {
  title: '',
  description: '',
  responsibilities: '',
  requirements: '',
  metaTitle: '',
  metaDescription: '',
};

export function JobForm({ jobId, onSuccess, onCancel }: JobFormProps) {
  const isEditing = !!jobId;
  const { data: existingJob, isLoading } = useAdminJob(jobId);
  const { createJob, updateJob, upsertTranslation } = useJobMutations();

  const [activeTab, setActiveTab] = useState<TFormTab>('details');
  const [basic, setBasic] = useState({
    slug: '',
    department: 'ENGINEERING' as TJobDepartment,
    level: 'MID' as TJobLevel,
    type: 'FULL_TIME' as TJobType,
    location: 'Remote',
    icon: '',
    status: 'DRAFT' as TJobStatus,
  });
  const [en, setEn] = useState<TranslationState>(EMPTY_TRANSLATION);
  const [uk, setUk] = useState<TranslationState>(EMPTY_TRANSLATION);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!existingJob) return;
    const job = existingJob as IJob;

    setBasic({
      slug: job.slug,
      department: job.department,
      level: job.level,
      type: job.type,
      location: job.location,
      icon: job.icon ?? '',
      status: job.status,
    });

    const fill = (t: IJob['translations'][number]) => ({
      title: t.title,
      description: t.description,
      responsibilities: t.responsibilities.join('\n'),
      requirements: t.requirements.join('\n'),
      metaTitle: t.metaTitle ?? '',
      metaDescription: t.metaDescription ?? '',
    });

    const enT = job.translations.find((t) => t.locale === 'en');
    if (enT) setEn(fill(enT));
    const ukT = job.translations.find((t) => t.locale === 'uk');
    if (ukT) setUk(fill(ukT));
  }, [existingJob]);

  const isSubmitting = createJob.isPending || updateJob.isPending || upsertTranslation.isPending;

  const splitLines = (s: string) =>
    s
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

  const buildTranslation = (locale: string, t: TranslationState) => ({
    locale,
    title: t.title.trim(),
    description: t.description.trim(),
    responsibilities: splitLines(t.responsibilities),
    requirements: splitLines(t.requirements),
    metaTitle: t.metaTitle.trim() || undefined,
    metaDescription: t.metaDescription.trim() || undefined,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!en.title.trim() || !en.description.trim()) {
      setSubmitError('English title and description are required.');
      setActiveTab('en');
      return;
    }

    try {
      if (isEditing) {
        await updateJob.mutateAsync({
          id: jobId!,
          data: {
            slug: basic.slug,
            department: basic.department,
            level: basic.level,
            type: basic.type,
            location: basic.location,
            icon: basic.icon || null,
            status: basic.status,
          },
        });
        await upsertTranslation.mutateAsync({
          jobId: jobId!,
          data: buildTranslation('en', en),
        });
        if (uk.title.trim() || uk.description.trim()) {
          await upsertTranslation.mutateAsync({
            jobId: jobId!,
            data: buildTranslation('uk', uk),
          });
        }
      } else {
        const translations = [buildTranslation('en', en)];
        if (uk.title.trim() || uk.description.trim()) {
          translations.push(buildTranslation('uk', uk));
        }
        await createJob.mutateAsync({
          slug: basic.slug,
          department: basic.department,
          level: basic.level,
          type: basic.type,
          location: basic.location,
          icon: basic.icon || undefined,
          status: basic.status,
          translations,
        });
      }
      onSuccess();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save job');
    }
  };

  if (isEditing && isLoading) return <GlobalLoader />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-12">
      {/* Sticky header */}
      <div className="bg-background/80 border-border sticky top-14 z-10 flex items-center justify-between border-b py-4 backdrop-blur-md">
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Vacancy' : 'New Vacancy'}</h1>
        <div className="flex gap-3">
          <AppButton
            type="button"
            variant="secondary"
            size="md"
            text="Cancel"
            onClick={onCancel}
            isDisabled={isSubmitting}
          />
          <AppButton
            type="submit"
            variant="primary"
            size="md"
            isPending={isSubmitting}
            pendingText="Saving..."
            text={isEditing ? 'Save Changes' : 'Create Vacancy'}
          />
        </div>
      </div>

      {submitError && <LocalAlert hasError hasSuccess={false} alertMessage={submitError} />}

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'details', label: 'Details' },
          { id: 'en', label: 'English', badge: 'EN' },
          { id: 'uk', label: 'Українська', badge: 'UK' },
        ]}
        currentTab={activeTab}
        onTabChange={(id) => setActiveTab(id as TFormTab)}
        layoutId="job-form-tabs"
      />

      {/* Details */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <FloatingInput
              label="Slug (unique)"
              value={basic.slug}
              onChange={(e) => setBasic({ ...basic, slug: e.target.value })}
              required
              className="font-mono"
            />
          </div>
          <FloatingSelect
            label="Department"
            value={basic.department}
            onChange={(v) => setBasic({ ...basic, department: v as TJobDepartment })}
            options={DEPT_OPTIONS}
          />
          <FloatingSelect
            label="Level"
            value={basic.level}
            onChange={(v) => setBasic({ ...basic, level: v as TJobLevel })}
            options={LEVEL_OPTIONS}
          />
          <FloatingSelect
            label="Type"
            value={basic.type}
            onChange={(v) => setBasic({ ...basic, type: v as TJobType })}
            options={TYPE_OPTIONS}
          />
          <FloatingInput
            label="Location"
            value={basic.location}
            onChange={(e) => setBasic({ ...basic, location: e.target.value })}
            required
          />
          <FloatingInput
            label="Icon (Lucide name)"
            value={basic.icon}
            onChange={(e) => setBasic({ ...basic, icon: e.target.value })}
            placeholder="code-2"
            className="font-mono"
          />
          <FloatingSelect
            label="Status"
            value={basic.status}
            onChange={(v) => setBasic({ ...basic, status: v as TJobStatus })}
            options={STATUS_OPTIONS}
          />
        </div>
      )}

      {/* Translations */}
      {activeTab === 'en' && <TranslationFields value={en} onChange={setEn} />}
      {activeTab === 'uk' && <TranslationFields value={uk} onChange={setUk} />}
    </form>
  );
}

function TranslationFields({
  value,
  onChange,
}: {
  value: TranslationState;
  onChange: (v: TranslationState) => void;
}) {
  return (
    <div className="space-y-5">
      <FloatingInput
        label="Title"
        value={value.title}
        onChange={(e) => onChange({ ...value, title: e.target.value })}
      />
      <FloatingTextarea
        label="Description"
        value={value.description}
        onChange={(e) => onChange({ ...value, description: e.target.value })}
        rows={4}
      />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FloatingTextarea
          label="Responsibilities (1 per line)"
          value={value.responsibilities}
          onChange={(e) => onChange({ ...value, responsibilities: e.target.value })}
          rows={6}
          className="font-mono text-xs"
        />
        <FloatingTextarea
          label="Requirements (1 per line)"
          value={value.requirements}
          onChange={(e) => onChange({ ...value, requirements: e.target.value })}
          rows={6}
          className="font-mono text-xs"
        />
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FloatingInput
          label="Meta Title (SEO)"
          value={value.metaTitle}
          onChange={(e) => onChange({ ...value, metaTitle: e.target.value })}
        />
        <FloatingInput
          label="Meta Description (SEO)"
          value={value.metaDescription}
          onChange={(e) => onChange({ ...value, metaDescription: e.target.value })}
        />
      </div>
    </div>
  );
}
