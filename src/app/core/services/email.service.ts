import { Injectable, OnDestroy } from '@angular/core';
import { Apollo, Query, QueryRef, gql } from 'apollo-angular';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { SessionService } from './session.service';
import { EmailResponse, SessionResponse } from 'src/app/shared/@types/response';
import { Email } from 'src/app/shared/@types/email';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private apollo: Apollo, private session: SessionService) {}

  private emailsQuery!: QueryRef<EmailResponse>;
  private timeToQuery!: number;

  public initSession(): Observable<string> {
    return this.apollo
      .mutate<SessionResponse>({
        mutation: gql`
          mutation {
            introduceSession {
              id
              expiresAt
              addresses {
                address
              }
            }
          }
        `,
      })
      .pipe(
        map((response) => {
          if (response.data) {
            this.session.setSession(response.data.introduceSession);
            if (this.emailsQuery) this.refetchEmails();
            return response.data?.introduceSession.addresses[0].address;
          }
          return '';
        })
      );
  }

  public getEmails(pollInterval: number): Observable<Email[]> {
    const id = this.session.getSession()?.id;
    this.timeToQuery = pollInterval;
    if (!id) throw new Error('invalid session');
    if (!this.emailsQuery) {
      this.emailsQuery = this.apollo.watchQuery<EmailResponse>({
        query: gql`
          query ($id: ID!) {
            session(id: $id) {
              expiresAt
              mails {
                id
                rawSize
                fromAddr
                toAddr
                html
                downloadUrl
                text
                headerSubject
              }
            }
          }
        `,
        variables: {
          id,
        },
        pollInterval,
      });
    }
    return this.emailsQuery.valueChanges.pipe(
      map(({ data }) => data.session.mails),
      tap({
        error: (error) => {
          if (error.message === 'session_not_found') {
            this.session.removeSession();
          }
        },
      })
    );
  }

  public refetchEmails(): void {
    const id = this.session.getSession()?.id;
    if (this.emailsQuery) {
      this.emailsQuery.refetch({ id }).then(() => {
        this.emailsQuery.stopPolling();
        this.emailsQuery.startPolling(this.timeToQuery);
      });
    } else {
      throw new Error('Email query is not initialized');
    }
  }
}
