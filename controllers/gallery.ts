import { Router } from "express";
import { documentCRUDinterface } from "../interfaces/crudClass.interfaces";
import { validExtensionFile } from "../interfaces/enums";
import { gallery } from "../interfaces/models.interfaces";
import { gallery as galleryEnum } from "../interfaces/enums";
import { uploadFile , deleteFile } from "../helpers/movefiles";
import { returnedCRUD } from "../helpers/returnedCRUD";
import { assertiveJWT, validateFile , validateDelete } from "../middlewares/validators";
import { validMaster } from "../middlewares/validators";

//Ejemplo de como generar dinamicamente los endpoints de una colección de galeria de fotos. Genero el objeto argumento que necesita la clase generadora, mando a un método que me devuelve la instancia con todos los endpoints, desestructuro hasta obtener todos los endpoints y genero la ruta de cada uno de ellos.

const { pic , title } = galleryEnum;

const galleryStrategy:documentCRUDinterface = {
    model:'gallery',
    fields:{
        folderField:pic,
        noFolderFields:[title]
    },
    handleFolders:{uploadFile,deleteFile},
    folderExtension:validExtensionFile.images,
    crudEndpointsNames:{
        get:'getPicOfGallery',
        put:'putPicOfGallery',
        post:'postPicOfGallery',
        del:'delPicOfGallery'
    },
    isDated:true
};

const galleryRouter = Router();
const { getPicOfGallery , putPicOfGallery , postPicOfGallery , delPicOfGallery } = returnedCRUD<gallery>(galleryStrategy);

galleryRouter.get('/',[
    assertiveJWT,
    validMaster
],getPicOfGallery);

galleryRouter.put('/',[
    //yourLoginTokenAgent,
    validateFile(galleryEnum.pic,false)
],putPicOfGallery)

galleryRouter.post('/',[
    //yourLoginTokenAgent,
    validateFile(pic,true),
    validMaster,
],postPicOfGallery);

galleryRouter.delete('/',[
    //gJWT,
    validateDelete,
    validateFile(galleryEnum.pic,false),
    validMaster
],delPicOfGallery);

export { galleryRouter }