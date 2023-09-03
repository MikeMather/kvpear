import sgMail, { MailDataRequired } from '@sendgrid/mail';

const API_KEY = process.env.SENDGRID_API_KEY as string;
if (!API_KEY) {
  throw new Error('SENDGRID_API_KEY is not defined');
}

sgMail.setApiKey(API_KEY)

export enum EmailTemplate {
  LOGIN_SIGNUP = 'd-0badb818d8ab41f1a18e4d538b239c45'
}

const EMAIL_FROM = "noreply@kvpear.dev";

export const sendEmailMessage = async ({ to, subject, templateId, context }: 
  { to: string, subject: string, templateId: EmailTemplate, context: any }) => {
    const msg: MailDataRequired = {
      to,
      from: EMAIL_FROM,
      subject,
      templateId: templateId,
      dynamicTemplateData: context
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error(error);
    }
};
