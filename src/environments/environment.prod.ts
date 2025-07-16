import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  envName:"prod",
  apiUrl: 'https://hrapi.skyttus.in/api/',
  redirectURL:"https://hr.skyttus.in/",
  authenticationKey: 'uiwqnksmwkobgshqjxmsjuasbtopwn',
  pythonUrl: 'https://hrcvmatch.skyttus.in',
  pythonFaceRecogn : 'https://hrreco.skyttus.in/',
  XAPIKey : 'f7ffVFYlYQQvpDXQlF13DzOqfDrJzHhaK9I1tXYzXP4LlgZhR5Ftw46LMhiINfcrpJMgGDrq5PNYDDz4qtlP02eZAAgTPAkX2Ei56yjOeeIydlli3nrRq3gX67iZhs5f'
};
