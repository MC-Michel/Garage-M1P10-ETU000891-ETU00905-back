const fs = require('fs');
const pdf = require('html-pdf');
var path = require('path');
var getEnv = require('./../commons/functions/get-env');
const GenRepository = require('../commons/database/class/gen-repository');
const { formatAndTrunc } = require('../commons/functions/gen-date');
const CustomError = require('../errors/custom-error');
const RepairHistoric = require('../models/repair-historic.model');
const User = require('../models/user.model');
const CarRepository = require('../repositories/car.repo');
const { flattenObject } = require('../commons/functions/flatten-object');

const invoiceTemplatePath = path.join(__dirname,'..', 'templates', 'invoice.html');
const repairHistoryRepository = new GenRepository(RepairHistoric)
const carRepository = new CarRepository();
const userRepository = new GenRepository(User);
module.exports = class PdfService {

    static async readFile(path){
        return  new Promise((resolve, reject)=>{
            fs.readFile(path, 'utf8', (err, data)=> {
                if(err) return reject(err);
                resolve(data)
            })
        });
    }
    static async  createPdf(fileContent){
        return new Promise((resolve, reject)=>{
            var options = { format: 'Letter' };
            pdf.create(fileContent, options).toStream(function(err, res) {
                if (err) return reject(err);
                resolve(res)
            });
        })
    }
    static async mapTemplateData(templateContent, data){
        data = flattenObject(data);
        for(let key in data){
            templateContent = templateContent.replaceAll(`{{${key}}}`, data[key]);
        }
        return templateContent;
    }
    static generateReparationElmtsData(repairElmts){
        let html = '';
        let total = 0;
        
        repairElmts.map(elmt=>{
            html += `
                <tr>
                    <td>${elmt.label}</td>
                    <td>${elmt.description}</td>
                    <td>Ar ${elmt.price}</td> 
                </tr>
            `
        })
        let tvaRate = +getEnv('TVA_RATE');
        let tva = tvaRate * total/100;
        let ttc = tva+total;
        return {html,tvaRate, tva, ttc};
    }
    static async generateInvoice(repairId){
        let repair = repairHistoryRepository.findById(repairId);
        if(repair == null) repair = carRepository.findCurrentRepair(repairId);
        if (repair == null) throw new CustomError(`Aucune reparation correspondant a l'id ${repairId}`);
        let car = carRepository.findById(repair.carId);
        let user = userRepository.findById(car.userId);
        repair.receptionDate = formatAndTrunc(repair.receptionDate);

        let fileContent = await PdfService.readFile(invoiceTemplatePath);
        fileContent = this.mapTemplateData(fileContent, {
            repair, car, user,
            reparationElmtsDada: PdfService.generateReparationElmtsData(repair.repairs.ended)
        });
        let stream = await PdfService.createPdf(fileContent);

        return stream;

    }
}

     