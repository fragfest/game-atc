import { default as dayjs } from 'dayjs';
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { v4 as uuidv4 } from 'uuid';

// dev config ///////////////////////////////////////////////////////
let apiUrl = 'https://api.carladde.com/dev/atc-dev';

let config = {
  authority: 'https://cognito-idp.us-west-1.amazonaws.com/us-west-1_I2oLrzd6B',
  client_id: '8fhopbpd0l3bjidn4infu0bcn',
  redirect_uri: 'http://localhost:8080/',
  response_type: 'code',
  scope: 'phone openid email',
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

// prod config ///////////////////////////////////////////////////////

if (process.env.NODE_ENV === 'production') {
  apiUrl = 'https://api.carladde.com/prod/atc';

  config = {
    authority:
      'https://cognito-idp.ca-central-1.amazonaws.com/ca-central-1_iYCqfnMjA',
    client_id: '2hdcodqimttdf885i97mbmjlf',
    redirect_uri: 'https://atc.carladde.com/',
    response_type: 'code',
    scope: 'phone openid email',
  };
}

/**
 * start AWS cognito login. when complete, redirects to homepage
 */
export const startLogin = async () => {
  const userManager = new UserManager({
    ...config,
  });
  await userManager.signinRedirect();
};

export const isLoggedIn = () => {
  const key = `oidc.user:${config.authority}:${config.client_id}`;
  const storage = localStorage.getItem(key);
  if (!storage) return false;

  const session = JSON.parse(storage);
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
  localStorage.removeItem(key);
};

// async function signOutRedirect() {
//   const clientId = '8fhopbpd0l3bjidn4infu0bcn';
//   const logoutUri = 'http://localhost:8080/';
//   const cognitoDomain =
//     'https://us-west-1i2olrzd6b.auth.us-west-1.amazoncognito.com';
//   window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
//     logoutUri
//   )}`;
// }

export const loginUsingCallbackUrl = async (url) => {
  const userManager = new UserManager(config);
  const session = await userManager.signinCallback(url).catch(() => {
    return null;
  });
  if (!session) return false;

  return true;
};

export const getUserId = () => {
  const key = `oidc.user:${config.authority}:${config.client_id}`;
  const storage = localStorage.getItem(key);
  if (!storage) return '';

  const session = JSON.parse(storage);
  return session.profile.sub;
};

export const getClientId = () => {
  const clientId = localStorage.getItem('client-id');
  if (clientId) return clientId;

  const newClientId = uuidv4();
  localStorage.setItem('client-id', newClientId);
  return newClientId;
};

export const getUsername = () => {
  const key = `oidc.user:${config.authority}:${config.client_id}`;
  const storage = localStorage.getItem(key);
  if (!storage) return '';

  const session = JSON.parse(storage);
  return session.profile['cognito:username'];
};

export const getAccessToken = () => {
  const key = `oidc.user:${config.authority}:${config.client_id}`;
  const storage = localStorage.getItem(key);
  if (!storage) return '';

  const session = JSON.parse(storage);
  return session.access_token;
};

/**
 * @typedef {Object} LeaderBoard
 * @property {String} userId
 * @property {String} clientId
 * @property {String} username
 * @property {Number} score
 * @property {Array.<String>} badges
 * @property {String} date ISO 8601 UTC
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

  const resp = await fetch(apiUrl, {
    method,
    headers,
  });

  if (resp.status !== 200) {
    console.error('GET leaderboard status:', resp.status);
    return [];
  }

  const leaderboardArr = await resp.json();
  localStorage.setItem('leaderboard', JSON.stringify(leaderboardArr));
  return leaderboardArr;
};

/**
 * get scores across all browsers (clientId) for a user
 * @param {Boolean} isSkipCache skip browser cache
 * @param {String} userId
 * @returns {Array.<LeaderBoard>}
 */
export const getScoresByUser = async (isSkipCache, userId) => {
  const token = getAccessToken();
  const method = 'GET';
  let headers = { Authorization: 'Bearer ' + token };
  if (isSkipCache) {
    headers = { ...headers, 'Cache-Control': 'max-age=0' };
  }

  const resp = await fetch(apiUrl + `?userId=${userId}`, {
    method,
    headers,
  });

  if (resp.status !== 200) {
    console.error('GET leaderboard status:', resp.status);
    return [];
  }

  const leaderboardArr = await resp.json();
  localStorage.setItem('leaderboard', JSON.stringify(leaderboardArr));
  return leaderboardArr;
};

/**
 * send JWTs to update table: scores
 * @param {String} clientId
 * @param {String} historyRecordsJwt
 * @param {String} badgesJwt
 */
export const sendHistory = async (clientId, historyRecordsJwt, badgesJwt) => {
  const token = getAccessToken();
  const method = 'PUT';
  const headers = {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
  };

  const isString = (x) => typeof x === 'string';
  const history = historyRecordsJwt;
  const badges = badgesJwt;

  if (!isString(clientId) || !isString(history) || !isString(badges)) {
    console.warn('PUT leaderboard not sent');
    return;
  }

  const body = JSON.stringify({
    clientId,
    history,
    badges,
  });

  const resp = await fetch(apiUrl, {
    method,
    headers,
    body,
  });

  if (resp.status !== 200) {
    console.error('PUT leaderboard status:', resp.status);
    return;
  }
};

/**
 * delete a browser item (clientId) for this user
 * @param {String} clientId
 */
export const deleteHistory = async (clientId) => {
  const token = getAccessToken();
  const method = 'DELETE';
  const headers = {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
  };

  const isString = (x) => typeof x === 'string';
  if (!isString(clientId)) {
    console.warn('DELETE leaderboard not sent');
    return;
  }

  const body = JSON.stringify({
    clientId,
  });
  const resp = await fetch(apiUrl + `?clientId=${clientId}`, {
    method,
    headers,
    body,
  });

  if (resp.status !== 200) {
    console.error('DELETE leaderboard status:', resp.status);
    return;
  }
};
