const { ObjectID } = require("bson");


function assign(targetClass, obj){
    const isArray = Array.isArray(obj)
    if(!isArray) obj = [obj];
   const newInstances = []
    obj.forEach(element => {
        const newInstance = {};
        Object.keys(targetClass.schema).map(key=>{
            if(targetClass.schema.classConstructor){
                newInstance[key] = assign(targetClass.schema.classConstructor,element[key] )
            }else if(element[key] !== undefined)
                newInstance[key] = element[key]
        })
        if(!newInstance._id) newInstance._id = ObjectID();
        newInstances.push(newInstance);
    });
    if(isArray)
        return newInstances;
    return newInstances[0];
}

module.exports.assign = assign;