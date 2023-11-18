import {
  Notification,
  NotificationService,
} from './../../services/notification.service';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopyInputComponent } from 'src/app/shared/components/copy-input/copy-input.component';
import { RefreshButtonComponent } from 'src/app/shared/components/refresh-button/refresh-button.component';
import { MatListModule } from '@angular/material/list';
import { Email } from 'src/app/shared/@types/email';
import { MatDividerModule } from '@angular/material/divider';
import { SessionService } from 'src/app/core/services/session.service';
import { EmailService } from 'src/app/core/services/email.service';
import { Subscription } from 'rxjs';
import { BreakpointObserver, LayoutModule } from '@angular/cdk/layout';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CopyInputComponent,
    RefreshButtonComponent,
    MatListModule,
    MatDividerModule,
    LayoutModule,
    MatExpansionModule,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  public emailInView!: Email;
  public emailSession: string = '';
  public inBox: Email[] = [];
  public secondsToRefresh: number = 15;
  private emailSubscription!: Subscription;
  private sessionSubscription!: Subscription;
  private layoutSubscription!: Subscription;
  private tabFocus: boolean = true;
  public mobileLayout: boolean = false;
  public sessionExpired: boolean = false;

  constructor(
    private session: SessionService,
    private email: EmailService,
    private breackpoint: BreakpointObserver,
    private notification: NotificationService
  ) {}

  public emailById(index: number, email: Email) {
    return email.id;
  }

  public ngOnInit(): void {
    this.layoutSubscription = this.breackpoint
      .observe(['(max-width: 768px)'])
      .subscribe((result) => {
        this.mobileLayout = result.matches;
      });
    let session = this.session.getSession();
    if (session) {
      this.emailSession = session.addresses[0].address;
      this.getEmails();
    } else {
      this.initSession();
    }
    setInterval(() => {
      if (this.secondsToRefresh > 0) {
        this.secondsToRefresh--;
      } else {
        this.secondsToRefresh = 15;
      }
    }, 1000);
  }

  @HostListener('window:focus', ['$event'])
  onFocus(event: FocusEvent): void {
    this.tabFocus = true;
  }

  @HostListener('window:blur', ['$event'])
  onBlur(event: FocusEvent): void {
    this.tabFocus = false;
  }

  public trySubscribeToPush() {
    this.notification.requestPermission();
  }

  public initSession() {
    if (this.sessionSubscription) {
      this.sessionSubscription.unsubscribe();
      this.emailSubscription.unsubscribe();
    }
    this.sessionSubscription = this.email.initSession().subscribe((email) => {
      this.emailSession = email;
      this.inBox = [];
      this.getEmails();
    });
  }

  private getEmails(): void {
    this.emailSubscription = this.email.getEmails(15000).subscribe({
      next: (emails) => {
        this.notify(emails);
        this.inBox = emails;
        this.secondsToRefresh = 15;
      },
      error: (error) => {
        if (error.message === 'session_not_found') {
          alert(
            'Session expired: The session has expired, please get a new email, if you reload the page your current inbox will be lost'
          );
          this.sessionExpired = true;
        }
      },
    });
  }

  private notify(allEmails: Email[]) {
    if (!this.tabFocus) {
      const emails = [...allEmails];
      const emailsToNotify: Notification[] = [];
      while (emails.length > this.inBox.length) {
        const email = emails.shift();
        if (email)
          emailsToNotify.push({
            title: email.headerSubject,
            options: {
              body: email.fromAddr,
            },
          });
      }
      this.notification.generateNotification(emailsToNotify);
    }
  }

  public refresh() {
    this.secondsToRefresh = 15;
    this.email.refetchEmails();
  }

  public selectEmail(email: Email) {
    this.emailInView = email;
  }

  public ngOnDestroy(): void {
    this.emailSubscription.unsubscribe();
    this.sessionSubscription.unsubscribe();
    this.layoutSubscription.unsubscribe();
  }
}
