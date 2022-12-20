import { NextFunction, Request , Response } from 'express';
import { validationResult } from 'express-validator';
import { existsSync } from 'fs';
import path from 'path';
import { verify } from 'jsonwebtoken';
import { otherFields , deleteCases } from '../interfaces/enums';

//Este middleware tan solo añade a la petición si se provee un token válido o no. Yo lo uso para cuando se solicite la información, proveer la ID de los objetos o no, ya que dicha ID es necesaria para el borrado y la edición de los diferentes registros de la base de datos, y relevante exclusivamente para el dueño de la web.
export const assertiveJWT = async(req:Request,res:Response,next:NextFunction) => {

    try{

        const { assertiveToken } = otherFields ;
        const token = req.header('token');
        const secret = process.env.JWTKEY;
        
        if( !token || !secret ){ req.body[assertiveToken] = false ; next() } else {
            (!!verify(token,secret) && token !== '') ? req.body[assertiveToken] = true : req.body[assertiveToken] = false;
            next();
        }
        
    }catch( err ){ console.log }
    
}


type middlewareReturn = (req:Request,res:Response,next:NextFunction) => Promise<void>
export const validateFile = (fileToValidate:string,isRequired:boolean):middlewareReturn =>
    async(req,res,next) => {
        try{
            if(req.files){req.body[fileToValidate] = req.files[fileToValidate]};
            if(isRequired){if(req.body[fileToValidate]){next()}else{throw new Error(`El fichero [${fileToValidate}] es necesario`)}}else{next()};
        }catch( err ){ console.log }
    };

//Este middleware exige indicar que campo va a borrarse, y si este refiere a algun que requiere ID, solicitarlo. Yo he añadido throw new Error para indicar el error que salta, pero es mas recomendable devolver la response con el error.
export const validateDelete = async(req:Request,res:Response,next:NextFunction) => {

    try{

        const fieldToDelete = req.header(otherFields.fieldToDelete);
        const workID = req.header(otherFields.workID);
        const { pic , twitter , instagram , email } = deleteCases ;
        
        if( !fieldToDelete ){ throw new Error('No hay campo especificado') };
        if( !Array<string>(pic,twitter,instagram,email).includes(fieldToDelete) ){ throw new Error( 'El campo especificado no es válido' ) };
        if( fieldToDelete == pic && !workID){ throw new Error('El campo especificado exige de una ID de objeto a eliminar') };

        next();

    }catch( err ){ console.log };

};

export const validRoute = async(req:Request,res:Response,next:NextFunction) => {

    const storage:string = `${process.env.STORAGE}` ;

    const { route } = req.params;
    const pathImage = path.join(storage,route);
    if(existsSync(pathImage)){req.body.route = pathImage}else{req.body.route = undefined};
    next();

}

export const validMaster = async(req:Request,res:Response,next:NextFunction) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){return res.status(400).json(errors)};
    next();
}