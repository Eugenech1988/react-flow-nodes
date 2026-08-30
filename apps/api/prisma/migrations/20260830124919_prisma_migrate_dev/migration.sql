-- CreateTable
CREATE TABLE "database_nodes" (
    "id" TEXT NOT NULL,
    "pipeline_id" TEXT,
    "node_id" TEXT NOT NULL,
    "query" TEXT,
    "params" JSONB,
    "data" JSONB,
    "status" TEXT DEFAULT 'SUCCESS',
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "database_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "database_nodes_pipeline_id_idx" ON "database_nodes"("pipeline_id");

-- CreateIndex
CREATE INDEX "database_nodes_node_id_idx" ON "database_nodes"("node_id");

-- CreateIndex
CREATE INDEX "database_nodes_user_id_idx" ON "database_nodes"("user_id");

-- AddForeignKey
ALTER TABLE "database_nodes" ADD CONSTRAINT "database_nodes_pipeline_id_fkey" FOREIGN KEY ("pipeline_id") REFERENCES "pipelines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "database_nodes" ADD CONSTRAINT "database_nodes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
