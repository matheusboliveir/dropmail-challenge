export interface Email {
  toAddr: string;
  id: string;
  text: string;
  rawSize: number;
  html: string;
  headerSubject: string;
  fromAddr: string;
  downloadUrl: string;
}

export interface Session {
  id: string;
  expiresAt: string;
  addresses: address[];
}

type address = { address: string };
