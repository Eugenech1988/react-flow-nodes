import { Search } from 'lucide-react';
import { FloatingInput } from '@/shared/ui';

export const SearchBar = () => <FloatingInput icon={<Search/>} className='w-full' label="Search" />;