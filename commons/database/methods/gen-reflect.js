

function assign(targetClass, obj){

    const newIntance = {};
    Object.keys(targetClass.schema).map(key=>{
        if(targetClass.schema.classConstructor){
            newIntance[key] = assign(targetClass.schema.classConstructor,obj[key] )
        }else 
            newIntance[key] = obj[key]
    })
    
    return newIntance;

}

module.exports.assign = assign;