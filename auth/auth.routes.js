import { signin, signup } from "./auth.controller.js";

export const auth = function(app){
    app.use(function(req,res,next){
        res.header(
        "origin, Content-TypeError, Accept"
        );
        next();
    });

    app.post("/api/auth/signup", signup);
    app.post("/api/auth/signin", signin)

}