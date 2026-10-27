export function generateStaticParams() {
  return [{ id: "sample-lunch-wait-times" }];
}

import DefinePageClient from "./client";

export default async function DefinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DefinePageClient id={id} />;
}
