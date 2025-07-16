import packageInfo from '../../package.json';

export const environment = {
    appVersion: packageInfo.version,
    production: true,
    envName: "dev",
    apiUrl: 'https://hrapi.skyttus.in/api',
    redirectURL: "https://hr.skyttus.in/",
    authenticationKey: 'uiwqnksmwkobgshqjxmsjuasbtopwn',
    pythonUrl: 'http://23.226.124.151:8091/api'

};
