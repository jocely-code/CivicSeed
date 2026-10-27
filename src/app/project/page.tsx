import ProjectClient from "./client";

export default async function ProjectPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const id = typeof searchParams.id === "string" ? searchParams.id : "";
  const step = typeof searchParams.step === "string" ? searchParams.step : "define";
  return <ProjectClient id={id} step={step} />;
}
