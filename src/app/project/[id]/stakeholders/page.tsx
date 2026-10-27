export function generateStaticParams() {
  return [{ id: "sample-lunch-wait-times" }];
}

import StakeholdersClient from "./client";

export default async function StakeholdersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StakeholdersClient id={id} />;
}
