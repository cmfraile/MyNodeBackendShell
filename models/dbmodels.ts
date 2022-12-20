import { schemaDataType } from '../interfaces/crudClass.interfaces';

export const schemaData:{[key:string]:schemaDataType} = {
    gallery:[{
        pic:{type:String,required:false},
        title:{type:String,required:false},
        uploadDate:{type:Date,required:true},
    },{collection:'gallery'}],
    misc:[{
        twitter:{type:String,required:false},
        instagram:{type:String,required:false},
        email:{type:String,required:false}
    },{collection:'misc'}]
}

