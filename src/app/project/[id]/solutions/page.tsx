import SolutionsClient from "./client";

export function generateStaticParams() {
  return [{ id: "sample-lunch-wait-times" }];
}

export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SolutionsClient id={id} />;
}
