import { Request , Response } from 'express';
import { UploadedFile } from "express-fileupload";
import { modelTypes } from './models.interfaces';

interface endpoint {(req: Request, res: Response):Promise<Response<any, Record<string, any>> | undefined>};
type uploadFileType = (file:UploadedFile,validExtensionFile:string[]) => Promise<string> ;
type deleteFileType = (place:string,validExtensionFile:string[]) => Promise<void> ;
type getCRUDtype = {[key:string]:endpoint};
type crudEndpointsNames = {get?:string,post?:string,put?:string,del?:string};
type schemaDataType = [{[key:string]:any},{collection:string}];

interface documentCRUDinterface {
    model:modelTypes
    fields:{folderField:string|undefined,noFolderFields:string[]},
    handleFolders:{uploadFile:uploadFileType,deleteFile:deleteFileType},
    folderExtension:string[],
    crudEndpointsNames:crudEndpointsNames,
    isDated:boolean
}

export {    
    endpoint , uploadFileType , deleteFileType , getCRUDtype , crudEndpointsNames , schemaDataType, 
    documentCRUDinterface
}