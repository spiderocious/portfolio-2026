import { ProjectForm } from "../_components/project-form";
import { createProjectAction } from "../actions";

export default function NewProjectPage() {
  return <ProjectForm onSubmit={createProjectAction} />;
}
