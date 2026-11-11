export type TPageProps = {
  params: Promise<{ locale: string }>;
};

export type TPageWithIdProps = {
  params: Promise<{ locale: string; id: string }>;
};
