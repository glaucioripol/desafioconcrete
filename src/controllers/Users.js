const jwt = require('jsonwebtoken')
const { secretKey } = require("../configs/config")
const Users = require("../models/Users")

module.exports = {

    async authorize(req, res) {
        let { email, senha } = req.body
        let user = await Users.findOne({ email, senha })
        if (user) {
            const id = user._id //id do banco
            let token = jwt.sign({ id }, secretKey, { expiresIn: 3000 })// com expiracao
            return res.status(200).json({ auth: true, token })
        }
        return res.status(401).json({ auth: false, message: 'Usuário e/ou senha inválidos' })
    },


}