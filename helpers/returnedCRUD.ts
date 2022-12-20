import { StrategyCRUD } from "../abstractions/abstractions";
import { documentCRUDinterface, getCRUDtype } from "../interfaces/crudClass.interfaces";
import { crudCases } from "../interfaces/enums";
import { CollectionCRUD } from "../models/strategies/CollectionCRUD";
import { SingleItemCRUD } from "../models/strategies/SingleItemCRUD";

//Esta función determina que instancia de estrategia es la indicada para cada caso de uso. Cada caso de uso puede estar vinculada a una o varias colecciones, en función de su comportamiento:
const createStrategy = <modelInterface>(crudConfiguration:documentCRUDinterface):StrategyCRUD<modelInterface> => {

    const { model:modelName } = crudConfiguration ;
    const { collection , single } = crudCases ;

    if( single.includes(modelName) ){ return new SingleItemCRUD<modelInterface>(crudConfiguration) };
    if( collection.includes(modelName) ){ return new CollectionCRUD<modelInterface>(crudConfiguration) };

    throw new Error('No se llego a asignar una instancia de estrategia en la función');
    
};

//Esta función es la que genera la instancia de estrategia y devuelve con los nombres determinados en el argumento los diferentes endpoints:
export const returnedCRUD = <modelInterface>(crudConfiguration:documentCRUDinterface):getCRUDtype => {

    const strategy = createStrategy<modelInterface>(crudConfiguration);

    const { crudEndpointsNames ,
            getCRUD , postCRUD , putCRUD , delCRUD } = strategy ;

    let crudReturned:any = {};

    if(crudEndpointsNames){
        const {get,post,put,del} = crudEndpointsNames ;
        if( get ){ crudReturned.endpoints[get] = getCRUD } ;
        if( post ){ crudReturned.endpoints[post] = postCRUD } ;
        if( put ){ crudReturned.endpoints[put] = putCRUD } ;
        if( del ){ crudReturned.endpoints[del] = delCRUD } ;
    }else{
        crudReturned.endpoints['get'] = getCRUD ;
        crudReturned.endpoints['post'] = postCRUD ;
        crudReturned.endpoints['put'] = putCRUD ;
        crudReturned.endpoints['del'] = delCRUD ;
    }

    return {...crudReturned};
    
}
