import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Plus,
  Search,
  MoreVertical,
  Edit3,
  Trash2,
  Workflow,
  Clock,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  Sparkles,
} from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@pipeline/ui';
import { debounce } from '@/shared/lib';

export interface IPipeline {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  lastRunStatus?: 'success' | 'failed' | 'running';
  lastRunAt?: string;
  updatedAt: string;
  thumbnail: string;
}

const TAB_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'paused', label: 'Paused' },
  { id: 'draft', label: 'Draft' },
] as const;

type TabType = (typeof TAB_OPTIONS)[number]['id'];

const MOCK_PIPELINES: IPipeline[] = [
  {
    id: '1',
    name: 'Customer Onboarding Sync',
    description: 'Sync new user signups from Stripe to HubSpot CRM and send welcome email.',
    status: 'active',
    lastRunStatus: 'success',
    lastRunAt: '10 minutes ago',
    updatedAt: '2 hours ago',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    name: 'Daily Financial Reporting',
    description: 'Aggregate daily sales transactions and upload summary report to S3.',
    status: 'active',
    lastRunStatus: 'failed',
    lastRunAt: 'Yesterday at 23:00',
    updatedAt: '1 day ago',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    name: 'Inventory Sync Automation',
    description: 'Fetch stock updates from warehouse API and update Shopify inventory.',
    status: 'paused',
    lastRunStatus: 'success',
    lastRunAt: '3 days ago',
    updatedAt: '3 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.15, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1, ease: 'easeIn' }
  },
};

export const PipelinesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TabType>('all');
  const [pipelines, setPipelines] = useState<IPipeline[]>(MOCK_PIPELINES);

  const updateDebouncedSearch = debounce((value: string) => {
    setDebouncedSearch(value);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    updateDebouncedSearch(value);
  };

  const filteredPipelines = pipelines.filter((pipeline) => {
    const matchesSearch =
      pipeline.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      pipeline.description.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pipeline.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    setPipelines((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Workflow className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Pipelines</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage, automate, and monitor your data workflows and integrations.
          </p>
        </div>

        <Button
          onClick={() => navigate('/pipelines/new')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-linear-to-r from-teal-700 to-teal-600 hover:from-teal-600 hover:to-teal-500 active:from-teal-800 active:to-teal-700 rounded-xl cursor-pointer shadow-xs transition-all shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-teal-500/20"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Create Pipeline</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search pipelines..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border/80 rounded-xl placeholder:text-muted-foreground text-foreground focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
          />
        </div>

        <div className="flex items-center p-1 bg-muted/40 rounded-xl border border-border/50 self-start sm:self-auto">
          {TAB_OPTIONS.map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`relative px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all cursor-pointer outline-none ${
                  isActive
                    ? 'bg-card text-teal-600 dark:text-teal-400 shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {filteredPipelines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredPipelines.map((pipeline) => (
              <motion.div
                key={pipeline.id}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={cardVariants}
                className="group border border-border/80 bg-card rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-teal-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3 p-5">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted border border-border/40">
                    <img
                      src={pipeline.thumbnail}
                      alt={pipeline.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span
                        onClick={() => navigate(`/pipelines/${pipeline.id}`)}
                        className="font-semibold text-base text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 cursor-pointer transition-colors line-clamp-1"
                      >
                        {pipeline.name}
                      </span>

                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors outline-none cursor-pointer shrink-0">
                          <MoreVertical className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-40 border border-border/80 bg-card p-1 rounded-xl shadow-lg"
                        >
                          <DropdownMenuItem
                            onClick={() => navigate(`/pipelines/${pipeline.id}`)}
                            className="flex items-center gap-2 px-2 py-1.5 text-xs rounded-lg cursor-pointer transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>Edit Workflow</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleDelete(pipeline.id)}
                            className="flex items-center gap-2 px-2 py-1.5 text-xs rounded-lg cursor-pointer text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 focus:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-current" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {pipeline.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3.5 border-t border-border/50 bg-muted/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    {pipeline.status === 'active' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                        Active
                      </span>
                    )}
                    {pipeline.status === 'paused' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <PauseCircle className="w-3 h-3" />
                        Paused
                      </span>
                    )}
                    {pipeline.status === 'draft' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground">
                        Draft
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{pipeline.lastRunAt || 'Never run'}</span>
                    {pipeline.lastRunStatus === 'success' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 ml-0.5" />
                    )}
                    {pipeline.lastRunStatus === 'failed' && (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500 ml-0.5" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/80 bg-muted/5 space-y-4"
          >
            <div className="p-4 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-base font-semibold text-foreground">No pipelines found</h3>
              <p className="text-xs text-muted-foreground">
                {searchQuery
                  ? 'Try adjusting your search query or status filter.'
                  : 'Get started by creating your first automation pipeline.'}
              </p>
            </div>
            {!searchQuery && (
              <Button
                onClick={() => navigate('/pipelines/new')}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-teal-600 hover:bg-teal-500 rounded-lg cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Pipeline
              </Button>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};