/**
 * SQLite implementation
 * Paul Kirkaas, March 2023
 */
import sqlite3 from 'sqlite3';
/**
   Table column specification - {[colname]:[colSpecStr]}
   example: {id: "int primary key not null", name: 'string not null'}
*/
export interface ColDef {
    [key: string]: string;
}
/**
 * Opens/creates  a sqlite file-based DB & returns it.
 * @param string|null filename
 * The absolute or relative (to invoking directory) path to the db file.
 * Creates if doesn't exist
 * Adds the `filenname` property to the db object.
 */
export declare function openDb(filename?: string): Promise<import("sqlite").Database<sqlite3.Database, sqlite3.Statement>>;
export declare function insertRow(db: any, tblName: any, row: any): Promise<void>;
export declare function getOne(db: any, tblName: any, where: string, params?: any): Promise<any>;
export declare function getAll(db: any, tblName: any, where: string, params?: any): Promise<any>;
/**
 * create table in DB if not exists - create id by default
 */
export declare function createTbl(db: any, tblName: string, colDefs: ColDef): Promise<any>;
export declare function tableExists(db: any, tblName: any): Promise<unknown>;
/** system tables */
export declare const sqlite_systables: string[];
/** Return all table names */
export declare function getSqliteTables(dbName?: string): Promise<string[]>;
export declare function emptySqliteTable(tblName: any, dbName?: string): Promise<void>;
/**
 * JUST FOR DEV - DANGEROUS!
 */
export declare function emptySqliteTables(dbName?: string): Promise<void>;
//# sourceMappingURL=sqlite-lib.d.ts.map