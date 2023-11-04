/**
 * Prisma support functions - but to use, need to set up prisma in the implementing app
 */
import { isObject, PkError, isSubset, strIncludesAny, isEmpty, mergeAndConcat, asEnumerable, } from './init.js';
import { Prisma, PrismaClient, } from '@prisma/client';
export let prisma = {};
/**
 * Common enhancements/extensions to prisma client, to be merged
 * with custom extensions per implementing app
 */
export let commonExtends = {
    result: {
    /*
    $allInstances: {
        model: {
            needs: {},
            compute(instance) {
                //const context = Prisma.getExtensionContext(this)
                return "Not the model";
            }
        }
    },
    user: {
        ucname: {
            needs: {},
            compute() {
                return this.name.toUpperCase();
            },
        },
        model: {
            needs: {},
            compute(user) {
                const context = Prisma.getExtensionContext(this)
                console.log(`in result/model:`, { context, user, that:this});
                return context.name;
            },
        }
    }
        */
    },
    model: {
        $allModels: {
            // Returns first matching instance, else null. Useless but code example
            async exists(where
            //): Promise<boolean> {
            ) {
                // Get the current model at runtime
                const context = Prisma.getExtensionContext(this);
                const result = context.findFirst({ where });
                //return result !== null
                return result; // Null or the instance
            },
            // Returns an instance based on id, or null
            async byId(id) {
                id = parseInt(id);
                const context = Prisma.getExtensionContext(this);
                const result = context.findFirst({ where: { id } });
                return result;
            },
            getFields() {
                const context = Prisma.getExtensionContext(this);
                let fields = asEnumerable(context.fields);
                return fields;
                /*
                let rawFields = context.fields;
                let fieldKeys = Object.getOwnPropertyNames(rawFields);
                let fields: GenObj = {};
                for (let fKey of fieldKeys) {
                    fields[fKey] = rawFields[fKey];
                }
                return fields;
                */
            },
            /*
            async getFields() {

            },
            */
            //Returns just the ids for instances - if where, matching, else all 
            async getIds(where) {
                const context = Prisma.getExtensionContext(this);
                const result = await context.findMany({ select: { id: true }, where });
                let ids = result.map((el) => el.id);
                return ids;
            }
        },
    },
};
export async function getPrisma(pextends = {}) {
    if (isEmpty(prisma)) {
        prisma = await new PrismaClient();
        let resExtensions = await addModelNameToAllResults();
        commonExtends.result = mergeAndConcat(commonExtends.result, resExtensions);
        let mExtends = mergeAndConcat(commonExtends, pextends);
        prisma = await prisma.$extends(mExtends);
    }
    return prisma;
}
/** Returns the model names known to Prisma
 *  Can be Model names or Table names
 * @param boolean key : true - return the keys or values
 * @return string[] = the model or table names
// { User: 'User', Post: 'Post', Category: 'Category' }
 * Maps model names to table names - not sure which is which...
 */
export function getModelNames(key = true) {
    let modelNames = Prisma.ModelName; //Simple object
    if (key) {
        return Object.keys(modelNames);
    }
    else {
        return Object.values(modelNames);
    }
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
    /*
    let tableMap = await getTableMap();
    let tableNames = Object.keys(tableMap);
    */
    let tableNames = getModelNames();
    if (!tables) {
        tables = tableNames;
    }
    if (!isSubset(tableNames, tables)) { //Bad table name in tables
        throw new PkError(`Invalid table name for clearTables:`, { tables, tableNames });
    }
    console.log({ tables });
    for (let table of tables) {
        console.log(`Trying to delete [${table}]`);
        try {
            //@ts-ignore
            await prisma[table].deleteMany();
        }
        catch (e) {
            console.error(`Problem emptying table: [${table}]:`, e);
        }
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
/**
 * Gotta be a better way - but adds modelName & lcModelName to all results
 * @return object to be merged to result key of $extends
 */
async function addModelNameToAllResults() {
    let modelNames = getModelNames();
    let res = {};
    for (let name of modelNames) {
        let lcName = name.toLowerCase();
        res[lcName] = {
            modelName: {
                needs: {},
                compute() {
                    return name;
                }
            },
            lcModelName: {
                needs: {},
                compute() {
                    return lcName;
                }
            },
            getModelClass: {
                needs: {},
                compute(instance) {
                    return () => prisma[lcName];
                }
            },
            /*
            modelClass: {
                needs: {},
                  compute(instance) {
                //async compute(instance) {
                    //return await prisma[lcName];
                    return prisma[lcName];
                }
            },
            */
        };
    }
    return res;
}
/*
async function addCompFieldToAllResults() {
    let modelNames = getModelNames();
    let res: GenObj = {};
    for (let name of modelNames) {
        let lcName = name.toLowerCase();
        res[lcName] = {
            modelName: {
                compute() {
                    return name;
                }
            },
            lcModelName: {
                compute() {
                    return lcName;
                }
            },
            modelClass: {
                compute(instance) {
                    return prisma[lcName];
                }
            },
        };
    }
    return res;
}
*/
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