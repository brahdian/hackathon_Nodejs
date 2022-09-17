import express, { json, urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import { db } from "./auth/auth.model.js"


const app = express();

const urlOptions = { extended: true };
const corsOptions = { origin: "http://localhost:3000" };

//Middlewares

app.use(helmet());
app.use(cors(corsOptions));
app.use(urlencoded(urlOptions));
app.use(json());

// DB Connection

const Role = db.role

db.mongoose.connect(`${dbConfig.uri}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    initial();
    console.log("connected to db");
}).catch(err=>{
    console.error(err);
})
function initial(){
    Role.estimatedDocumentCount((err, count)=>{
        if(!err && count ===0){
            let rolesArray = ["user", "admin"];
            rolesArray.forEach(role=>{
                try{
                    Role.create({ name : role});
                    console.log(`added ${role} to roles collection`);
                }
                catch(err){
                    console.error(err);
                }
            })
        }
    })
}

const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`server is ready at ${PORT}`)
})