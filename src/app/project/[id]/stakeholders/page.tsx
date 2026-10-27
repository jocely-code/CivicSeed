export function generateStaticParams() {
  return [{ id: "sample-lunch-wait-times" }];
}

import StakeholdersClient from "./client";

export default async function StakeholdersPage() {
  return <StakeholdersClient />;
}
