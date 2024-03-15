/**
 * Returns US Zip Codes with city, state, lat, lon in various forms
 * export const UsCities as array of arrays - ZIPS ARE INTEGERS!
 * export const UsCitiesKeyed - array of objects with keys "zip" (As appropriate string), state, city, lat, lon
 * export const UsCitiesZipObj = as above, but as object keyed with "zip"
 * export function zipArrToObj(zipArr) - creates the object above, but can take any countries array of zips
 *
 */
export function zipArrToObj(zipArr: any): {};
export const UsCities: (string | number)[][];
export const UsCitiesKeyed: {
    zip: string;
    state: string | number;
    city: string | number;
    lat: string | number;
    lon: string | number;
}[];
export const UsCitiesZipObj: {};
//# sourceMappingURL=UsZips.d.ts.map