/**
 * Enhancements for typeorm sub-package
 * Moving more towards Postgres because of more JSON functionality and Geolocation support
 */
import "reflect-metadata";
export * from '../init.js';
export * from './typeorm-lib.js';
export * from './to-entities.js';
export * from 'typeorm';
export { default as typeormlib } from './typeorm-lib.js';
//# sourceMappingURL=index.js.map