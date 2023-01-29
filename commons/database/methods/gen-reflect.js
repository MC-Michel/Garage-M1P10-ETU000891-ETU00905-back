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
                if( !newInstance[key]._id) newInstance[key]._id = ObjectId();
                if(typeof newInstance._id === 'string') newInstance[key]._id = new ObjectId(newInstance[key]._id)
            }else if(element[key] !== undefined)
                newInstance[key] = element[key]
        })
        if(!newInstance._id) newInstance._id = ObjectId();
        if(typeof newInstance._id === 'string') newInstance._id = new ObjectId(newInstance._id)
        newInstances.push(newInstance);
    });
    if(isArray)
        return newInstances;
    return newInstances[0];
}

module.exports.assign = assign;