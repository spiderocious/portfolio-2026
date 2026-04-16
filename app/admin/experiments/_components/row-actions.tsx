"use client";

import { useState } from "react";
import { ConfirmDialog } from "../../_components/confirm-dialog";
import { RowActions, EditAction, DeleteAction } from "../../_components/row-actions";
import { deleteExperimentAction } from "../actions";

export function ExperimentRowActions({ experimentId, title }: { experimentId: string; title: string }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <RowActions>
      <EditAction href={`/admin/experiments/${experimentId}`} />
      <DeleteAction onClick={() => setConfirming(true)} />
      {confirming && (
        <ConfirmDialog
          title="delete experiment?"
          body={`this will permanently delete "${title}". this cannot be undone.`}
          onCancel={() => setConfirming(false)}
          onConfirm={async () => { await deleteExperimentAction(experimentId); }}
        />
      )}
    </RowActions>
  );
}
