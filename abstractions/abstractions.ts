import { Schema , Model , model as modelMethod } from 'mongoose';
import { Request } from 'express';
import { otherFields as otherFieldsEnum } from '../interfaces/enums';
import { uploadFileType , deleteFileType , endpoint, schemaDataType } from '../interfaces/crudClass.interfaces';
import { crudEndpointsNames } from '../interfaces/crudClass.interfaces';
import { modelTypes } from '../interfaces/models.interfaces';
import { schemaData } from '../models/dbmodels';

abstract class BaseCRUD<modelInterface> {

    public model:Model<modelInterface,{},{},{},any>;
    
    abstract fields:{folderField:string|undefined,noFolderFields:string[]};
    abstract handleFolders:{uploadFile:uploadFileType,deleteFile:deleteFileType};
    abstract folderExtension:string[];
    abstract crudEndpointsNames:crudEndpointsNames|undefined;
    abstract isDated:boolean; //El unico monoDocument que precisa la fecha es el cv y los undefinedWorks;

    constructor(model:modelTypes){ this.model = this.modelCrafter<modelInterface>(schemaData[model]) };

    private modelCrafter<modelInterface>(schemaData:schemaDataType):Model<modelInterface, {}, {}, {}, any>{
        const modelName = schemaData[1].collection;
        const schema = new Schema<modelInterface>(...schemaData);
        return modelMethod<modelInterface>(modelName,schema);
    }
    
};

abstract class StrategyCRUD<modelInterface> extends BaseCRUD<modelInterface> {

    abstract getCRUD:endpoint;
    abstract postCRUD:endpoint;
    abstract putCRUD:endpoint;
    abstract delCRUD:endpoint;

    constructor(model:modelTypes){super(model)}

    //Debido a que los Schema se generan dinámicamente y que cada clase que hereda la abstracción recoge un caso de gestíon de la base de datos ( Y de cada caso pueden salir x modelos ), es mas facil para todos recurrir a un método que devuelva los datos listos para la respuesta al cliente, justo al emitir la respuesta:
    
    /*
    anySchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
    */

    abstract toJSON(data:any,assertiveToken:boolean):any;
    
    public bundleGenerator = (req:Request,fileNewRoute?:string):Object => {

        const folderFieldFilter = ( field:string , fileNewRoute:string|undefined ):boolean => (field == this.fields.folderField && fileNewRoute) ? false : true ;
        const { folderField , noFolderFields } = this.fields ; let bundle:{[key:string]:any} = {}

        if(folderField){
            const fields = [folderField,...noFolderFields] ;
            fields.filter( field => folderFieldFilter(field,fileNewRoute) ).map(field => {
                if( req.body[field] ){ bundle[field] = req.body[field] }else{ bundle[field] = undefined }
            });
            if(!folderFieldFilter(folderField,fileNewRoute)){ bundle[folderField] = fileNewRoute };
            
        }else{
            const fields = [...noFolderFields] ;
            fields.map(field => { if( req.body[field] ){ bundle[field] = req.body[field] }else{ bundle[field] = undefined } });
        }
        if( this.isDated ){ bundle[otherFieldsEnum.uploadDate] = new Date() };

        return bundle;
        
    };

};

export  { BaseCRUD , StrategyCRUD }
