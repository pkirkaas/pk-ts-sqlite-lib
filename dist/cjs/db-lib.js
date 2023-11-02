"use strict";
/**
 * SQLite implementation
 * Paul Kirkaas, March 2023
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableExists = exports.createTbl = exports.openDb = void 0;
const index_js_1 = require("./index.js");
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
sqlite3_1.default.verbose();
;
// you would have to import / invoke this in another file
//export async function openDb (filename ='./tmp/sqlite-tst.db' ) {
/**
 * Opens/creates  a sqlite file-based DB & returns it.
 * @param string|null filename
 * The absolute or relative (to invoking directory) path to the db file.
 * Creates if doesn't exist
 */
async function openDb(filename) {
    if (!filename) {
        filename = process.env.SQLITE_DB;
    }
    if (!filename) {
        throw new index_js_1.PkError(`No fileName found in openDb`);
    }
    if ((filename !== ':memory') && !path_1.default.isAbsolute(filename)) {
        filename = (0, index_js_1.slashPath)(process.cwd(), filename);
    }
    console.log(`About to open [${filename}]`);
    return (0, sqlite_1.open)({
        filename,
        driver: sqlite3_1.default.Database
    });
}
exports.openDb = openDb;
/**
 * create table in DB if not exists - create id by default
 */
async function createTbl(db, tblName, colDefs) {
    if (!('id' in colDefs)) {
        //colDefs.id = "int primary key not null AUTOINCREMENT";
        colDefs.id = "INTEGER PRIMARY KEY AUTOINCREMENT";
    }
    let colDefArr = Object.entries(colDefs).map((entry) => {
        return entry.join(' ');
    });
    /*
    let colDefArr = colDefs.map((colDef) => {
        return Object.entries(colDef).join(' ');
    });
    */
    let colDefStr = colDefArr.join(', ');
    let cstr = `CREATE TABLE IF NOT EXISTS '${tblName}' (${colDefStr});`;
    console.log({ cstr });
    return db.exec(cstr);
}
exports.createTbl = createTbl;
async function tableExists(db, tblName) {
    let teStr = ` SELECT EXISTS ( SELECT 'name' FROM 'sqlite_schema' WHERE 
        type='table' AND name='${tblName}'
    );`;
    let row = await db.get(teStr);
    if (!row || (0, index_js_1.isEmpty)(row) || !(0, index_js_1.isObject)(row)) {
        return false;
    }
    let vals = Object.values(row);
    if (!Array.isArray(vals) || !vals.length) {
        return false;
    }
    return vals[0];
}
exports.tableExists = tableExists;
//# sourceMappingURL=db-lib.js.map