import nodemailer from 'nodemailer';
import config from "../config.js";
const { mailer } = config;

const transporter = nodemailer.createTransport({
    host: "mail.corporacioncofar.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: mailer.user, // generated ethereal user
        pass: mailer.password, // generated ethereal password
    },
});

transporter.verify().then(function () {
    console.log('Ready for send emails.');
});

export const sendMail = async function (to, subject, text, html='') {
    let info = await transporter.sendMail({
        from: '"Automatización" <notificacion-automatizacion@corporacioncofar.com>', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
    });
    return info;
};


