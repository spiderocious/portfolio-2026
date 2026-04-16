import { notFound } from "next/navigation";
import { getExperimentById } from "@/lib/services/experiments";
import { ExperimentForm } from "../_components/experiment-form";
import { updateExperimentAction } from "../actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditExperimentPage({ params }: Props) {
  const { id } = await params;
  const experiment = await getExperimentById(id);
  if (!experiment) notFound();

  return (
    <ExperimentForm
      experiment={experiment}
      onSubmit={updateExperimentAction.bind(null, id)}
    />
  );
}
