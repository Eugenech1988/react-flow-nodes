import { Save } from 'lucide-react';
import { FloatingInput } from '@/shared/ui/FloatingInput';
import type { IProfileFormData } from '../types';

interface ProfileFormProps {
  formData: IProfileFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ProfileForm = ({ formData, onChange, onSubmit }: ProfileFormProps) => {
  return (
    <div className="md:col-span-2 border border-border bg-card rounded-xl shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-border/60 bg-foreground/[0.01]">
        <h3 className="font-medium text-sm">Personal Information</h3>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FloatingInput
            label="First Name"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={onChange}
            required
          />
          <FloatingInput
            label="Last Name"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={onChange}
            required
          />
        </div>

        <FloatingInput
          label="Email Address"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          disabled
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FloatingInput
            label="Company"
            id="company"
            name="company"
            value={formData.company}
            onChange={onChange}
          />
          <FloatingInput
            label="Location"
            id="location"
            name="location"
            value={formData.location}
            onChange={onChange}
          />
        </div>

        <FloatingInput
          label="Job Title"
          id="jobTitle"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={onChange}
        />

        <div className="flex justify-end pt-2 border-t border-border/60">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-500 active:bg-teal-700 rounded-lg cursor-pointer shadow-xs transition-colors outline-hidden focus:ring-2 focus:ring-teal-500/20"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};