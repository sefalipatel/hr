export enum ConfigType {
    SMTP = "SMTP",
    SENDGRID = "SendGrid",
    ZEPTO = "Zepto",
    TWILIO = "Twillio"
}

export interface data {
    value: string;
    type: string
}