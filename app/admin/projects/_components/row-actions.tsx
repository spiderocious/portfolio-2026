"use client";

import { useState } from "react";
import { ConfirmDialog } from "../../_components/confirm-dialog";
import { RowActions, EditAction, DeleteAction } from "../../_components/row-actions";
import { deleteProjectAction } from "../actions";

export function ProjectRowActions({ projectId, projectTitle }: { projectId: string; projectTitle: string }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <RowActions>
      <EditAction href={`/admin/projects/${projectId}`} />
      <DeleteAction onClick={() => setConfirming(true)} />
      {confirming && (
        <ConfirmDialog
          title="delete project?"
          body={`this will permanently delete "${projectTitle}". this cannot be undone.`}
          onCancel={() => setConfirming(false)}
          onConfirm={async () => { await deleteProjectAction(projectId); }}
        />
      )}
    </RowActions>
  );
}
