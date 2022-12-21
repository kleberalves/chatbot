import { BindingKey } from '@loopback/context';
import * as path from 'path';

import { Store } from '../models/store.model';

export namespace MailServiceBindings {
    export const SERVICE = BindingKey.create<MailService>(
        'services.mail',
    );
}

export class MailService {
    constructor() {
    }

    // tslint:disable-next-line:no-any
    async enviarErro(er: Error) {
        try {
            await this.send("Notificação de erro 😥", "kleber@kleberalves.com.br", "Erro", er.message + "\n" + er.stack, undefined);
        } catch (e) {
            if (e) console.log(e);
        }
    }

    async send(subject: string, emailTo: string, nome: string, message: string, store: Store | undefined) {
        const fs = require('fs');
        const nodemailer = require("nodemailer");

        let xml_string: string = fs.readFileSync(path.join(__dirname, "../../xml/mail.template.xml"), "utf8");

        let corFundo = "#141a24";
        let corBotaoPrimary = "#141a24";
        let corTitulo1 = "#f2f2f2";
        let logoUrl = "https://www.kleberalves.com.br/images/mail-topo.png";
        let siteUrl = "https://www.kleberalves.com.br/";
        let emailContato = '"Kleber Alves" <contato@kleberalves.com.br>';

        if (store) {

            subject = `${subject} :: ${store.name}`;

            if (store.logoUrl) {
                logoUrl = store.logoUrl;
            }
            if (store.siteUrl) {
                siteUrl = store.siteUrl;
            }

            if (store.mailContact) {
                emailContato = `Contato ${store.name} <contato@kleberalves.com.br>`
            }

            if (store.palette) {
                corFundo = store.palette.darkMuted;
                corBotaoPrimary = store.palette.darkMutedBlue;
                corTitulo1 = store.palette.lightVibrant;
            }
        }

        xml_string = xml_string.replace("$corpoBody", message);
        //
        //Troca as cores depois do append da mensagem que pode conter
        //objetos que precisam de replaces
        xml_string = xml_string.replace("$siteUrl", siteUrl);
        xml_string = xml_string.replace("$logoUrl", `${process.env.HOST}${logoUrl}`);
        xml_string = xml_string.replace("$corFundo", corFundo);
        xml_string = xml_string.replace("$corTitulo1", corTitulo1);

        xml_string = xml_string.replace("$corBotaoPrimary", corBotaoPrimary);
        xml_string = xml_string.replace("$nome", nome);

        let transporter = nodemailer.createTransport({
            host: "mail.kleberalves.com.br",
            port: 587,
            secure: false, // true for 465, false for other ports
            tls: {
                rejectUnauthorized: false
            },
            auth: {
                user: "contato@kleberalves.com.br", // generated ethereal user
                pass: process.env.SENHA_SMTP // generated ethereal password
            }
        });

        // send mail with defined transport object
        let response = await transporter.sendMail({
            from: emailContato, // sender address
            to: emailTo, // list of receivers
            subject: subject, // Subject line
            text: message, // plain text body
            html: xml_string // html body
        });

        console.log(response);

    }
}
