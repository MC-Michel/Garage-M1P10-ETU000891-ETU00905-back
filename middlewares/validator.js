class Callable extends Function {
    constructor() {
      super('...args', 'return this._bound._call(...args)') 
      this._bound = this.bind(this)
      return this._bound
    }
    
    _call(...args) {
      console.log(this, args)
    }
  }

class Validator extends Callable{

    constructor(target, selector){
        super();
        this.target = target;
        this.selector = selector;
        this.filters = [];
        this.exists();
    }

    static getValueInObjectBySelector(target, selector){ 
        const splitedSelector = selector.split('.');
        const ans = splitedSelector.reduce((previous, next) => {
            if(previous.target === undefined || previous.target === null ) return {previousSelector: next};
            if(next === '*' && Array.isArray(previous.target)) {
                let ans = [];
                previous.target.map(elmt => ans = ans.concat(elmt))
                return {target: ans, previousSelector: next};
            }
            else if(next === '*') return {previousSelector: next};
            if(Array.isArray(previous.target)){
                let ans = [];
                previous.target.map(elmt => ans.push(Validator.getValueInObjectBySelector(elmt, next)));
                return {target: ans, previousSelector : next}
            }
            return {target: previous.target[next], previousSelector: next};
        },{target, previousSelector : ''})
        return ans;
    }
    static sanitizeValueInObjectBySelector(target, selector, sanitizer){ 
        const splitedSelector = selector.split('.');
        let settingArray = false;
        let selectorToSet = splitedSelector.pop();
        if(selectorToSet === '*'){
            settingArray = true;
            selectorToSet = splitedSelector.pop();
        }
        const objectToSet = splitedSelector.reduce((previous, next) => {
            if(previous.target === undefined || previous.target === null ) return {previousSelector: next};
            if(next === '*' && Array.isArray(previous.target)) {
                let ans = [];
                previous.target.map(elmt => ans = ans.concat(elmt))
                return {target: ans, previousSelector: next};
            }
            else if(next === '*') return {previousSelector: next};
            if(Array.isArray(previous.target)){
                let ans = [];
                previous.target.map(elmt => ans.push(Validator.getValueInObjectBySelector(elmt, next)));
                return {target: ans, previousSelector : next}
            }
            return {target: previous.target[next], previousSelector: next};
        },{target, previousSelector : ''})
        if(objectToSet.target === undefined) return;
        if(settingArray){
            objectToSet.target.map(elmt => {
                if(Array.isArray(elmt[selectorToSet])){
                    elmt[selectorToSet] = elmt[selectorToSet].map(e =>sanitizer(e));
                }
            })
        }else {
            if(Array.isArray(objectToSet.target)){
                objectToSet.target.map(e=> e[selectorToSet] = sanitizer( e[selectorToSet]))
            }else
            objectToSet.target[selectorToSet] = sanitizer(objectToSet.target[selectorToSet]);
        } 
    }

    getValueBySelector(req){
        return Validator.getValueInObjectBySelector(req[this.target], this.selector)
    }
 
    addMethod(methodName){
        this.filters.push({method: this[methodName]});
        return this;
    }
    withMessage(message){
        if (this.filters.length !== 0) 
            this.filters[this.filters.length - 1].message = message; 
        return this;
    }

    _call(req, res, next){
        for(let filter of this.filters){
            const isOk = filter.method.call(this, req);
            if(!isOk){
                const message = filter.message ? filter.message : this.selector + ' invalide';
                res.status(422).json({message});
                return false;
            }
        }
        next();
    }

    //Validation methods
    exists(){
        const method = (req) =>{
            const value= this.getValueBySelector(req)
            if(value !== null && value !== undefined)
                return true;
            return false;
        }
        this.addMethod(method);
    }

    isString(){
        const method = (req) =>{
            const value= this.getValueBySelector(req)
            if(Array.isArray(value)){
                for(let str of value){
                    if(typeof(str) !== 'string')
                        return false;
                }
                return true
            }
            if(typeof(str) === 'string')
                return true;
            return false;
        }
        this.addMethod(method);
    }


    //Sanitization methods
    //Here
}

module.exports.body = (key) => new Validator('body', key);