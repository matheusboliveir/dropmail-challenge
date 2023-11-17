import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

type Permission = 'denied' | 'granted' | 'default';

interface NotificationOptions {
  body?: string;
  icon?: string;
  tag?: string;
  data?: any;
  renotify?: boolean;
  silent?: boolean;
  sound?: string;
  noscreen?: boolean;
  sticky?: boolean;
  dir?: 'auto' | 'ltr' | 'rtl';
  lang?: string;
  vibrate?: number[];
}

export interface Notification {
  title: string;
  options?: NotificationOptions;
}

interface NotificationOservable {
  notification: Notification;
  event: Event;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public permission: Permission;

  constructor() {
    this.permission = this.isSupported() ? Notification.permission : 'denied';
  }

  public isSupported(): boolean {
    return 'Notification' in window;
  }

  public requestPermission(): void {
    if ('Notification' in window)
      Notification.requestPermission((status) => (this.permission = status));
  }

  private create({
    title,
    options,
  }: Notification): Observable<NotificationOservable> {
    return new Observable((obs) => {
      if (!('Notification' in window)) {
        obs.complete();
      }

      if (this.permission !== 'granted') {
        this.requestPermission();
        obs.complete();
      }
      let notification = new Notification(title, options);
      notification.addEventListener('show', (e) => {
        setTimeout(() => {
          notification.close();
        }, 6000);
        return obs.next({
          notification: notification,
          event: e,
        });
      });
      notification.addEventListener('click', (e) => {
        notification.close();
        window.focus();
        return obs.next({
          notification: notification,
          event: e,
        });
      });
      notification.addEventListener('error', (e) => {
        console.log(e);

        return obs.error({
          notification: notification,
          event: e,
        });
      });
      notification.addEventListener('close', () => {
        obs.complete();
      });
    });
  }

  public generateNotification(source: Array<Notification>): void {
    if (this.permission === 'granted') {
      for (let i = 0; i < source.length; i++) {
        const notification = source[i];
        setTimeout(() => {
          this.create(notification).subscribe((res) => {
            console.log(res);
          });
        }, i * 3000);
      }
    }
  }
}
