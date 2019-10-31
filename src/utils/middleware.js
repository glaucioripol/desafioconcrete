const jwt = require('jsonwebtoken');
const { secretKey } = require("../configs/config")


function verifyJWT(req, res, next) {
    var token = req.headers['Bearer'];
    if (!token) return res.status(403).send({ auth: false, message: 'Não autorizado' });

    jwt.verify(token, secretKey, function (err, decoded) {
        if (err) return res.status(403).send({ auth: false, message: 'Sessão inválida' });
        // se tudo estiver ok, salva no request para uso posterior
        req.userId = decoded.id;
        next();
    });
}

module.exports = verifyJWT