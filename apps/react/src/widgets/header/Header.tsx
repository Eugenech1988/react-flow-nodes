import { ServerStatusBadge } from '@/features/server-status-badge';
import { ThemeToggle } from '@/features/toggle-theme';
import { WorkflowSubmit } from '@/features/workflow-submit';
// import { WorkflowLoad } from '@/features/workflow'; // Замените на ваш реальный импорт
import { useUser } from '@/features/auth'; // Замените на ваш реальный импорт

export const Header = () => {
  const { user } = useUser();

  // Генерация инициалов, если аватар отсутствует
  const getInitials = () => {
    if (!user) return '';
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || user.email.charAt(0).toUpperCase();
  };

  return (
    <header className="flex items-center justify-between px-6 py-3.5 bg-[#f1f5f9] dark:bg-[#030712] border-b border-border/80 shadow-xs z-40 shrink-0 transition-colors duration-300">

      <img className='h-10 w-20 ' src='@/assets/logo.svg' alt=""/>

      {/*/!* ПРАВАЯ ЧАСТЬ: Статус, Кнопки управления и Профиль пользователя *!/*/}
      {/*<div className="flex items-center gap-4">*/}
      {/*  /!* Системные статус-виджеты и переключатель темы *!/*/}
      {/*  <div className="flex items-center gap-2">*/}
      {/*    <ServerStatusBadge />*/}
      {/*    <ThemeToggle />*/}
      {/*  </div>*/}

      {/*  /!* Кнопки управления пайплайном *!/*/}
      {/*  <div className="flex items-center gap-2 border-l border-r border-border/60 px-4">*/}
      {/*    /!*<WorkflowLoad />*!/*/}
      {/*    <WorkflowSubmit />*/}
      {/*  </div>*/}

      {/*  /!* Блок авторизованного пользователя *!/*/}
      {/*  {user && (*/}
      {/*    <div className="flex items-center gap-2.5 pl-1">*/}
      {/*      <div className="flex flex-col items-end text-right select-none">*/}
      {/*        <span className="text-xs font-medium text-foreground leading-tight">*/}
      {/*          {`${user.firstName} ${user.lastName || ''}`.trim()}*/}
      {/*        </span>*/}
      {/*        <span className="text-[10px] text-muted-foreground truncate max-w-[140px]">*/}
      {/*          {user.email}*/}
      {/*        </span>*/}
      {/*      </div>*/}

      {/*      /!* Аватарка или инициалы *!/*/}
      {/*      <div className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 select-none overflow-hidden border border-border/40 bg-neutral-200 dark:bg-neutral-800">*/}
      {/*        {user.avatarUrl ? (*/}
      {/*          <img*/}
      {/*            src={user.avatarUrl}*/}
      {/*            alt={`${user.firstName} avatar`}*/}
      {/*            className="w-full h-full object-cover"*/}
      {/*          />*/}
      {/*        ) : (*/}
      {/*          <div className="flex w-full h-full items-center justify-center bg-gradient-to-br from-sky-400 to-blue-600 text-[10px] font-bold text-white uppercase tracking-wider">*/}
      {/*            {getInitials()}*/}
      {/*          </div>*/}
      {/*        )}*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  )}*/}
      {/*</div>*/}
    </header>
  );
};