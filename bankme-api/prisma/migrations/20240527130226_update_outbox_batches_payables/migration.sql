-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_outbox_batches_payables" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "batch_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "status_message" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "outbox_batches_payables_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_outbox_batches_payables" ("attempts", "batch_id", "created_at", "deleted_at", "id", "message", "status", "status_message", "updated_at") SELECT "attempts", "batch_id", "created_at", "deleted_at", "id", "message", coalesce("status", 'pending') AS "status", "status_message", "updated_at" FROM "outbox_batches_payables";
DROP TABLE "outbox_batches_payables";
ALTER TABLE "new_outbox_batches_payables" RENAME TO "outbox_batches_payables";
PRAGMA foreign_key_check("outbox_batches_payables");
PRAGMA foreign_keys=ON;
