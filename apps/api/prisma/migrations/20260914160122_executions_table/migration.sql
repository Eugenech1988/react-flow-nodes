-- CreateEnum
CREATE TYPE "ExecutionStatus" AS ENUM ('RUNNING', 'SUCCESS', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "TriggerType" AS ENUM ('MANUAL', 'WEBHOOK', 'CRON', 'API');

-- CreateTable
CREATE TABLE "executions" (
    "id" TEXT NOT NULL,
    "pipeline_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "ExecutionStatus" NOT NULL DEFAULT 'RUNNING',
    "triggered_by" "TriggerType" NOT NULL DEFAULT 'MANUAL',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),
    "duration_ms" INTEGER,
    "nodes_executed" INTEGER NOT NULL DEFAULT 0,
    "logs" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "executions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "executions_pipeline_id_idx" ON "executions"("pipeline_id");

-- CreateIndex
CREATE INDEX "executions_user_id_idx" ON "executions"("user_id");

-- CreateIndex
CREATE INDEX "executions_status_idx" ON "executions"("status");

-- AddForeignKey
ALTER TABLE "executions" ADD CONSTRAINT "executions_pipeline_id_fkey" FOREIGN KEY ("pipeline_id") REFERENCES "pipelines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "executions" ADD CONSTRAINT "executions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
