const { body } = require("express-validator");
const md5 = require("md5");
const Customer = require("./customer.submodel");

class User {
    static collection = "User";
    static schema = {
        "firstName": {
            type: 'string', 
            validatorGetter: (paramPropertyName='firstName')=> 
                body(paramPropertyName).isString().withMessage("Prenom invalide")
        },
        "lastName": {
            type: 'string', 
            validatorGetter: (paramPropertyName='lastName')=> 
                body(paramPropertyName).isString().withMessage("Nom invalide")
        },
        "password":  {
            type: 'string', 
            validatorGetter: (paramPropertyName='password')=> 
                body(paramPropertyName).isString().withMessage("Mot de passe invalide").customSanitizer(elmt => md5(elmt))
        },
        "email": {
            type: 'string', 
            validatorGetter: (paramPropertyName='email')=> 
                body(paramPropertyName).isEmail().withMessage("Email invalide").customSanitizer(elmt => elmt.replaceAll(' ', ''))
        },
        "roleId": {
            type: 'int'
        },
        "customerData": {
            classConstructor: Customer
        }
    }
    static createSchemaDto = (()=> {
        const ans = { ...User.schema,
            "confirmPassword":  {
                type: 'string', 
                validatorGetter: (paramPropertyName='confirmPassword')=> 
                    body(paramPropertyName).isString().withMessage("Confirmation de mot de passe invalide").customSanitizer(elmt => md5(elmt))
            }
        };
        delete ans.role;
        return ans;
    } )()
    static updateSchemaDto = {...this.schema}
    static loginSchemaDto = {
        "email": {
            type: 'string', 
            validatorGetter: (paramPropertyName='email')=> 
                body(paramPropertyName).isEmail().withMessage("Email invalide")
        },
        "password":  {
            type: 'string', 
            validatorGetter: (paramPropertyName='password')=> 
                body(paramPropertyName).isString().withMessage("Mot de passe invalide")
        },
    }
    static canAccessDto = {
        "roleIds":  {
            type: 'array', 
            validatorGetter: (paramPropertyName='roleId')=> 
                body(paramPropertyName).isArray().withMessage("roleId invalide")
        },
    }
}
module.exports = User;