import WorkspaceDetails from "@/features/workspace/components/WorkspaceDetails";

interface PageProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function WorkspaceDetailPage({ params }: PageProps) {
  const { workspaceId } = await params;
  return <WorkspaceDetails id={workspaceId} />;
}
