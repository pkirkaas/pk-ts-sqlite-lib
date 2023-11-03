/**
 * Tests for Prisma DB
 * Assumes Prisma has been initialized
 */
import { runCli, } from '../index.js';
let testsFs = {
    doesRun: function () {
        console.log("Yes, does Run!!");
    },
};
runCli(testsFs);
//# sourceMappingURL=ptest.js.map