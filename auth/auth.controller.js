import { secret } from "../config/auth.config.js";
import { db } from "./auth.model.js"

const User = db.user;
const Role = db.role;

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"

function signup(req,res){
    try{
        let signup = await userSignup(req.body);
        res.status(200).json({
            message: "User registered successfully!",
            signup
        });
        return;
    }
    catch(error){
        console.error(error);
        res.status(500).json({error});
        return;
    }
}


const verifyToken = (req, res, next) =>{
    const token = req.cookies.accessToken;
    if (!token) {
        return res.sendStatus(403);
    }
    try {
        jwt.verify(token, secret, (err, decoded)=>{
            if(err){
                console.error(err);
                return res.status(403).json({
                    message: "Unauthorized!"
                })
            }
            req.userId = decoded.id;
            return next();
        });
    } catch {
        return res.sendStatus(403);
    }
}


const isAdmin = (req, res, next) =>{
    User.findById(req.userId).exec((err, user)=>{
        if(error){
            console.error(error);
            return res.status(500).json({message: error})
        }

        Role.find({
            _id: { $in: user.roles}
        },
        (error, roles)=>{
            if(error){
                return res.status(500).json({message: error})
            }
            for(let i=0; i< roles.length; i++){
                if(roles[i].name ==="admin")
                return next();
            }
            return res.status(403).json({message: "require admin role!"})
        }
        )
    })
}

function signin(req, res){
    User.findOne({
        email: req.body.email
    })
    .populate("roles", "-__v")
    .exec((err, user)=>{
        if(err){
            console.error(`error while login ${err}`);
            res.status(500).json({ message: err});
            return;
        }

        if(!user){
            console.error(`User not found`);
            res.status(404).json({ message: "User not Found"});
            return;
        }

        let isValidPassword = bcrypt.compare(
            req.body.password,
            user.password
        )

        if(!isValidPassword){
            console.error("Invalid Password");
            return res.status(401).json({
                accessToken: null,
                message: "Invalid Pasword!"
            })
        }

        let token = jwt.sign({ id: user.id }, secret, {
                expiresIn: 60*60
            }
        )

        let authorities = [];

        for(let i = 0; i<user.roles.length; i++){
            authorities.push("ROLE_"+user.roles[i].name.toUpperCase());
        }
        console.log(req.body.email, "Login Successfull!")
        return res
    
        res.cookie("accessToken", token, {
            httpOnly: true
          })
        .status(200).json({
            id: user._id,
            email: user.email,
            roles: authorities
        })
    })
    
}

export { signup, signin, verifyToken, isAdmin }