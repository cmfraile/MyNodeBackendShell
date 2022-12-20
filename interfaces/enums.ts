// Para evitar problemas de nombres, llamado de variables, entre otros, es recomendable usar diccionarios de este tipo que llamen al string literal de dicha propiedad, para que un cambio aqui ponga de acuerdo al resto del programa. Recomendable llevar este mismo diccionario al front:

//SchemaProperties:
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