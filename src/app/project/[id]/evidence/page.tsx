import EvidenceClient from "./client";

export function generateStaticParams() {
  return [{ id: "sample-lunch-wait-times" }];
}

export default async function EvidencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EvidenceClient id={id} />;
}
