const fetch = requeire('node-fetch');

module.exports = function ({ resources, middlewareUtil, options }) {
  let accessToken;
  fetch(options.configuration.tokenUrl, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${options.configuration.clientid}:${options.configuration.clientsecret}`,
        'utf-8'
      ).toString('base64')}`
    }
  })
    .then(async (res) => {
      const Token = await res.json();
      accessToken = Token.access_token;
      //process.env.UI5_MIDDLEWARE_HTTP_HEADERS = `{"Authorization": "Bearer ${Token.access_token}"}`;
      if (options.debug) {
        console.log(`
            get access token:
            ${accessToken}
        `);
      }
    })
    .catch((err) => {
      console.log(`
        get access token error:
        ${err}
      `);
    });

  return function (req, res, next) {
    if (!req.headers['Authorization']) {
      req.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    next();
  };
};
