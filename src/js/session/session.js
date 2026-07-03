import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { v4 as uuidv4 } from 'uuid';

// dev config ///////////////////////////////////////////////////////
let apiUrl = 'https://api.carladde.com/atc/v1/scores-dev';

let config = {
  cognitoDomain: 'https://us-west-1i2olrzd6b.auth.us-west-1.amazoncognito.com',
  authority: 'https://cognito-idp.us-west-1.amazonaws.com/us-west-1_I2oLrzd6B',
  client_id: '8fhopbpd0l3bjidn4infu0bcn',
  redirect_uri: 'http://localhost:8080/',
  logoutUri: 'http://localhost:8080/',
  response_type: 'code',
  scope: 'phone openid email',
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  automaticSilentRenew: true,
};

// prod config ///////////////////////////////////////////////////////
if (process.env.NODE_ENV === 'production') {
  apiUrl = 'https://api.carladde.com/atc/v1/scores-prod';

  config = {
    cognitoDomain:
      'https://ca-central-1iycqfnmja.auth.ca-central-1.amazoncognito.com',
    authority:
      'https://cognito-idp.ca-central-1.amazonaws.com/ca-central-1_iYCqfnMjA',
    client_id: '2hdcodqimttdf885i97mbmjlf',
    redirect_uri: 'https://atc.carladde.com/',
    logoutUri: 'https://atc.carladde.com/',
    response_type: 'code',
    scope: 'phone openid email',
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    automaticSilentRenew: true,
  };
}

/**
 * start AWS cognito login. when complete, redirects to homepage
 */
export const startLogin = async () => {
  localStorage.setItem('show-splash', 'no');

  const userManager = new UserManager(config);
  await userManager.signinRedirect();
};

export const isLoggedIn = async () => {
  const userManager = new UserManager(config);
  const user = await userManager.getUser();
  if (!user) {
    return false;
  }

  if (user.expired) {
    console.info('token expired - refreshing');
    const userRefresh = await userManager.signinSilent();
    if (!userRefresh) {
      console.warn('token refresh failed');
      return false;
    }
  }

  return true;
};

/**
 * AWS cognito logout. auto redirects to logoutUri
 */
export const logout = () => {
  const key = `oidc.user:${config.authority}:${config.client_id}`;
  localStorage.removeItem(key);

  signOutRedirect();
};

