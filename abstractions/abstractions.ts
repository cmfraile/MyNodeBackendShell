import { Schema , Model , model as modelMethod } from 'mongoose';
import { Request } from 'express';
import { otherFields as otherFieldsEnum } from '../interfaces/enums';
import { uploadFileType , deleteFileType , endpoint, schemaDataType } from '../interfaces/crudClass.interfaces';
import { crudEndpointsNames } from '../interfaces/crudClass.interfaces';
import { modelTypes } from '../interfaces/models.interfaces';
import { schemaData } from '../models/dbmodels';

/*
La clase BaseCRUD es la abstracción que proporciona el conjunto de propiedades y métodos para generar dinámicamente la colección en la base de datos. A partir de aqui puedes extenderla a las clases finales, o como hago yo, que la extienda otra abstracción que incluye lo que define cada caso de explotación de colecciones diferente. Es muy recomendable abstraer hasta la clase no abstracta final. Al menos a mi, me ha dado muy buenos resultados:
*/

abstract class BaseCRUD<modelInterface> {

    public model:Model<modelInterface,{},{},{},any>;
    
    abstract fields:{folderField:string|undefined,noFolderFields:string[]};
    abstract handleFolders:{uploadFile:uploadFileType,deleteFile:deleteFileType};
    abstract folderExtension:string[];
    abstract crudEndpointsNames:crudEndpointsNames|undefined;
    abstract isDated:boolean; //El unico monoDocument que precisa la fecha es el cv y los undefinedWorks;

    constructor(model:modelTypes){ this.model = this.modelCrafter<modelInterface>(schemaData[model]) };

    //Este método genera dinamicamente el modelo en base a un Schema ya generado, dando la posibilidad de generar mas de una colección por caso de explotación de colecciones:
    private modelCrafter<modelInterface>(schemaData:schemaDataType):Model<modelInterface, {}, {}, {}, any>{
        const modelName = schemaData[1].collection;
        const schema = new Schema<modelInterface>(...schemaData);
        return modelMethod<modelInterface>(modelName,schema);
    }
    
};

/*
Esta abstracción obliga a generar los endpoints en la clase que contiene el caso de explotación. Los métodos proporcionados son los siguientes:

toJSON : Debido a que genero los modelos dinámicamente y la alteración del método de un Schema puede resultar algo complejo de entender para juniors, abstraigo un método listo para usar justo antes de la respuesta al cliente que sea mas legible para el desarrollador y que el Schema no se le determine el caso de explotación. En este caso solo necesita los datos a transformar de la consulta y la confirmación del token de usuario que altera dicha respuesta, ofreciendo mas o menos información. Para alterar el método del Schema seria así:

    anySchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;

bundleGenerator : Con la información de la petición y las tareas de gestión de los ficheros ya realizadas, este método devuelve al método de guardado o edición la información tal y como la exige el ORM. En mi caso, mongoose.
*/

abstract class StrategyCRUD<modelInterface> extends BaseCRUD<modelInterface> {

    abstract getCRUD:endpoint;
    abstract postCRUD:endpoint;
    abstract putCRUD:endpoint;
    abstract delCRUD:endpoint;

    constructor(model:modelTypes){super(model)}

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
