export const ContactsBackground = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--theme-accent)_3%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--theme-accent)_3%,transparent)_1px,transparent_1px)] bg-size-[4rem_4rem]" />

    <div className="bg-theme-accent/5 absolute top-0 left-1/2 h-75 w-75 -translate-x-1/2 rounded-full blur-[80px] sm:h-150 sm:w-150 sm:blur-[150px]" />

    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
      <div className="border-theme-accent/20 h-80 w-[320px] rounded-full border sm:h-150 sm:w-150 lg:h-200 lg:w-200" />
      <div className="border-theme-accent/30 absolute inset-4 rounded-full border border-dashed sm:inset-10 lg:inset-20" />
      <div className="border-theme-accent/20 absolute inset-10 rounded-full border sm:inset-24 lg:inset-40" />
      <div className="border-theme-accent/30 absolute inset-16 rounded-full border border-dashed sm:inset-40 lg:inset-60" />
    </div>
  </div>
);
