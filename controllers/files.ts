import { Router } from 'express';
import { param } from 'express-validator';
import { validMaster } from '../middlewares/validators';
import { validRoute } from '../middlewares/validators';
import { Response , Request } from "express";

//Controlador básico de muestra de ficheros:

const serveFile = async(req:Request,res:Response) => {
    try{
        const routeFile = req.body.route;
        if(routeFile == undefined){return}else{res.sendFile(routeFile)}
    }catch(err){return res.status(500).json(err)}
}

const fileRouter = Router();

fileRouter.get('/:route',[
    param('route').not().isEmpty(),
    validRoute,
    validMaster
],serveFile);

export { fileRouter }

