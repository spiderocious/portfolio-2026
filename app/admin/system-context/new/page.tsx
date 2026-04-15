import { ContextForm } from "../_components/context-form";
import { createContextEntryAction } from "../actions";

export default function NewContextEntryPage() {
  return <ContextForm onSubmit={createContextEntryAction} />;
}
