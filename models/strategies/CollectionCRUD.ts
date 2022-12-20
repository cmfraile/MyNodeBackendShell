import { Request , Response } from 'express' ;
import { documentCRUDinterface } from '../../interfaces/crudClass.interfaces';
import { StrategyCRUD } from '../../abstractions/abstractions';
import { otherFields } from '../../interfaces/enums';

export class CollectionCRUD<modelInterface> extends StrategyCRUD<modelInterface>{
    
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
            const data:any = await this.model.find() ; const { assertiveToken } = req.body ;
            return res.status(200).json(this.toJSON(data,assertiveToken));
        }catch(err){console.log(err) ; return res.status(500).json(err)}
    
    };

    public postCRUD = async(req:Request,res:Response) => {
        
        const newDocument = async(bundle:Object):Promise<void> => {
            try{ await new this.model({...bundle}).save() ; return }catch(err){console.log};
        }

        try{
            
            const folder = req.body[`${this.fields.folderField}`]

            if(folder){
                await this.handleFolders.uploadFile(folder,this.folderExtension)
                .then( async(fileRoute) => {
                    const bundle = this.bundleGenerator(req,fileRoute);
                    await newDocument(bundle)
                    .then(() => { return res.status(200).json() })
                })
                .catch(error => {console.log(error) ; return res.status(400).json()});
            }else{ await newDocument(this.bundleGenerator(req)) ; return res.status(200).json() } ;

        }catch(err){console.log(err) ; return res.status(500).json(err)}
    
    }

    public putCRUD = async(req:Request,res:Response) => {
        
        try{

            const workID:string = `${req.header(otherFields.workID)}`;
            const oldFolderDocumentRoute = await this.model.findById(workID).get(`${this.fields.folderField}`);
            const newFolderInRaw = req.body[`${this.fields.folderField}`];

            if(newFolderInRaw){
                await this.handleFolders.uploadFile(newFolderInRaw,this.folderExtension)
                .then( async(fileRoute) => {
                    await this.model.findByIdAndUpdate(workID,this.bundleGenerator(req,fileRoute),{new:true});
                    if(oldFolderDocumentRoute){this.handleFolders.deleteFile(oldFolderDocumentRoute,this.folderExtension)};
                    return res.status(200).json();
                })
                .catch(error => {console.log(error) ; return res.status(400).json()});
            }else{
                await this.model.findByIdAndUpdate(workID,this.bundleGenerator(req),{new:true});
                return res.status(200).json();
            }

        }catch(err){console.log(err) ; return res.status(500).json(err)}

    };

    public delCRUD = async(req:Request,res:Response) => {

        try{

            const workID:string = `${req.header(otherFields.workID)}`;
            const fileToDelete:any = await this.model.findById(workID);
            //return res.status(200).json()
            this.handleFolders.deleteFile(fileToDelete[`${this.fields.folderField}`],this.folderExtension);
            this.model.findByIdAndDelete(workID)
            .then(() => {return res.status(200).json()})
            .catch(() => {throw new Error('No se borro el registro indicado.')})
            
        }catch(err){console.log(err) ; return res.status(500).json(err)}

    };

    public toJSON(data:any[],assertiveToken:boolean):any|undefined{

        if(data.length == 0){return undefined}
        const { folderField } = this.fields ; 
        const environment = (folder:string) => `http://${process.env.ENVIRONMENT}:${process.env.PORT}/api/file/${folder}`;
        data = data
        .map( x => {
            const {_id,__v,...data} = x._doc;
            data[`${folderField}`] = environment(data[`${folderField}`]);
            return (assertiveToken)
            ? {id:_id,...data}
            : data;
        });
        if(this.isDated){
            data = data
            .sort((a,b) => {
                let caso = 0 ; let dateA = new Date(a.uploadDate).getTime() ; let dateB = new Date(b.uploadDate).getTime() ;
                (dateA > dateB) ? caso = -1 : caso = 1;
                return caso;
            });
        }
        return data;

    }

}