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
 */
export declare function openDb(filename?: string): Promise<import("sqlite").Database<sqlite3.Database, sqlite3.Statement>>;
/**
 * create table in DB if not exists - create id by default
 */
export declare function createTbl(db: any, tblName: string, colDefs: ColDef): Promise<any>;
export declare function tableExists(db: any, tblName: any): Promise<unknown>;
//# sourceMappingURL=db-lib.d.ts.map