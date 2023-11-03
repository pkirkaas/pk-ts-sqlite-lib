/**
 * Tests for Prisma DB
 * Assumes Prisma has been initialized
 */

import {
	getFilePaths, slashPath, dbgWrt, ask, runCli, sassMapStringToJson, sassMapStringToObj, saveData, isFile, getOsType, isWindows, isLinux, runCommand, stdOut, winBashes,
} from '../index.js';

import _ from 'lodash';

import { mergeAndConcat, isEmpty, typeOf } from 'pk-ts-common-lib';

let testsFs = {
	doesRun: function () {
		console.log("Yes, does Run!!");
	},
};




runCli(testsFs);