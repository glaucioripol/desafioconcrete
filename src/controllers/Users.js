const jwt = require('jsonwebtoken')
const { secretKey } = require("../configs/config")
const { createHash, checkHash } = require("../utils/methodsWithHash")
const Users = require("../models/Users")

module.exports = {

    async authorize(req, res) {
        let { email, senha } = req.body
        if (email && senha) {
            let user = await Users.findOne({ email })
            let checkPwd = checkHash(senha, user.senha)
            if (user && checkPwd) {
                const id = user._id //id do banco
                let token = jwt.sign({ id }, secretKey, { expiresIn: 1800 })
                token = createHash(token)
                let date = new Date().toISOString()
                await Users.updateOne({ _id: id }, { $set: { ultimoLogin: date, lastToken: token } }).exec()

                return res.status(200).json({
                    id,
                    nome: user.nome,
                    email: user.email,
                    ultimoLogin: date,
                    dataCriacao: user.createdAt,
                    dataAtualizacao: user.updatedAt,
                    token,
                    telefones: user.telefones
                })
            }
        }

        return res.status(401).json({ message: 'Usuário e/ou senha inválidos' })

    },
    async store(req, res) {
        let { nome, email, senha, telefones } = req.body

        if (nome && email && senha && telefones) {
            let user = await Users.findOne({ email })

            if (user) {
                return res.status(400).json({ message: 'E-mail já existente' })
            }

            senha = createHash(senha)
            const newUser = await Users.create({
                nome,
                email,
                senha,
                lastToken: "",
                ultimoLogin: new Date().toISOString(),
                telefones
            })

            let { _id, createdAt, updatedAt, ultimoLogin } = newUser
            let token = jwt.sign({ _id }, secretKey, { expiresIn: 1800 })
            token = createHash(token)
            await Users.updateOne({ _id }, { $set: { lastToken: token } }).exec()

            return res.status(201).json({
                id: _id,
                nome,
                email,
                ultimoLogin,
                dataCriacao: createdAt,
                dataAtualizacao: updatedAt,
                token,
                telefones
            })

        }

        return res.status(400).json({ message: "Dados para cadastros incorretos" })
    },
    async show(req, res) {
        // req, res
        return res.status(220).send("<h1>Carai borracha</h1>")
    }

}