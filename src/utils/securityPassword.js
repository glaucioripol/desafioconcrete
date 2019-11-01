const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

// retorna o hash
const createHash = password => bcrypt.hashSync(password, salt)
// retorna um booleano
const checkHash = (hash, hashToCompare) => bcrypt.compareSync(hash, hashToCompare)

module.exports = {
    createHash,
    checkHash
}