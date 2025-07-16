// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  envName: "local",
  // apiUrl: 'https://localhost:7226/api/',
  apiUrl: 'https://hrapi.skyttus.net/api/',
  url: "https://hrapi.skyttus.net",
  redirectURL: "http://localhost:4200/",
  authenticationKey: 'uiwqnksmwkobgshqjxmsjuasbtopwn',
  pythonUrl: 'https://hrcvmatch.skyttus.net/api',
  pythonFaceRecogn : 'https://hrreco.skyttus.net/',
  XAPIKey : 'f7ffVFYlYQQvpDXQlF13DzOqfDrJzHhaK9I1tXYzXP4LlgZhR5Ftw46LMhiINfcrpJMgGDrq5PNYDDz4qtlP02eZAAgTPAkX2Ei56yjOeeIydlli3nrRq3gX67iZhs5f'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
