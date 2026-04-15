import { notFound } from "next/navigation";
import { getAwardById } from "@/lib/services/awards";
import { AwardForm } from "../_components/award-form";
import { updateAwardAction } from "../actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAwardPage({ params }: Props) {
  const { id } = await params;
  const award = await getAwardById(id);
  if (!award) notFound();

  return (
    <AwardForm
      award={award}
      onSubmit={(fd) => updateAwardAction(id, fd)}
    />
  );
}
