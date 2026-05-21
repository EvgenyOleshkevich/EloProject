import { ApplicationConfig, inject } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { HttpHeaders } from '@angular/common/http';
import { setContext } from '@apollo/client/link/context';

export const graphqlConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);


      const http = httpLink.create({
        uri: 'http://localhost:8080/graphql',
      });

      const auth = setContext((operation, context) => {
        const token = localStorage.getItem('token');

        if (!token) {
          return {};
        }

        return {
          headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
        };
      });

      return {
        link: auth.concat(http),
        cache: new InMemoryCache(),
      };

      // return {
      //   link: httpLink.create({
      //     uri: 'http://localhost:8080/graphql',
      //   }),
      //   cache: new InMemoryCache(),
      // };
    }),
  ],
};