import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number,
};

const connection: connectionObject = {};

async function DbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("database already connected");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "");
        connection.isConnected = db.connections[0].readyState;
        console.log("databaase connected sucessfully");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
    
}

export default DbConnect;