import ProjectDetails from "@/features/project/components/ProjectDetails";

interface PageProps {
  params: Promise<{ workspaceId: string; projectId: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { workspaceId, projectId } = await params;
  return <ProjectDetails workspaceId={workspaceId} projectId={projectId} />;
}
