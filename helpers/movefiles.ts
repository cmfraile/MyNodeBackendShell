import { UploadedFile } from "express-fileupload" ;
import { existsSync , unlinkSync } from 'fs' ;
import { v4 } from 'uuid' ;
import path from 'path' ;

//Funciones para borrar y subir ficheros. A la hora de generar las instancias gestoras de la base de datos, mando como dependencia dichas funciones para respetar la inversión de dependencias:

const uploadFile = (file:UploadedFile,validExtensionFile:string[]):Promise<string> => {

    const storage = `${process.env.STORAGE}` ;

    return new Promise((rs,rj) => {
        const extension = file.name.split('.')[file.name.split('.').length - 1];
        const nameOfNewFile = `${v4()}.${extension}`;
        const uploadPath = path.join(storage,nameOfNewFile);
        if(!validExtensionFile.includes(extension)){
            rj(`La extensión [${extension}] no esta permitida`);
        };
        file.mv(uploadPath,(error) => {
            if(error){rj(error)};
            rs(nameOfNewFile);
        })
    });
}

const deleteFile = (place:string,validExtensionFile:string[]):Promise<void> => {

    const storage = `${process.env.STORAGE}` ;

    return new Promise((rs,rj) => {
        const uploadedPath:string = path.join(storage,place);
        const extension = place.split('.')[place.split('.').length - 1];
        if( existsSync(uploadedPath) && validExtensionFile.includes(extension) ){rs(unlinkSync(uploadedPath))};
    });

}

export { uploadFile , deleteFile };