import nodemailer from 'nodemailer'
interface inputProps {
    name?: string,
    email?: string,
    code?: string
}
const sendEmail = async (body: inputProps) => {
    try {
        const emailOptions = {
            from: process.env.email,
            to: body.email,
            subject: "Email Verification",
            html: `<p>Hello <b>${body.name}</b>,</p>
                  <p>Please verify your email Id by entering below verification code to reset your <b>Talks Messanger</b> Password If this password was not send by you plzz ignore it and don't share it with anyone
                  <h3>Verification Code: ${body.code}</h3>`
        }
        const transport = nodemailer.createTransport({
            host: 'smpt.gmail.com',
            port: 465,
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        await transport.sendMail(emailOptions);

    } catch (error) {
        throw new Error("Email Not Send")
    }
}
export default sendEmail