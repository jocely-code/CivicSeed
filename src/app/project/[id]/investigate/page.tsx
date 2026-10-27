import InvestigateClient from "./client";

export function generateStaticParams() {
  return [{ id: "sample-lunch-wait-times" }];
}

export default async function InvestigatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InvestigateClient id={id} />;
}
