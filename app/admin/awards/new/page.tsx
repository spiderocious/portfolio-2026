import { AwardForm } from "../_components/award-form";
import { createAwardAction } from "../actions";

export default function NewAwardPage() {
  return <AwardForm onSubmit={createAwardAction} />;
}
