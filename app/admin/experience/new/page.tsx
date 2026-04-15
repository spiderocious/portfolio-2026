import { ExperienceForm } from "../_components/experience-form";
import { createExperienceAction } from "../actions";

export default function NewExperiencePage() {
  return <ExperienceForm onSubmit={createExperienceAction} />;
}
