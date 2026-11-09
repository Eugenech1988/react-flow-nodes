export const ContactsBackground = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(45,212,191,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(45,212,191,0.03)_1px,transparent_1px)] bg-size-[4rem_4rem]" />
      <div className="absolute top-0 left-1/2 h-150 w-200 -translate-x-1/2 rounded-full bg-[#2dd4bf]/5 blur-[150px]" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
        <div className="h-200 w-200 rounded-full border border-[#2dd4bf]/20" />
        <div className="absolute inset-20 rounded-full border border-dashed border-[#2dd4bf]/30" />
        <div className="absolute inset-40 rounded-full border border-[#2dd4bf]/20" />
        <div className="absolute inset-60 rounded-full border border-dashed border-[#2dd4bf]/30" />
      </div>
    </div>
  );
};
