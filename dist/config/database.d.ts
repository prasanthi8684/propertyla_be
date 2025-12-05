import pkg from 'pg';
declare const pool: pkg.Pool;
export declare const query: (text: string, params?: any[]) => Promise<pkg.QueryResult<any>>;
export declare const getClient: () => Promise<pkg.PoolClient>;
export default pool;
//# sourceMappingURL=database.d.ts.map