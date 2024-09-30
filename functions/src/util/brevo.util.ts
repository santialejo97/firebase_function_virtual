import * as brevo from "@getbrevo/brevo";
import "dotenv/config";
import { Message } from "../interfaces/main.interfaces";

export const sendEmail = async (message: Message) => {
  console.log("Enviando correo");
  const token: string = process.env.BREVO_API_TOKEN as string;
  const apiInstance = new brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, token);
  message.sender = {
    name: "Santiago",
    email: "gaviriasantiago1997@gmail.com",
  };
  const smtpEmail = new brevo.SendSmtpEmail();
  smtpEmail.subject = "Test";
  smtpEmail.htmlContent = `<html><body>Correo enviado</body></body>`;
  smtpEmail.sender = message.sender;
  smtpEmail.to = [
    {
      name: "Santiago Gaviria",
      email: "santi20alejo@hotmail.com",
    },
  ];
  apiInstance.sendTransacEmail(smtpEmail);
};
