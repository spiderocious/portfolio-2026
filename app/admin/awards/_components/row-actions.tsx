"use client";

import { useState } from "react";
import { ConfirmDialog } from "../../_components/confirm-dialog";
import { RowActions, EditAction, DeleteAction } from "../../_components/row-actions";
import { deleteAwardAction } from "../actions";

export function AwardRowActions({ awardId, title }: { awardId: string; title: string }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <RowActions>
      <EditAction href={`/admin/awards/${awardId}`} />
      <DeleteAction onClick={() => setConfirming(true)} />
      {confirming && (
        <ConfirmDialog
          title="delete award?"
          body={`this will permanently delete "${title}". this cannot be undone.`}
          onCancel={() => setConfirming(false)}
          onConfirm={async () => { await deleteAwardAction(awardId); }}
        />
      )}
    </RowActions>
  );
}
