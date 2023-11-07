/**
 * Tests for Prisma DB
 * Assumes Prisma has been initialized
 */
import { dbgWrt, runCli, getPrisma, allProps, getProps, asEnumerable, } from '../index.js';
let prisma = await getPrisma();
import { typeOf } from 'pk-ts-common-lib';
let testsFs = {
    async tstAs() {
        console.log('Even async tstAs?');
    },
    tstKey() {
        console.log("Yes, tstKey works Run!!");
    },
    doesRun: function () {
        console.log("Yes, does Run!!");
    },
    tstDMMF: async function () {
        let pmx = await getPrisma();
        let dmmf = asEnumerable(pmx);
        //let pmxProps = allProps(pmx, 'tpv', 4);
        //let fields = asEnumerable(pmx.user.fields);
        dbgWrt(dmmf);
        //console.log({ pmxProps });
        console.log("Done");
    },
    tstClient: async function () {
        let pmx = await getPrisma();
        let pmxProps = allProps(pmx, 'tpv', 4);
        let fields = asEnumerable(pmx.user.fields);
        dbgWrt(pmxProps);
        //console.log({ pmxProps });
        console.log("Done", { fields });
    },
    tstFields: async function () {
        //let pmx = await getPrisma();
        let uModel = await prisma.user;
        let pModel = await prisma.post;
        let uFields = uModel.getFields();
        let pFields = pModel.getFields();
        console.log({ uFields, pFields });
    },
    async tstUsr() {
        let user = await prisma.user.findFirst();
        user.name = "Koala Days";
        // @ts-ignore
        // @ts-ignore
        let u2 = await user.save({ email: 'BBBZZZ@butts.com' });
        //let u3 = await u2.connect('posts', 61 );
        //let u3 = await u2.set('posts', 41 );
        let u3 = await u2.disconnect('posts', 41);
        //let u3 = await u2.addRelationship('posts',  61 );
        //let u4 = await u3.addRelationship('posts',  41 );
        //await u3.addRelationship('posts',  99 );
        /*
        let weird = user.tstArg("Some weird String");
        //let ids = await prisma.user.getIds('anarg');
        //let where = { name: 'Trevion' };
        let where = { pwd: 'tstpwd',};
        let ids = await prisma.user.getIds(where);
        //let u2 = await user.save();
        let u2 = await user.save;
        let u3 = await u2.xsave;
        */
        //let refresh = await prisma.user.byId(user, 'posts');
        let refresh = await prisma.user.byId(user);
        //console.log({ user, u2, u3, ids, weird, refresh });
        console.log({ user, refresh, });
    },
    tstUsrsOld: async function () {
        let pmx = await getPrisma();
        let uModel = await prisma.user;
        //let UMProps = allProps(uModel,'tv',2);
        //let UMProps = uModel.name;
        //let UMProps = allProps(uModel,'tpv',2);
        let UMProps = allProps(uModel, 'tpv', 1);
        //let uFields = await uModel.fields;
        // @ts-ignore
        //let uFields = pmx.DMMF;
        //let uFields = uModel['fields'];
        let uFields = uModel.fields;
        let uFieldProps = allProps(uFields, 'tpv', 2);
        let uFieldReal = allProps(uFields, 'v', 1);
        let uFieldGet = getProps(uFields);
        let uFieldKeys = Object.getOwnPropertyNames(uFields);
        let fieldsObj = {};
        for (let fKey of uFieldKeys) {
            fieldsObj[fKey] = uFields[fKey];
        }
        //let uFields = await pmx.introspection; //.modelFields[uModel.name];
        //let uFields =  pmx._dmmf.modelFields[uModel.name];
        //let PrismaProps = allProps(Prisma,'tpv',1);
        //let ModelName = Prisma.ModelName;
        //let pmxProps = allProps(pmx,'tpv',3);
        //	let 
        //let PCProps = getProps(pmx);
        //let UMPropsT = allPropsWithTypes(uModel);
        let toUM = typeOf(uModel);
        let user = await prisma.user.findFirst({
            include: { posts: false }
        });
        //let toUsr = typeOf(user);
        //let MCfromUsr = await user.getModelClass();
        //dbgWrt(pmxProps);
        dbgWrt(fieldsObj);
        console.log({
            user,
            uFieldReal,
            uFieldGet,
            uFieldKeys,
            fieldsObj,
            //MCfromUsr,
            //toUsr,
            //toUM,
            //	UMProps,
            //		uFields,
            //		uFieldProps,
            //PrismaProps,
            //PCProps,
            //	pmxProps,
            //ModelName,
            //UMPropsT,
        });
    }
};
runCli(testsFs);
//# sourceMappingURL=ptest.js.map