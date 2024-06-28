
// Import nodemailer module
const nodemailer = require('nodemailer');



// Configurer le transporteur SMTP
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE,
    auth: {
    user: process.env.MAIL_AUTH_USER,
    pass: process.env.MAIL_AUTH_PWD,
    }
});



/**
 * 
 * Function for activation email sending
 * 
 * @param {*} email 
 * @param {*} activationLink 
 * @returns 
 */
export const sendActivationEmail = (email: string, activationLink: string) => {

    // Return a promise to manage the success or failure of the email sending
    return new Promise((resolve, reject) => {

        // Content of the email Options
        const mailOptions = {
            from: 'contact@thomas-bressel.com',
            to: email,
            subject: 'ASMtariSTe : Activation de compte',
            html: `
            Bonjour chez Atarien(ne) !<br>
            <br>
            Tu as donc décidé de nous rejoindre pour apprendre l'assembleur sur Atari ST ? Mais c'est une excellente nouvelle !<br>
            Si tu travailles bien tu pourras même gagner des certificats de compétences Atarien (certes ils sont bidons, mais j'ai trouvé l'idée marrante !).<br>
            <br>
            Pour activer ton compte, clique sur le lien suivant : <a href="${activationLink}">${activationLink}</a>
            <br>
            (Dépêche-toi, le lien n'est valable que 10 minutes !)
            <br>
            A bientôt sur le site !<br>
            <br>
            L'équipe ASMtariSTe (ou plutôt moi tout seul, mais ça fait plus sérieux de dire "l'équipe" !)
            `
        };

        // Send the email with transporter
        transporter.sendMail(mailOptions, (error: Error, info: string) => {

            // If mail sending error the promise will return a reject
            if (error) {
                reject(error);
            }
            // If mail sending success the promise will return a resolve
            else {
                resolve(info);
            }
        });
    });
};