import { connect as MonConnect, ConnectOptions } from "mongoose";

export const dataBaseConnection = async() => {
    try{
        const options:ConnectOptions = {
            user:process.env.USERDATABASE,
            pass:process.env.PASSDATABASE,
            dbName:process.env.DATABASENAME};
        //En mi caso uso mongoDB en un contenedor de docker:
        await MonConnect(`mongodb://${process.env.DATABASEIP}/${options.dbName}`,options,(err) => console.log);
    }catch(err){console.log(err);throw new Error('No se logro establecer la conexión')};
}
