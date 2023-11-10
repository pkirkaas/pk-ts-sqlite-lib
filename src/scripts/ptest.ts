/**
 * Tests for Prisma DB
 * Assumes Prisma has been initialized
 */

import { Prisma, PrismaClient, } from '@prisma/client';
import {
	getFilePaths, slashPath, dbgWrt, ask, runCli, sassMapStringToJson, sassMapStringToObj, saveData, isFile, getOsType, isWindows, isLinux, runCommand, stdOut, winBashes, getSchema,
	getPrisma, allProps, allPropsWithTypes, getProps, asEnumerable,
} from '../index.js';

let prisma = await getPrisma();

import _ from 'lodash';

import { mergeAndConcat, isEmpty, typeOf } from 'pk-ts-common-lib';

let testsFs = {

	async tstSchema() {
		await getPrisma();
		let schema =  getSchema();
		dbgWrt(schema);
		console.log({ schema });
	},

	tstRels: async  function() {
		let pmx = await getPrisma();
		let a = 'b';
		/*
		let aclient = asEnumerable(prisma, 8);
		*/
		let schema = prisma.schema;
		//let intr = await prisma.introspect();
		let aePrisma = asEnumerable(Prisma,9);
		let aeClient = asEnumerable(pmx);
		
		//dbgWrt(aclient);
		//dbgWrt(aePrisma);
		dbgWrt(aeClient);
		//console.log({ aclient});
		console.log({
			aePrisma,
			//Prisma,
		}, `Bye!`);
		
},
	async tstAs() {
		console.log('Even async tstAs?');
	},
	getPstFields: async function() {
		let pfields = prisma.post.getFields();
		console.log({ pfields });
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
		let uModel = await  prisma.user;
		let pModel = await  prisma.post;
		let uFields = uModel.getFields();
		let pFields = pModel.getFields();
		console.log({ uFields, pFields });
	},
	async tstJson() {
		let pendingUser =  prisma.User.findFirst();

		let puProps = allProps(pendingUser, 'tpv', 6);
		dbgWrt(puProps, 'puProps');
		let puAe = asEnumerable(pendingUser);
		let toPU = typeOf(pendingUser);
		 
		let user = await prisma.User.findFirst();
		let pUser = user.parsed();
		//let userJson = JSON.stringify(user);
		console.log({
			user,
			pUser,
			toPU,
			pendingUser,
			puAe,
			//userJson
		});
	},
	async tstManyParsed() {
		let posts = await prisma.post.findManyParsed();
		console.log({ posts });
	},
	async tstParsed() {
		let user = await prisma.user.findFirst({ include: { posts: true } });
		console.log({ user });

		let u2 = await user.parsed();
		u2.tstDataJSON['god'] = "Machine";
		await u2.save();

		console.log({ u2 });
	},
	async tstUsr() {
		//let user = { well: "Another fine mess..." };
		let user = await prisma.user.findFirst();
		//let usrModel = asEnumerable(prisma.user,2);
		//let usrModel = prisma.user;
		let usrModel = user.getModelClass();
		let allFields = usrModel.getAllFields(true);
		let data = { name: "Johnny", email: "J@b.com", pwd: "Nope" };
		let newUser = await usrModel.create({ data });
		//dbgWrt(usrModel);
		console.log({  allFields});
		//console.log({ usrModel });
		/*
		user.name = "Koala Nights";
		let u2 = await user.save({ email: 'BBBZZZ@butts.com' });
		await u2.connect('posts', 44 );
		await u2.connect('posts', 37 );
		u2.pwd = 'abcakbc';
		*/
		//let u3 = await u2.set('posts', [41, 61] );
		//let u3 = await u2.disconnect('posts', 41 );
		//let u3 = await u2.addRelationship('posts',  61 );
		//let u4 = await u3.addRelationship('posts',  41 );
		/*
		//let ids = await prisma.user.getIds('anarg');
		//let where = { name: 'Trevion' };
		//let u2 = await user.save();
		let u2 = await user.save;
		let u3 = await u2.xsave;
		*/
		//let refresh = await prisma.user.byId(user, 'posts');
		//let refresh = await prisma.user.byId(user);

		//console.log({ user, u2, u3, ids, weird, refresh });
//		console.log({ user, refresh, });
	},
	tstUsrsOld: async function () {
		let pmx = await getPrisma();
		let uModel = await  prisma.user;
		//let UMProps = allProps(uModel,'tv',2);
		//let UMProps = uModel.name;
		//let UMProps = allProps(uModel,'tpv',2);
		let UMProps = allProps(uModel,'tpv',1);

		//let uFields = await uModel.fields;
		// @ts-ignore
		//let uFields = pmx.DMMF;
		//let uFields = uModel['fields'];
		let uFields = uModel.fields;
		let uFieldProps = allProps(uFields, 'tpv', 2);
		let uFieldReal = allProps(uFields, 'v', 1);
		let uFieldGet = getProps(uFields);
		let uFieldKeys = Object.getOwnPropertyNames(uFields);
		let fieldsObj: any = {};
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