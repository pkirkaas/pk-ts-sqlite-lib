/**
 * Prisma support functions - but to use, need to set up prisma in the implementing app
 */
import { GenObj } from './init.js';
import { Prisma } from '@prisma/client';
export declare let prisma: GenObj;
/**
 * Returns the hidden dmmf datamodel from Prisma, to get the schema
 */
export declare function getDatamodel(lPrisma?: typeof Prisma): any;
/**
 * Returns details of model fields, properties, relationships, etc, in friendly form.
 * @return GenObj of the form:
 * {
 *   [ModelName]: {
 *     allFields: { // All fields, relationship & model fields
 *       [fieldName] : [fieldSpec]
 *     },
 *     modelFields : { // Subset of all fields that are direct - like table fields
 *       [fieldName] : [fieldSpec]
 *     },
 *    relationFields : { //  fields that are relationships -
 *       [fieldName] : [fieldSpec]
 *     },
 *   }
 * }
 *
 * The fieldSpec for relationship fields has:
 * kind: 'object',
 * isList: true/false (true for one-to-many or many-to-many
 * relationpName : "PostToUser",
 * type: 'Post',
 *
 */
export declare function getSchema(lPrisma?: typeof Prisma): GenObj;
/**
 * Common enhancements/extensions to prisma client, to be merged
 * with custom extensions per implementing app
 */
export declare let commonExtends: {
    result: {};
    model: {
        $allModels: {
            exists<T>(this: T, where: Prisma.Args<T, "findFirst">["where"]): Promise<any>;
            /**
             * Return the model field specifications as an object,
             * or just an array of their names
             */
            getAllFields(namesOnly?: boolean): any;
            getModelFields(namesOnly?: boolean): any;
            getRelationFields(namesOnly?: boolean): any;
            /**
             * Returns an instance or refreshed instanced based on id, or null
             * So can add include relations if missing from orig result
             * @param idOrInstance - a model instance or ID
             * @param string|string[]|GenObj include - relations to include.
             *   string or array of strings to convert into object {[relName]:true}
            */
            byId<T_1>(this: T_1, idOrInstance: any, include?: string | string[] | GenObj): Promise<any>;
            getFields(this: any): GenObj;
            getIds<T_2>(this: T_2, where?: Prisma.Args<T_2, "findMany">["where"]): Promise<Number[]>;
        };
    };
};
/**
 * Get just the tableFields of an instance, which may also contain computed fields
 * Should be moved into a chain of "extends"
 * @param model - the Prisma Model
 * @param instance - the prisma model instance
 * @param data - Optional - the data to merge
 * @return object with just the table values
 */
export declare function getMergedData(instance: any, data?: GenObj): GenObj;
/**
 * Singleton implementation of PrismaClient, with some default extensions if you want it
 * Adds some generic methods to all Models & Instances
 * Opinionated (primary keys always integers, named id)
 * Not robust - it's on you
 */
export declare function getPrisma(pextends?: GenObj): Promise<GenObj>;
/** Returns the model names known to Prisma
 *  Can be Model names or Table names
 * @param boolean key : true - return the keys or values
 * @return string[] = the model or table names
// { User: 'User', Post: 'Post', Category: 'Category' }
 * Maps model names to table names - not sure which is which...
 */
export declare function getModelNames(key?: boolean): string[];
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