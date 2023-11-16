import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopyInputComponent } from 'src/app/shared/components/copy-input/copy-input.component';
import { RefreshButtonComponent } from 'src/app/shared/components/refresh-button/refresh-button.component';
import { MatListModule } from '@angular/material/list';
import { Email } from 'src/app/shared/@types/email';
import { MatDividerModule } from '@angular/material/divider';
import { SessionService } from 'src/app/core/services/session.service';
import { EmailService } from 'src/app/core/services/email.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CopyInputComponent,
    RefreshButtonComponent,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  public emailInView!: Email;
  public emailSession: string = 'exemplo@exemplo.com';
  public inBox: Email[] = [];
  public secondsToRefresh: number = 15;

  constructor(private session: SessionService, private email: EmailService) {}

  public emailByUrl(index: number, email: Email) {
    return email.downloadUrl;
  }

  public ngOnInit(): void {
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
        this.getEmails();
      }
    }, 1000);
  }

  public initSession() {
    this.email.initSession().subscribe((email) => {
      this.emailSession = email;
      this.getEmails();
    });
  }

  private getEmails() {
    this.email.getEmails().subscribe((emails) => {
      console.log(emails);
      this.inBox = emails;
    });
  }

  public refresh() {
    this.secondsToRefresh = 15;
    this.getEmails();
  }

  public selectEmail(email: Email) {
    this.emailInView = email;
  }
}
