interface gallery { pic:string , title:string , uploadDate:Date };
interface misc { twitter:string , instagram:string , email:string }
type modelTypes = 'gallery'|'misc';

export { gallery , misc , modelTypes }