function getPropertyNames(instance){
    return Object.keys(instance.schema);
}

function assign(targetClass, obj){
    const newIntance = new targetClass;
    getPropertyNames(targetClass).map((key)=>{
        newIntance[key] = obj[key]
    })
    return newIntance;
}

module.exports.assign = assign;