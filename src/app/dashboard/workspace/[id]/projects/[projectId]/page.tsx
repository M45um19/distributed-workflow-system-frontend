import ProjectDetails from "@/features/project/components/ProjectDetails";

interface PageProps {
  params: Promise<{ id: string; projectId: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id, projectId } = await params;
  return <ProjectDetails workspaceId={id} projectId={projectId} />;
}
