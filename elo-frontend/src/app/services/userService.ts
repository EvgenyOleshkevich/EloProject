import { computed, inject, Injectable, signal } from '@angular/core';
import { LOGIN, GET_USERS } from '../queries/queries';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { User } from '../model/user.model';
import { AuthPayload } from '../model/authPayload';
import { LoginInput } from '../model/inputs/loginInput';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apollo = inject(Apollo);
  token = signal<string | null>(null);
  user = signal<User | null>(null);

  getUsers(): Observable<User[]> {
      return this.apollo
        .watchQuery<{ users: User[] }>({
          query: GET_USERS,
        })
        .valueChanges.pipe(
          map((result) =>
            result.dataState === 'complete' ? result.data.users : []
          )
        );
  }

  login(email: string, password: string): Observable<AuthPayload | null> {
    const input:LoginInput = {
      email: email,
      password: password
    }
    return this.apollo.mutate<{ login: AuthPayload | null }>({
      mutation: LOGIN,
      variables: { input },
      fetchPolicy: 'no-cache',
    }).pipe(
      map(({ data }) => data?.login ?? null),
      tap((authPayload) => {
        console.error(authPayload);
        if (authPayload) {
          this.token.set(authPayload.token);
          this.user.set(authPayload.user);
          localStorage.setItem('token', authPayload.token);
        }
      }),
      catchError((err) => {
        console.error(err);
        return of(null);
      })
    );
  }

  logout() {
    this.token.set(null);
    this.user.set(null);
    localStorage.removeItem('token');
  }

  isLoggedIn = computed(() => !!this.token());

}
