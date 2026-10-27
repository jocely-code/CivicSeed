import BriefClient from "./client";

export function generateStaticParams() {
  return [{ id: "sample-lunch-wait-times" }];
}

export default async function BriefPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BriefClient id={id} />;
}
