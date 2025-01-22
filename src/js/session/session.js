import { default as dayjs } from 'dayjs';
import { UserManager } from 'oidc-client-ts';

const config = {
  authority: 'https://cognito-idp.us-west-1.amazonaws.com/us-west-1_I2oLrzd6B',
  client_id: '8fhopbpd0l3bjidn4infu0bcn',
  redirect_uri: 'http://localhost:8080/',
  response_type: 'code',
  scope: 'phone openid email',
};

export const isLoggedIn = () => {
  const key = `oidc.user:${config.authority}:${config.client_id}`;
  const sessionStr = sessionStorage.getItem(key);
  if (!sessionStr) return false;

  const session = JSON.parse(sessionStr);
  const expiryEpochSecs = session['expires_at'];
  const expiryTime = dayjs.unix(expiryEpochSecs);
  const now = dayjs();

  if (now.isAfter(expiryTime)) {
    console.warn('token expired');
    return false;
  }

  return true;
};

export const logout = () => {
  const key = `oidc.user:${config.authority}:${config.client_id}`;
  sessionStorage.removeItem(key);
};

export const loginUsingCallbackUrl = async (url) => {
  const userManager = new UserManager(config);
  const session = await userManager.signinCallback(url).catch(() => {
    return null;
  });
  if (!session) return false;

  const username = session.profile['cognito:username'];
  console.info('login callback success', username);
  return true;
};

export const getUsername = () => {
  const key = `oidc.user:${config.authority}:${config.client_id}`;
  const sessionStr = sessionStorage.getItem(key);
  if (!sessionStr) return '';

  const session = JSON.parse(sessionStr);
  return session.profile['cognito:username'];
};

export const getAccessToken = () => {
  const key = `oidc.user:${config.authority}:${config.client_id}`;
  const sessionStr = sessionStorage.getItem(key);
  if (!sessionStr) return '';

  const session = JSON.parse(sessionStr);
  return session.access_token;
};
