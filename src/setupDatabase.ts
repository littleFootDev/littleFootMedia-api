import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const db= process.env.DB;

async function databaseSetup () {
    const connected : boolean = await connectToDatabase();
    if (!connected) {
        process.exit(1);
    }
};

async function connectToDatabase() : Promise<boolean> {
    try {
        await mongoose.connect(db!) 

        console.log("Connécté à la database");

        return true;
    } catch (err) {
        console.log("Erreur pendant la connexion : ", err);
        return false;
    }
}

export {databaseSetup};