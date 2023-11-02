/**
 * Prisma support functions - but to use, need to set up prisma in the implementing app
 */
import { GenObj } from './init.js';
export declare let prisma: GenObj;
export declare function getPrisma(pextends?: GenObj): Promise<GenObj>;
export declare function getModelIds(modelName: any): Promise<any>;
/**
 * Empty tables
 * @param string|array|null tables:
 *   table name, array of table names, or empty for all
 */
export declare function clearTables(tables?: any): Promise<void>;
export declare function addRelated(from: GenObj, to: GenObj): Promise<any>;
export declare let tableMap: GenObj;
/**
 * Gets table/field defs from the DB - for mapping JSON data to strings
 */
export declare function getTableMap(): Promise<GenObj>;
/**
 * Get a model instance by id.
 * @param include - optional - string, array or object for complex includes
 */
export declare function getById(model: any, id: any, include?: any): Promise<any>;
//# sourceMappingURL=prisma-lib.d.ts.map