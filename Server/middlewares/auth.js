const jwt = require("jsonwebtoken");

exports.auth = (req , res , next) => {
    try{
        //fetch token
        const token = req.cookies.token 
                        || req.body.token
                        || req.header("Authorization").replace("Bearer ", "");
        
        if(!token){
            return res.status(401).json({
                success: false,
                message: "token missing !"
            });
        }
        //verify token
        try{
            const decode =  jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode ;
        }
        catch(e){
            return res.status(401).json({
                success: false,
                message: "Token invalid !"
            });
        }

        //Then next
        next();

    }
    catch(err){
        // console.log(err);
        return res.status(401).json({
            success: false,
            error: err.message,
            message: "Something went wrong while verifying the token !"
        });
    }
}

exports.isStudent = (req, res, next) => {
    try{
        //Verify accountType
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is protected route for Student. You can't access it."
            });
        }
        //then next
        next();
    }
    catch(err){
        return res.status(401).json({
            success: false,
            message: "User accountType is not matching !"
        })
    }
}

exports.isInstructor = (req, res, next) => {
    try{
        //Verify accountType
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is protected route for Instructor. You can't access it."
            });
        }
        //then next
        next();
    }
    catch(err){
        return res.status(401).json({
            success: false,
            message: "User accountType is not matching !"
        })
    }
}

exports.isAdmin = (req, res, next) => {
    try{
        //Verify accountType
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is protected route for Admin. You can't access it."
            });
        }
        //then next
        next();
    }
    catch(err){
        return res.status(401).json({
            success: false,
            message: "User accountType is not matching !"
        })
    }
}