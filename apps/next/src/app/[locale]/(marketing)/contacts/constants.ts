import { Mail, MapPin, Phone, AtSign, GitBranch, Briefcase } from 'lucide-react';

export const CONTACT_CHANNELS = [
  { id: 'email', icon: Mail, href: 'mailto:hello@pipeline.studio' },
  { id: 'phone', icon: Phone, href: 'tel:+15550192834' },
  { id: 'hq', icon: MapPin, href: '#' },
];

export const SOCIAL_NODES = [
  { id: 'twitter', icon: AtSign, handle: '@pipelinestudio' },
  { id: 'github', icon: GitBranch, handle: '/pipeline-studio' },
  { id: 'linkedin', icon: Briefcase, handle: '/company/pipeline-studio' },
];

export const RADAR_BLIPS = [
  { top: '20%', left: '30%', delay: '0s' },
  { top: '60%', left: '70%', delay: '0.8s' },
  { top: '40%', left: '80%', delay: '1.5s' },
  { top: '75%', left: '25%', delay: '2.2s' },
];