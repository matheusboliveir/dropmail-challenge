import { Email, Session } from './email';

export type SessionResponse = { introduceSession: Session };

export type EmailResponse = {
  session: { mails: Email[] };
};

export type ErrorResponse = {
  path: string[];
  message: string;
  extensions: {
    code: string;
  };
};
