export interface IEmailMessage {
  to: string;
  subject?: string;
  text?: string;
  html?: string;
  watchHtml?: string;
}

export interface IEmailSetting {
  email: string;
  protocol: string;
  host: string;
  userName: string;
  token: string;
}
