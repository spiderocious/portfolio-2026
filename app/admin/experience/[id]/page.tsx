import { notFound } from "next/navigation";
import { getExperienceById } from "@/lib/services/experience";
import { ExperienceForm } from "../_components/experience-form";
import { updateExperienceAction } from "../actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditExperiencePage({ params }: Props) {
  const { id } = await params;
  const entry = await getExperienceById(id);
  if (!entry) notFound();

  return (
    <ExperienceForm
      experience={entry}
      onSubmit={updateExperienceAction.bind(null, id)}
    />
  );
}
