import { ExperimentForm } from "../_components/experiment-form";
import { createExperimentAction } from "../actions";

export default function NewExperimentPage() {
  return <ExperimentForm onSubmit={createExperimentAction} />;
}
