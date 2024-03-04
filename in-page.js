/**
 * Read token from localStorage
 * @returns {[number, string] | undefined}
 */
const readToken = () => {
  const storageKey = "D2L.Fetch.Tokens";
  const ls = localStorage[storageKey];
  if (!ls) return undefined;

  const obj = JSON.parse(ls);
  if (!obj) return undefined;

  const genericCredsKey = "*:*:*";
  const creds = obj[genericCredsKey];
  if (!creds) return undefined;

  const expires = creds.expires_at;
  const token = creds.access_token;

  if (!expires || !token) return undefined;
  return [expires * 1000, token];
};

/**
 * @returns {Promise<[number, string]>}
 */
const waitForToken = async () => {
  return new Promise((res, rej) => {
    /**
     *
     * @param {number} c number of times probed.
     */
    const onError = (c) => {
      if (c > 10) rej("Cannot find token");
      else setTimeout(() => checkToken(c + 1), 250);
    };

    /**
     *
     * @param {number} c number of times probed.
     */
    const checkToken = (c) => {
      const vals = readToken();
      if (!vals) return onError(c);

      const [expires, token] = vals;

      const healthyToken = new Date().getTime() < expires && token.length > 15;
      if (!healthyToken) return onError(c);
      res([expires, token]);
    };
    checkToken(0);
  });
};

waitForToken()
  .then(([expires, token]) =>
    browser.storage.sync.set({
      token: JSON.stringify([expires, token]),
    })
  )
  .catch((err) => console.error(err));
