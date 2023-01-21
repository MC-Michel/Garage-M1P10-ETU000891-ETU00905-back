const { ObjectID } = require("bson");


function assign(targetClass, obj){
    if(!Array.isArray(obj)) obj = [obj];
   const newInstances = []
    obj.forEach(element => {
        const newInstance = {};
        Object.keys(targetClass.schema).map(key=>{
            if(targetClass.schema.classConstructor){
                newInstance[key] = assign(targetClass.schema.classConstructor,element[key] )
            }else 
                newInstance[key] = element[key]
        })
        if(!newInstance._id) newInstance._id = new ObjectID();
        newInstances.push(newInstance);
    });
    return newInstances;

}

module.exports.assign = assign;