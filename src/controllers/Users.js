const jwt = require('jsonwebtoken')
const { secretKey } = require("../configs/config")
const Users = require("../models/Users")

module.exports = {

    async authorize(req, res) {
        let { email, senha } = req.body
        if (email && senha) {
            let user = await Users.findOne({ email, senha })
            if (user) {
                const id = user._id //id do banco
                let token = jwt.sign({ id }, secretKey, { expiresIn: 1800 })
                let date = new Date().toISOString()
                await user.updateOne({ _id: id }, { $set: { ultimoLogin: date } }).exec()

                return res.status(200).json({
                    id,
                    nome: user.nome,
                    email: user.email,
                    telefones: user.telefones,
                    ultimoLogin: date,
                    dataCriacao: user.createdAt,
                    dataAtualizacao: user.updatedAt,
                    token
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

            const newUser = await Users.create({
                nome,
                email,
                senha,
                ultimoLogin: new Date().toISOString(),
                telefones
            })

            let { _id, createdAt, updatedAt, ultimoLogin } = newUser
            let token = jwt.sign({ _id }, secretKey, { expiresIn: 1800 })

            return res.status(201).json({
                id: _id,
                nome,
                email,
                telefones,
                ultimoLogin,
                dataCriacao: createdAt,
                dataAtualizacao: updatedAt,
                token
            })

        }

        return res.status(400).json({ message: "Dados para cadastros incorretos" })
    },
    async show(req, res) {
        req, res
    }

}