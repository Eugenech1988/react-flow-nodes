export declare class CreateDatabaseNodeInputDto {
    id?: string | null | undefined;
    pipelineId?: string | null;
    nodeId: string;
    query?: string | null;
    params?: Record<string, unknown> | null;
    data?: unknown | null;
    status?: string | null;
    userId?: string | null;
    createdAt?: string | Date | null;
    updatedAt?: string | Date | null;
}
