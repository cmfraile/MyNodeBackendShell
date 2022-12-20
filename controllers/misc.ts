import { uploadFile , deleteFile } from '../helpers/movefiles';
import { misc as miscEnum } from '../interfaces/enums';
import { validExtensionFile } from '../interfaces/enums';
import { returnedCRUD } from '../helpers/returnedCRUD';
import { documentCRUDinterface } from '../interfaces/crudClass.interfaces';
import { Router } from 'express';
import { validMaster } from '../middlewares/validators';
import { assertiveJWT } from '../middlewares/validators';
import { misc } from '../interfaces/models.interfaces';

const { twitter , instagram , email } = miscEnum;

const miscStrategy:documentCRUDinterface = {
    model:'misc',
    fields:{
        folderField:undefined,
        noFolderFields:[twitter,instagram,email]
    },
    handleFolders:{uploadFile,deleteFile},
    folderExtension:validExtensionFile.images,
    crudEndpointsNames:{
        get:'getMisc',
        put:'putMisc',
        del:'delMisc'
    },
    isDated:false
};

const miscRouter = Router();
const { getMisc , putMisc , delMisc } = returnedCRUD<misc>(miscStrategy);

miscRouter.get('/',[
    assertiveJWT,
    validMaster,
],getMisc);

miscRouter.put('/',[
    //yourLoginTokenAgent,
    validMaster
],putMisc);

miscRouter.delete('/',[
    //yourLoginTokenAgent,
    validMaster
],delMisc)

export { miscRouter }