async function signOutRedirect() {
  localStorage.setItem('show-splash', 'no');

  const clientId = config.client_id;
  const logoutUri = config.logoutUri;
  const cognitoDomain = config.cognitoDomain;
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
    logoutUri
  )}`;
}

/**
 * check url contains post AWS cognito login redirect params
 * @param {String} url
 * @returns {Boolean} true if login was successful
 */
export const loginUsingCallbackUrl = async (url) => {
  const userManager = new UserManager(config);
  const user = await userManager.signinCallback(url).catch(() => {
    return null;
  });
  if (!user) return false;

  return true;
};

export const setUserId = (userId) => {
  if (!userId) return;
  localStorage.setItem('user-id', userId);
};

export const getUserId = () => {
  const userId = localStorage.getItem('user-id');
  if (userId) return userId;

  const userIdLogin = getUserIdFromToken();
  localStorage.setItem('user-id', userIdLogin);
  return userIdLogin;
};

export const getClientId = () => {
  const clientId = localStorage.getItem('client-id');
  if (clientId) return clientId;

  const newClientId = uuidv4();
  localStorage.setItem('client-id', newClientId);
  return newClientId;
};

export const getUsername = () => {
  const username = localStorage.getItem('username');
  if (!username) return '';
  return username;
};

export const setUsername = (str) => {
  localStorage.setItem('username', str);
};

const getOIDCtoken = () => {
  const key = `oidc.user:${config.authority}:${config.client_id}`;
  const storage = localStorage.getItem(key);
  try {
    const user = JSON.parse(storage);
    return user || '';
  } catch (err) {
    return '';
  }
};

export const getAccessToken = () => {
  const user = getOIDCtoken();
  return user?.access_token || '';
};

export const getUserIdFromToken = () => {
  const user = getOIDCtoken();
  return user?.profile?.sub || '';
};

///////////////////////////////////////////////////////////////
//  SCORES, LEADERBOARD
///////////////////////////////////////////////////////////////

export const extractSortKey = (obj) => obj['score#badges#userId'] || '';
export const getUserIdFromSortKey = (str) => {
  const arr = str.split('#', 3);
  const userId = arr[2] || '';
  return userId;
};

/**
 * @typedef {Object} LeaderBoardArr
 * @property {String} boardId
 * @property {String} 'score#badges#userId'
 * @property {String} userId
 * @property {String} clientId
 * @property {String} username
 * @property {Number} score
 * @property {Array.<String>} badges
 * @property {String} date ISO 8601 UTC
 */
/**
 * @typedef {Object} LeaderBoardKeys
 * @property {String} 'score#badges#userId'
 */
/**
 * @typedef {Object} LeaderBoardObj
 * @property {Array.<LeaderBoardArr>} arr
 * @property {Array.<LeaderBoardKeys>} keys
 */

/**
 * get list of scores for the leaderboard
 * @param {Boolean} isSkipCache skip browser cache
 * @returns {LeaderBoardObj}
 */
export const getScores = async (isSkipCache) => {
  const token = getAccessToken();
  const method = 'GET';
  let headers = { Authorization: 'Bearer ' + token };
  if (isSkipCache) {
    headers = { ...headers, 'Cache-Control': 'max-age=0' };
  }
  let obj = null;

  try {
    const resp = await fetch(apiUrl, {
      method,
      headers,
    });

    if (resp?.status !== 200) {
      console.error('GET leaderboard status:', resp?.status || 'none');
      return { arr: [], keys: [] };
    }

    obj = await resp.json();

    const leaderboardArr = obj?.arr || [];
    const leaderboardKeys = obj?.keys || [];
    localStorage.setItem('leaderboard', JSON.stringify(leaderboardArr));
    localStorage.setItem('leaderboard-keys', JSON.stringify(leaderboardKeys));
  } catch (err) {
    console.error(err);
  }

  return obj || { arr: [], keys: [] };
};

/**
 * get list of scores for the leaderboard starting at a SortKey
 * @param {String} scoreKey 'score#badges#userId'
 * @param {String} indexKey 'score#badges#userId'
 * @returns {LeaderBoardObj}
 */
export const getScoresBySortKey = async (scoreKey, indexKey) => {
  const token = getAccessToken();
  const method = 'GET';
  let headers = { Authorization: 'Bearer ' + token };
  let obj = null;

  try {
    const resp = await fetch(
      apiUrl +
        `?scoreKey=${encodeURIComponent(scoreKey)}` +
        `&indexKey=${encodeURIComponent(indexKey)}`,
      {
        method,
        headers,
      }
    );

    if (resp?.status !== 200) {
      console.error('GET leaderboard status:', resp?.status || 'none');
      return { arr: [], keys: [] };
    }

    obj = await resp.json();
  } catch (err) {
    console.error(err);
  }

  return obj || { arr: [], keys: [] };
};

/**
 * get scores across all browsers (clientId) for a user
 * @param {Boolean} isSkipCache skip browser cache
 * @param {String} userId
 * @returns {LeaderBoardObj}
 */
export const getScoresByUser = async (isSkipCache, userId) => {
  const token = getAccessToken();
  const method = 'GET';
  let headers = { Authorization: 'Bearer ' + token };
  if (isSkipCache) {
    headers = { ...headers, 'Cache-Control': 'max-age=0' };
  }
  let obj = null;

  try {
    const resp = await fetch(apiUrl + `?userId=${userId}`, {
      method,
      headers,
    });

    if (resp?.status !== 200) {
      console.error('GET leaderboard status:', resp?.status || 'none');
      return { arr: [], keys: [] };
    }

    obj = await resp.json();
  } catch (err) {
    console.error(err);
  }

  return obj || { arr: [], keys: [] };
};

/**
 * send JWTs to update table: scores
 * @param {String} historyRecordsJwt
 * @param {String} badgesJwt
 */
export const sendHistory = async (historyRecordsJwt, badgesJwt) => {
  const token = getAccessToken();
  const method = 'PUT';
  const headers = {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
  };

  const isString = (x) => typeof x === 'string';
  const history = historyRecordsJwt;
  const badges = badgesJwt;
  const clientId = getClientId() || null;
  const username = getUsername() || '';

  if (getUserId() !== getUserIdFromToken()) {
    console.warn('PUT leaderboard not sent :: mismatch local & login user-id');
    return;
  }

  if (!isString(clientId) || !isString(history) || !isString(badges)) {
    console.warn('PUT leaderboard not sent :: missing args');
    return;
  }
  let resp = null;

  try {
    const body = JSON.stringify({
      clientId,
      username,
      history,
      badges,
    });

    resp = await fetch(apiUrl, {
      method,
      headers,
      body,
    });
  } catch (err) {
    console.error(err);
    return;
  }

  if (resp?.status !== 200) {
    console.error('PUT leaderboard status:', resp?.status || 'none');
    return;
  }
};

/**
 * delete a browser item (clientId) for this user
 * @param {String} userId
 * @param {String} clientId
 * @param {Number} scoreInt - score total
 * @param {Number} badgesInt - count of badges
 */
export const deleteHistory = async (userId, clientId, scoreInt, badgesInt) => {
  const token = getAccessToken();
  const method = 'DELETE';
  const headers = {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
  };

  const isString = (x) => typeof x === 'string';
  const isNumber = (x) => typeof x === 'number';
  if (
    !isString(userId) ||
    !isString(clientId) ||
    !isNumber(scoreInt) ||
    !isNumber(badgesInt)
  ) {
    console.warn('DELETE leaderboard not sent :: missing args');
    return;
  }

  if (getUserIdFromToken() !== userId) {
    console.warn(
      'DELETE leaderboard not sent :: mismatch local & token userId'
    );
    return;
  }

  const url =
    apiUrl +
    `?userId=${userId}&clientId=${clientId}&score=${scoreInt}&badges=${badgesInt}`;

  let resp = null;
  try {
    resp = await fetch(url, {
      method,
      headers,
    });
  } catch (err) {
    console.error(err);
    return;
  }

  if (resp?.status !== 200) {
    console.error('DELETE leaderboard status:', resp?.status || 'none');
    return;
  }
};

//  END - SCORES, LEADERBOARD /////////////////////////////////////////////
