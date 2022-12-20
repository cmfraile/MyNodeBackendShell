import { Request , Response } from 'express' ;
import { documentCRUDinterface } from '../../interfaces/crudClass.interfaces';
import { StrategyCRUD } from '../../abstractions/abstractions';
import { otherFields } from '../../interfaces/enums';

export class SingleItemCRUD<modelInterface> extends StrategyCRUD<modelInterface> {

    public fields;
    public handleFolders;
    public folderExtension;
    public crudEndpointsNames;
    public isDated:boolean; //El unico monoDocument que precisa la fecha es el cv y los undefinedWorks;

    constructor(args:documentCRUDinterface){
        super(args.model);
        this.fields = args.fields;
        this.handleFolders = args.handleFolders;
        this.folderExtension = args.folderExtension;
        this.crudEndpointsNames = args.crudEndpointsNames;
        this.isDated = args.isDated;
    };

    public getCRUD = async(req:Request,res:Response) => {

        try{
            const [data]:any = await this.model.find() ; const { assertiveToken } = req.body;
            return res.status(200).json(this.toJSON(data,assertiveToken));
        }catch(err){console.log(err) ; return res.status(500).json(err)}

    };

    public postCRUD = async(req:Request,res:Response) => {
        
        const firstDocument = async(bundle:Object):Promise<void> => {
            try{ await new this.model({...bundle}).save() ; return }catch(err){console.log};
        }

        try{

            const folder = req.body[`${this.fields.folderField}`];

            if(folder){
                await this.handleFolders.uploadFile(folder,this.folderExtension)
                .then( async(fileRoute) => {
                    const bundle = this.bundleGenerator(req,fileRoute);
                    await firstDocument(bundle)
                    .then(() => { return res.status(200).json() })
                })
                .catch(error => {console.log(error) ; return res.status(400).json()});
            }else{ await firstDocument(this.bundleGenerator(req)) ; return res.status(200).json() } ;

        }catch(err){console.log(err) ; return res.status(500).json(err)}

    };

    public putCRUD = async(req:Request,res:Response) => {
        
        try{

            const [ monoDocument ]:any = await this.model.find();
            if( !monoDocument ){return await this.postCRUD(req,res)};
            const { __v,_id,_doc:document } = monoDocument ; const oldFolderDocumentRoute:string|undefined = document[`${this.fields.folderField}`]||undefined;
            const folder = req.body[`${this.fields.folderField}`];

            if(folder){
                await this.handleFolders.uploadFile(folder,this.folderExtension).
                then( async(fileRoute) => {
                    await this.model.findByIdAndUpdate(_id.toString(),this.bundleGenerator(req,fileRoute),{new:true});
                    if(oldFolderDocumentRoute){this.handleFolders.deleteFile(oldFolderDocumentRoute,this.folderExtension)};
                    return res.status(200).json();
                })
                .catch(error => {console.log(error) ; return res.status(400).json()});
            }else{
                await this.model.findByIdAndUpdate(_id.toString(),this.bundleGenerator(req),{new:true});
                return res.status(200).json();
            }

        }catch(err){console.log(err) ; return res.status(500).json(err)}

    };

    public delCRUD = async(req:Request,res:Response) => {

        try{

            const deleteField = `${req.header(otherFields.fieldToDelete)}`;
            const [ monoDocument ]:any = await this.model.find();
            if(!monoDocument){return res.status(410).send()};
            if(monoDocument[deleteField] == undefined){return res.status(410).send()};
            if(deleteField == `${this.fields.folderField}`){this.deleteFolder(monoDocument)};
            monoDocument[deleteField] = undefined;
            const newDocument = await monoDocument.save({new:true});
            await this.cleanCollection(newDocument);
            return res.status(200).json();

        }catch(err){console.log(err) ; return res.status(500).json(err)};

    }

    private async cleanCollection({_doc:document}:any){
        try{
            const condition:number = Object.keys(document)
            .filter(x => !['_id','__v'].includes(x))
            .filter(x => document[x]).length;
            if(condition == 0){await this.model.deleteMany({})};
        }catch(err){ console.log }
    }

    public toJSON(data:any,assertiveToken:boolean):any|undefined{

        if(!data){return undefined};
        const { folderField = "" } = this.fields;
        const { _doc } = data ; const { _id , __v , ...document } = _doc ;
        const environment = () => `http://${process.env.ENVIRONMENT}:${process.env.PORT}/api/file/${(document[folderField])}`;
        (assertiveToken) ? data = { id:_id , ...document } : data = {...document};
        if(data[`${folderField}`]){data[`${folderField}`] = environment()};

        return data;

    }

    public deleteFolder(document:any){
        const oldFolderDocumentRoute:string|undefined = document[`${this.fields.folderField}`]||undefined;
        if(oldFolderDocumentRoute){this.handleFolders.deleteFile(oldFolderDocumentRoute,this.folderExtension)};
    }
    
};