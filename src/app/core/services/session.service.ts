import { Injectable } from '@angular/core';
import { Session } from 'src/app/shared/@types/email';

const KEY: string = 'dropmail-session';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor() {}

  public hasSession(): boolean {
    return !!this.getSession();
  }

  public setSession(session: Session): void {
    window.sessionStorage.setItem(KEY, JSON.stringify(session));
  }

  public getSession(): Session | null {
    let session!: Session | null;
    try {
      session = JSON.parse(window.sessionStorage.getItem(KEY) || '') as Session;
    } catch (error) {
      session = null;
    }
    return session;
  }

  public getSessionId(): string | null {
    return this.getSession()?.id || null;
  }

  public remoseSession(): void {
    window.sessionStorage.clear();
  }
}
