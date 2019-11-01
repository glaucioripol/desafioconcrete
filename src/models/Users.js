const { Schema, model } = require("mongoose")

const UserSchema = new Schema({
    nome: String,
    email: String,
    senha: String,
    ultimoLogin: Date,
    telefones: [Object]
}, {
    timestamps: true
})

module.exports = model("Users", UserSchema)