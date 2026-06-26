declare module pg {
  export class Pool {
    constructor(config: { connectionString?: string; max?: number; [key: string]: unknown });
    query(text: string, params?: unknown[]): Promise<{ rows: unknown[] }>;
    end(): Promise<void>;
  }
  export class Client {
    constructor(config: { connectionString?: string; [key: string]: unknown });
    connect(): Promise<void>;
    query(text: string, params?: unknown[]): Promise<{ rows: unknown[] }>;
    end(): Promise<void>;
  }
}
