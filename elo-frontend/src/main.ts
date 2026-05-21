import { bootstrapApplication } from '@angular/platform-browser';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { appConfig } from './app/app.config';
import { graphqlConfig } from './app/graphql.config';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    ...(appConfig.providers ?? []),
    ...(graphqlConfig.providers ?? []),
    provideCharts(withDefaultRegisterables()),
  ],
}).catch((err) => console.error(err));
