// apps/app/src/pages/login/model/constants.ts

export const DEFAULT_LABEL_CLASSES =
  'text-zinc-400 group-hover:text-teal-400 peer-focus:text-teal-400 peer-focus-visible:text-teal-400 peer-not-placeholder-shown:text-teal-400';

export const DEFAULT_FIELDSET_CLASSES =
  'border-white/10 hover:border-teal-500/50 group-hover:border-teal-500/50 peer-focus:border-teal-500 peer-focus-visible:border-teal-500 peer-not-placeholder-shown:border-teal-500/50';

// 👇 Добавлены классы для фикса автозаполнения
export const DEFAULT_TEXT_CLASSES = `
  text-white [-webkit-text-fill-color:white]! 
  [&:-webkit-autofill]:shadow-[inset_0_0_0_100px_#050505]! 
  [&:-webkit-autofill]:[-webkit-text-fill-color:white]!
  [&:-webkit-autofill:hover]:shadow-[inset_0_0_0_100px_#050505]!
  [&:-webkit-autofill:focus]:shadow-[inset_0_0_0_100px_#050505]!
`.trim();