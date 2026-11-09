import { Tabs } from '@/shared/ui';

export type TFormTab = 'details' | 'en' | 'ua';

interface JobFormTabsProps {
  activeTab: TFormTab;
  onChange: (tab: TFormTab) => void;
}

export function JobFormTabs({ activeTab, onChange }: JobFormTabsProps) {
  return (
    <Tabs
      tabs={[
        { id: 'details', label: 'Details' },
        { id: 'en', label: 'English', badge: 'EN' },
        { id: 'ua', label: 'Українська', badge: 'UA' },
      ]}
      currentTab={activeTab}
      onTabChange={(id) => onChange(id as TFormTab)}
      layoutId="job-form-tabs"
    />
  );
}
