export function generateStaticParams() {
  return [{ id: "sample-lunch-wait-times" }];
}

import ProjectRedirectClient from "./redirect-client";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectRedirectClient id={id} />;
}
