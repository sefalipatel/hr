import packageInfo from '../../package.json';

export const environment = {
    appVersion: packageInfo.version,
    production: false,
    envName: "development",
    apiUrl: 'https://hrtestapi.skyttus.in/api',
    url: "https://hrtest.skyttus.in/",
    redirectURL: "http://localhost:4200/",
    authenticationKey: 'uiwqnksmwkobgshqjxmsjuasbtopwn',
    pythonUrl: 'http://23.226.124.151:8091/api'

};
