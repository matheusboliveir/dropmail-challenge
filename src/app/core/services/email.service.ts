import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map, of, tap } from 'rxjs';
import { SessionService } from './session.service';
import { EmailResponse, SessionResponse } from 'src/app/shared/@types/response';
import { Email } from 'src/app/shared/@types/email';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private apollo: Apollo, private session: SessionService) {}

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
            return response.data?.introduceSession.addresses[0].address;
          }
          return '';
        })
      );
  }

  public getEmails(): Observable<Email[]> {
    const id = this.session.getSessionId();
    if (!id) throw new Error('invalid session');
    return this.apollo
      .watchQuery<EmailResponse>({
        query: gql`
          query ($id: ID!) {
            session(id: $id) {
              mails {
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
      })
      .valueChanges.pipe(map(({ data }) => data.session.mails));
  }
}
