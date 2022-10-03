import { RequestHandler} from 'express'

const signUpError = (err: any)=>{
    let errors = {pseudo: '', email: '', password: ''};

    if(err.message.includes('pseudo'))
        errors.pseudo = "Pseudo incorrect ou déjà pris";
    
    if(err.message.includes('password'))
        errors.password = "Le mot de passe doit faire 6 caractères minimum";

    if(err.message.includes('email'))
        errors.email = "Email incorrect";

    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
        errors.email = "Cet email est déjà enregistré";

    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
        errors.email = "Ce speudo est déjà enregistré";

    return errors;
};

const signInErrors = (err) => {
    let errors = {email: '', password: ''};

    if(err.message.includes("email"))
        errors.email = "Email Inconnu";

    if(err.message.includes("password"))
        errors.password = "Le mot de passe ne correspond pas!";
}


export {signUpError, signInErrors}