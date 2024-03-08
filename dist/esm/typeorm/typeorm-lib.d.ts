/**
 * TypeORM library convenient functions
 */
import "reflect-metadata";
export * from './to-entities.js';
import { GenObj } from './index.js';
export declare let AppDataSource: any;
/**
 * Initializes TO DB connection - provides default config that can be overridden by ToConfig arg
 * @param ToConfig
 * @returns connected ToDataSource
 */
export declare function getToDataSource(ToConfig?: GenObj): Promise<any>;
//# sourceMappingURL=typeorm-lib.d.ts.map