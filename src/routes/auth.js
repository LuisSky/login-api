const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../../src/errors/ValidationError.js');

const secretCode = 'inGodITrust';

module.exports = (app) => {
  const signin = (req, res, next) => {
    app.services.user.findOne({ mail: req.body.mail })
      .then((user) => {
        if (!user) throw new ValidationError('Invalid user and password');

        if (bcrypt.compareSync(req.body.password, user.password)) {
          const payload = {
            id: user.id,
            name: user.name,
            mail: user.mail,
          };
          const token = jwt.encode(payload, secretCode);
          res.status(200).json({ token });
        } else throw new ValidationError('Invalid user and password');
      })
      .catch((err) => next(err));
  };
  return { signin };
};
