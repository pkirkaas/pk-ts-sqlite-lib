/** 
 * Provides some additional Faker functionality for db test seeding.
 */
export * from './references/index.js';

import { UsCitiesZipObj,
 } from './references/UsZips.js';

 import { faker } from '@faker-js/faker';
 import _ from 'lodash';

 import { formatISO, isValid, add } from "date-fns";
  import { format, } from "date-fns/format";

 import {
  JSON5Stringify,  typeOf, getRandEls, haversine, GenObj, isObject, isSimpleObject, isNumeric, asNumeric, PkError, pkToDate, randInt,
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
   * Returns a date offset relative to Now
   * @param offset GenObj|number - 
   *    Obj  - { years, months, weeks, days, hours, minutes, seconds}
   *    number - days offset - positive in future, negative past.
   * @param from?: Dateable or null - date to apply offest to - if empty, now.: 
   */
  offsetDate(offset:GenObj|number, from:any = null) {
    let opts:any;
    if (isSimpleObject(offset)) {
      opts = offset;
    } else if (isNumeric(offset)) {
      opts = {days:asNumeric(offset)};
    } else {
      throw new PkError(`invalid arg to offsetDate:`, {offset})
    }
    let reldate:any =  new Date();

    if (from) {
      reldate = pkToDate(from);
      if (!reldate) {
        throw new PkError(`invalid 'from' argument to offsetDate`, {from});
      }
    }
    let retDate = add(reldate,opts);
    return retDate;
  },


 }