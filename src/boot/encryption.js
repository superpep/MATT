const crypto = require('crypto')

function encrypt (string) {
  return crypto.createHash('md5').update(string).digest('hex')
}

export { encrypt }
