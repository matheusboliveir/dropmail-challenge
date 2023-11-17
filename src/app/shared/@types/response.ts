import { Email, Session } from './email';

export type SessionResponse = { introduceSession: Session };

export type EmailResponse = {
  expiredAt: string;
  session: { mails: Email[] };
};

export type ErrorResponse = {
  path: string[];
  message: string;
  extensions: {
    code: string;
  };
};
