import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";

export const UsersSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String } 
})

UsersSchema.pre('save', async function (next) {
    try {
        if(!this.isModified('password')) next()
        this['password'] = await bcrypt.hash(this.password, +process.env.BCRYPT_COST)
    } catch (error) {
        return next(error)
    }
})