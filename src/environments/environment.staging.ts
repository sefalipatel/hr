import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  envName: "staging",
  apiUrl: 'https://hrapi.skyttus.net/api/',
  redirectURL: "https://hr.skyttus.net/",
  authenticationKey: 'uiwqnksmwkobgshqjxmsjuasbtopwn',
  pythonUrl: 'https://hrcvmatch.skyttus.net/api',
  pythonFaceRecogn : 'https://hrreco.skyttus.net/',
  XAPIKey : 'f7ffVFYlYQQvpDXQlF13DzOqfDrJzHhaK9I1tXYzXP4LlgZhR5Ftw46LMhiINfcrpJMgGDrq5PNYDDz4qtlP02eZAAgTPAkX2Ei56yjOeeIydlli3nrRq3gX67iZhs5f'
};

