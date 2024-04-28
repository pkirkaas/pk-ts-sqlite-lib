/** 
 * Provides some additional Faker functionality for db test seeding.
 */
export * from './references/index.js';

import { UsCitiesZipObj,
 } from './references/UsZips.js';

 import { faker } from '@faker-js/faker';
 import _ from 'lodash';

 import { formatISO, isValid, add, isBefore, } from "date-fns";
  import { format, } from "date-fns/format";

 import {
  JSON5Stringify,  typeOf, getRandEls, haversine, GenObj, isObject, isSimpleObject, isNumeric, asNumeric, PkError, pkToDate, randInt, validateDateFnsDuration, 
 } from 'pk-ts-node-lib';
 ;

 export function zipsOfState(state:string|null) {
   if (!state) {
    return UsCitiesZipObj;
   }
   let retObj:GenObj = {};
   for (let key in UsCitiesZipObj) { 
    let val = UsCitiesZipObj[key];
    if (val.state === state) {
      retObj[key] = val;
    }
   }
   return retObj;

 }

 export const pkfaker = {
  /**
   * Returns a random US ZIP obj w zip, city, state, lat, lon 
   * @param state?:string - Only from state (def CA) - if null, all US 
   */
  randUsZip(state:any = 'CA') {
     let stateZips = zipsOfState(state);
     let randZip = getRandEls(stateZips);
     return randZip;
  },

  /**
   * Returns a specific zip row for zip
   * @param zip 
   */
  getZipRow(zip:string) {
    return UsCitiesZipObj[zip];
  },

  /**
   * Returns a date offset relative to Now or from
   * @param offset GenObj|number - 
   *    Obj  - { years, months, weeks, days, hours, minutes, seconds}
   *    number - days offset - positive in future, negative past.
   * @param from?: Dateable or null - date to apply offest to - if empty, now.: 
   */
  offsetDate(offset:GenObj|number, from:any = null) {
    let opts:any;
    if (validateDateFnsDuration(offset)) {
    //if (isSimpleObject(offset)) {
      opts = offset;
    } else if (isNumeric(offset)) {
      opts = {days:asNumeric(offset)};
    } else {
      throw new PkError(`invalid arg to offsetDate:`, {offset})
    }
    //let reldate:any =  new Date();
    let reldate:any =  pkToDate(from); //new Date();
    if (!reldate) {
      throw new PkError(`invalid 'from' argument to offsetDate`, {from});
    }
    let retDate = add(reldate,opts);
    return retDate;
  },

  /**
   * Like faker.between, just way better
   * Returns a rand date in range, optionally offset to future or past 
   * @param from:Date|pkToDate - any pkToDate value
   * @param to -  any pkToDate value or null for now
   * @param offset - as for offsetDate above
   * 
   * Examples:
   * let tstDts = {
   *   tstPkToDate: pkToDate({days:-randInt(9)}),
   *   tstBetween:  pkfaker.between(null, {days:20}, {days:-90 }), 
   * };
   */
  between(from:any, to:any=null, offset:any=null) {
    let dFrom :Date|Boolean= pkToDate(from);
    let dTo:Date|Boolean = pkToDate(to);
    if (!dTo || !dFrom) {
      throw new PkError (`invalid arg to between:`, {from, to});
    }
    // So dumb of faker!!
    //@ts-ignore
    if (isBefore(dTo, dFrom)) {
      let tmp = dFrom;
      dFrom = dTo;
      dTo = tmp;
    }
    if (offset) {
      dFrom = this.offsetDate(offset, dFrom);
      dTo = this.offsetDate(offset, dTo);
    }
    //@ts-ignore
    return faker.date.between({from:dFrom, to:dTo});
  },


 }