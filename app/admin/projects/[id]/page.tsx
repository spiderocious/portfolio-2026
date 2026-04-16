import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/services/projects";
import { ProjectForm } from "../_components/project-form";
import { updateProjectAction } from "../actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <ProjectForm
      project={project}
      onSubmit={updateProjectAction.bind(null, id)}
    />
  );
}
