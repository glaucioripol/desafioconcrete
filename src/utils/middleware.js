const jwt = require('jsonwebtoken');
const { secretKey } = require("../configs/config")
const Users = require("../models/Users")

// aqui jwt, sem hash
function verifyJWT(req, res, next) {
    let token = req.headers['Bearer']
    if (!token) return res.status(403).json({ auth: false, message: 'Não autorizado' })

    jwt.verify(token, secretKey, function (err, decoded) {
        if (err) return res.status(403).json({ auth: false, message: 'Sessão inválida' })
        // se tudo estiver ok, salva no request para uso posterior
        req.userId = decoded.id;
        next();
    });
}


async function checkToken(req, res, next) {
    let token = req.headers.bearer
    if (!token) return res.status(403).json({ message: 'Não autorizado' })

    let user = await Users.findOne({ lastToken: token })
    if (user) {
        let lastLogin = new Date(user.ultimoLogin)
        let CheckLogin = new Date()

        let timeOfLastLogin = ((CheckLogin - lastLogin) / 1000) / 60

        console.log(timeOfLastLogin <= 30, timeOfLastLogin)
        if (timeOfLastLogin <= 30) {
            return next()
        }
    }

    return res.status(403).json({ message: 'Sessão inválida' })
}

module.exports = checkToken