function getPropertyNames(instance){
    return Object.getOwnPropertyNames(instance);
}
function assign(target, obj){
    getPropertyNames(target).map((key)=>{
        target[key] = obj[key]
    })
    return target;
}

function assign(){
    
}