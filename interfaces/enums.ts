/*
Para centralizar los nombres de variables, propiedades y otros, es un tanto imprudente nombrarlos donde se emplean, ya que en caso de cambios o errores, es mas dificil rastrear el problema. Yo uso diccionarios con esos nombres para que todos tengan en común los mismos términos y un cambio aqui lo replique en el resto de lugares que necesitan de esos nombres:
*/

//Propiedades de Schemas
enum gallery {
    pic = 'pic',
    title = 'title',
    uploadDate = 'uploadDate'
};
enum misc {
    twitter = 'twitter',
    instagram = 'instagram',
    email = 'email'
};

//Nombres en común de otras propiedades:
enum otherFields {
    uploadDate = 'uploadDate',
    fieldToDelete = 'fieldToDelete',
    assertiveToken = 'assertiveToken',
    workID = 'workID'
};
enum deleteCases {
    pic = 'pic',
    twitter = 'twitter',
    instagram = 'instagram',
    email = 'email'
};


const validExtensionFile:{[key:string]:string[]} = {
    images:['png','jpg','jpeg'],
    documents:['pdf']
}

const crudCases:{[key:string]:string[]} = {
    single: ['misc'],
    collection: ['gallery']
}

const apiPointer:string[] = ['gallery','misc','file'];

export { gallery , misc , otherFields , deleteCases , apiPointer , validExtensionFile , crudCases }