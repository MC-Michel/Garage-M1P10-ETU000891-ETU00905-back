const { ObjectId } = require("mongodb");

 


function assign(targetClass, obj, schemaName='schema'){
    const isArray = Array.isArray(obj)
    if(!isArray) obj = [obj];
   const newInstances = []
    obj.forEach(element => {
        const newInstance = {};
        Object.keys(targetClass[schemaName]).map(key=>{ 
            if(targetClass[schemaName][key].classConstructor){
                newInstance[key] = assign(targetClass[schemaName][key].classConstructor,element[key], schemaName )
                if(!newInstance[key]._id) newInstance[key]._id = ObjectId();
            }else if(element[key] !== undefined)
                newInstance[key] = element[key]
        })
        if(!newInstance._id) newInstance._id = ObjectId();
        newInstances.push(newInstance);
    });
    if(isArray)
        return newInstances;
    return newInstances[0];
}

module.exports.assign = assign;