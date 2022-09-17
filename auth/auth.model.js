import mongoose from "mongoose";
import validator from "validator";

const { Schema } = mongoose;

const role = mongoose.model(
    "Role",
    new Schema({
        name: {type: String, required: true, trim: true, unique: true},
    })
)

const user = mongoose.model(
    "User",
    new Schema({
        name: {type: String, required: true, trim: true},
        email: { type: String, required: true, trim: true, lowercase: true, unique: true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("Email is Invalid");
                }
            }
        },
        password: { type: String, required: true, trim: true, minlength:6 },
        roles: [
            {
                type: Schema.Types.ObjectId,
                ref: "Role"
            }
        ]
    })
)

const db = {
    mongoose: mongoose,
    user: user,
    role: role,
    ROLES: ["user", "admin"]
}

export { db };