"use strict";

const env = require('../commons/functions/get-env');
const nodemailer = require("nodemailer");


module.exports = class MailerService{
    static option = {
        service : env('MAILER_SERVICE'),
        auth : {
            user : env('MAIL_USER'),
            pass : env('MAIL_PASS')
        }
    };

    static async sendMail(mail){        
        try {
            mail.from = env('SEND_FROM');
            const transporter = nodemailer.createTransport(MailerService.option);
            let info = await transporter.sendMail(mail);
            return {
                "statut" : 1,
                "message" : "Votre mail est bien envoyé",
                "info" : info
            };
        } catch (error) {
            return {
                "statut" : 0,
                "message" : "Votre mail n'est pas envoyé",
                "error" : error
            };
        }
    }
}