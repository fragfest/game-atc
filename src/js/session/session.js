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

/**
 * @typedef {Object} LeaderBoard
 * @property {String} userId
 * @property {String} username
 * @property {Number} score
 */

/**
 * get list of scores for the leaderboard
 * @param {Boolean} isSkipCache skip browser cache
 * @returns {Array.<LeaderBoard>}
 */
export const getAllScores = async (isSkipCache) => {
  const token = getAccessToken();
  const method = 'GET';
  let headers = { Authorization: 'Bearer ' + token };
  if (isSkipCache) {
    headers = { ...headers, 'Cache-Control': 'max-age=0' };
  }

  const resp = await fetch('https://api.carladde.com/default/basic', {
    method,
    headers,
  });

  if (resp.status !== 200) {
    console.error('GET leaderboard status:', resp.status);
    return [];
  }

  const leaderboardArr = await resp.json();
  return leaderboardArr;
};

export const sendHistory = async (historyEncryptedStr) => {
  const token = getAccessToken();
  const method = 'PUT';
  const headers = {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
  };

  const body = historyEncryptedStr || '';

  const resp = await fetch('https://api.carladde.com/default/basic', {
    method,
    headers,
    body,
  });

  if (resp.status !== 200) {
    console.error('PUT leaderboard status:', resp.status);
    return;
  }
};
