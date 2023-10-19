/**
 * SQLite implementation for Signifly Case Assignment for Paul Kirkaas
 * Paul Kirkaas, March 2023
 */
/// <reference types="./vendor-typings/sqlite3" resolution-mode="require"/>
import sqlite3 from 'sqlite3';
/**
   Table column specification - {[colname]:[colSpecStr]}
   example: {id: "int primary key not null", name: 'string not null'}
*/
export interface ColDef {
    [key: string]: string;
}
export declare function openDb(filename?: string): Promise<import("sqlite").Database<sqlite3.Database, sqlite3.Statement>>;
/**
 * create table in DB if not exists - create id by default
 */
export declare function createTbl(db: any, tblName: string, colDefs: ColDef): Promise<any>;
export declare function tableExists(db: any, tblName: any): Promise<unknown>;
//# sourceMappingURL=db-lib.d.ts.map