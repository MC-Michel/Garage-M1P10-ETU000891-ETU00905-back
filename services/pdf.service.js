const fs = require('fs');
const pdf = require('html-pdf');
var path = require('path');

const invoiceTemplatePath = path.join(__dirname,'..', 'templates', 'invoice.html');
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

    static async generateInvoice(){
        let fileContent = await PdfService.readFile(invoiceTemplatePath);
        let stream = await PdfService.createPdf(fileContent);
        return stream;

    }
}

     