export const ContactsBackground = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(45,212,191,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(45,212,191,0.03)_1px,transparent_1px)] bg-size-[4rem_4rem]" />

      <div className="absolute top-0 left-1/2 h-75 w-75 -translate-x-1/2 rounded-full bg-[#2dd4bf]/5 blur-[80px] sm:h-150 sm:w-150 sm:blur-[150px]" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
        <div className="h-80 w-[320px] rounded-full border border-[#2dd4bf]/20 sm:h-150 sm:w-150 lg:h-200 lg:w-200" />
        <div className="absolute inset-4 rounded-full border border-dashed border-[#2dd4bf]/30 sm:inset-10 lg:inset-20" />
        <div className="absolute inset-10 rounded-full border border-[#2dd4bf]/20 sm:inset-24 lg:inset-40" />
        <div className="absolute inset-16 rounded-full border border-dashed border-[#2dd4bf]/30 sm:inset-40 lg:inset-60" />
      </div>
    </div>
  );
};
