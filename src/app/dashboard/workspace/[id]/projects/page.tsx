import WorkspaceDetails from "@/features/workspace/components/WorkspaceDetails";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkspaceDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <WorkspaceDetails id={id} />;
}
