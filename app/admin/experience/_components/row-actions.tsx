"use client";

import { useState } from "react";
import { ConfirmDialog } from "../../_components/confirm-dialog";
import { RowActions, EditAction, DeleteAction } from "../../_components/row-actions";
import { deleteExperienceAction } from "../actions";

export function ExperienceRowActions({ entryId, role }: { entryId: string; role: string }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <RowActions>
      <EditAction href={`/admin/experience/${entryId}`} />
      <DeleteAction onClick={() => setConfirming(true)} />
      {confirming && (
        <ConfirmDialog
          title="delete experience?"
          body={`this will permanently delete "${role}". this cannot be undone.`}
          onCancel={() => setConfirming(false)}
          onConfirm={async () => { await deleteExperienceAction(entryId); }}
        />
      )}
    </RowActions>
  );
}
