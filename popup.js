// const LPVersion = "1.9";
// const LEVersion = "1.74";
// const course = "621196";
// const whoami = `/d2l/api/lp/${LPVersion}/users/whoami`;
// const quizzes = `/d2l/api/le/${LEVersion}/${course}/dropbox/folders/`;
// const host =
//   "https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com";

// const doRequests = (token) => {
//   const p = document.getElementById("ID");
//   (async () => {
//     const resp = await fetch(host + quizzes, {
//       headers: {
//         Authorization: "Bearer " + token,
//       },
//     });
//     const data = await resp.json();
//     const other = data
//       //   .filter((f) => f.TotalUsersWithSubmissions != f.TotalUsersWithFeedback)
//       .map((f) => ({
//         name: f.Name,
//         Grade: f.TotalUsersWithSubmissions - f.TotalUsersWithFeedback,
//       }));
//     p.innerText = JSON.stringify(other.map((o) => o.name));
//   })();
// };

// document.addEventListener("DOMContentLoaded", () => {
//   const p = document.getElementById("ID");
//   setTimeout(() => {
//     browser.storage.sync
//       .get("token")
//       .then((s) => doRequests(s.token))
//       .catch((e) => console.log(e));
//   }, 1000);
// });

/**
 *
 * @param {(value: [number, string] | PromiseLike<[number, string]>) => void} res promise resolve function
 * @param {(reason?: any) => void} rej promise reject function
 */
const waitForTokenPromise = (res, rej) => {
  /**
   * @param {number} c number of times probed.
   */
  const onError = (c) => {
    if (c > 20) rej("Could not get token");
    else setTimeout(() => getToken(c + 1), 250);
  };

  /**
   * @param {any} vals potential token
   * @param {number} c number of times probed.
   */
  const validateToken = (obj, c) => {
    if (!obj) return onError(c);
    const vals = JSON.parse(obj.token);

    const [expires, token] = vals;

    const healthyToken = new Date().getTime() < expires && token.length > 15;
    if (!healthyToken) return onError(c);
    res([expires, token]);
  };

  /**
   *
   * @param {number} c number of times probed.
   */
  const getToken = (c) => {
    browser.storage.sync
      .get("token")
      .then((v) => validateToken(v, c))
      .catch((err) => onError(c, err));
  };

  getToken(0);
};

/**
 *
 * @returns {Promise<[number, string]>}
 */
const waitForToken = () => {
  return new Promise(waitForTokenPromise);
};

const onLoad = () => {
  const p = document.getElementById("ID");
  waitForToken()
    .then(([expires, token]) => {
      p.innerText = token;
      console.log(token);
    })
    .catch((err) => {
      p.innerText = err + "";
      p.style.color = "red";
    });
};

document.addEventListener("DOMContentLoaded", onLoad);
