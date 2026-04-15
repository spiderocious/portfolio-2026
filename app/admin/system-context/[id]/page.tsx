import { notFound } from "next/navigation";
import { getContextEntryById } from "@/lib/services/system-context";
import { ContextForm } from "../_components/context-form";
import { updateContextEntryAction } from "../actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditContextEntryPage({ params }: Props) {
  const { id } = await params;
  const entry = await getContextEntryById(id);
  if (!entry) notFound();

  return (
    <ContextForm
      entry={entry}
      onSubmit={(fd) => updateContextEntryAction(id, fd)}
    />
  );
}
