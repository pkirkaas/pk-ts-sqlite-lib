/**
 * Prisma support functions - but to use, need to set up prisma in the implementing app
 */
import { isObject, PkError, isSubset, strIncludesAny, isEmpty, } from './init.js';
import { PrismaClient, } from '@prisma/client';
export let prisma = {};
export async function getPrisma(pextends) {
    if (isEmpty(prisma)) {
        prisma = await new PrismaClient();
        if (!isEmpty(pextends)) {
            prisma = await prisma.$extends(pextends);
        }
    }
    return prisma;
}
export async function getModelIds(modelName) {
    //@ts-ignore
    let info = await prisma[modelName].findMany({ select: { id: true } });
    let ids = info.map((el) => el.id);
    //let info = await prisma.customer.findMany();
    return ids;
}
/**
 * Empty tables
 * @param string|array|null tables:
 *   table name, array of table names, or empty for all
 */
export async function clearTables(tables) {
    if (tables && !Array.isArray(tables)) {
        tables = [tables];
    }
    let tableMap = await getTableMap();
    let tableNames = Object.keys(tableMap);
    if (!tables) {
        tables = tableNames;
    }
    if (!isSubset(tableNames, tables)) { //Bad table name in tables
        throw new PkError(`Invalid table name for clearTables:`, { tables, tableNames });
    }
    console.log({ tables });
    for (let table of tables) {
        console.log(`Trying to delete [${table}]`);
        //@ts-ignore
        await prisma[table].deleteMany();
    }
}
export async function addRelated(from, to) {
    let fromName = from.model;
    let toName = to.model;
    let toNameId = toName + 'Id';
    let updateQuery = {
        where: { id: from.id },
        data: {
            [toNameId]: to.id,
        }
    };
    let updateQuery2 = {
        where: { id: from.id },
        data: {
            [toName]: {
                connect: [{ id: to.id }],
            }
        }
    };
    console.log(`Executing update query on [${fromName}]:`, { updateQuery });
    //@ts-ignore
    let res = await prisma[fromName].update(updateQuery);
    return res;
}
// Kind of caching of table map...
export let tableMap = {};
/**
 * Gets table/field defs from the DB - for mapping JSON data to strings
 */
export async function getTableMap() {
    if (isEmpty(tableMap)) {
        let systbles = ['sqlite_sequence', '_prisma_migrations',];
        let nonFields = ['CONSTRAINT', 'CREATE'];
        let schme = await prisma.$queryRawUnsafe('SELECT * FROM sqlite_schema');
        let tables = {};
        for (let ent of schme) {
            if ((ent.type !== 'table') || systbles.includes(ent.name)) {
                continue;
            }
            let sql = ent.sql;
            let sqlArr = sql.split('\n');
            let fieldMap = {};
            for (let fieldDef of sqlArr) {
                if (strIncludesAny(fieldDef, nonFields) || (fieldDef === ')')) {
                    continue;
                }
                let fieldDefArr = fieldDef.trim().split(' ');
                let name = fieldDefArr[0].replaceAll('"', '');
                let baseName = name;
                let type = fieldDefArr[1];
                if (name.includes('JSON')) {
                    type = 'JSON';
                    baseName = name.replace('JSON', '');
                }
                fieldMap[name] = { name, type, baseName };
            }
            tables[ent.name] = fieldMap;
        }
        tableMap = tables;
    }
    return tableMap;
}
;
/**
 * Get a model instance by id.
 * @param include - optional - string, array or object for complex includes
 */
export async function getById(model, id, include = null) {
    id = parseInt(id);
    let query = { where: { id } };
    let origInclude = include;
    console.log("Entery getById - include:", { include });
    if (include) {
        id = parseInt(id);
        if (typeof include === 'string') {
            include = [include];
        }
        if (Array.isArray(include)) {
            let includeArr = include;
            include = {};
            for (let key of includeArr) {
                include[key] = true;
            }
        }
        if (!isObject(include)) {
            throw new PkError(`in getById - invalid arg for 'include':`, { origInclude, include });
        }
        if (!('include' in include)) {
            include = { include };
        }
        query.include = include.include;
    }
    console.log('Debugging getById include:', { include, query });
    //@ts-ignore
    return await prisma[model].findUnique(query);
}
//# sourceMappingURL=prisma-lib.js.map