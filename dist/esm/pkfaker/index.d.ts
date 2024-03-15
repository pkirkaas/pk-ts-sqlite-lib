/**
 * Provides some additional Faker functionality for db test seeding.
 */
export * from './references/index.js';
import { GenObj } from 'pk-ts-node-lib';
export declare function zipsOfState(state: string | null): {};
export declare const pkfaker: {
    /**
     * Returns a random US ZIP obj w zip, city, state, lat, lon
     * @param state?:string - Only from state (def CA) - if null, all US
     */
    randUsZip(state?: any): any;
    /**
     * Returns a date offset relative to Now or from
     * @param offset GenObj|number -
     *    Obj  - { years, months, weeks, days, hours, minutes, seconds}
     *    number - days offset - positive in future, negative past.
     * @param from?: Dateable or null - date to apply offest to - if empty, now.:
     */
    offsetDate(offset: GenObj | number, from?: any): any;
    /**
     * Like faker.between, just way better
     * Returns a rand date in range, optionally offset to future or past
     * @param from:Date|pkToDate - any pkToDate value
     * @param to -  any pkToDate value or null for now
     * @param offset - as for offsetDate above
     */
    between(from: any, to?: any, offset?: any): Date;
};
//# sourceMappingURL=index.d.ts.map