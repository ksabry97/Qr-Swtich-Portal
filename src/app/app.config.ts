import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import { authInterceptor } from './shared/services/headers.interceptor';
import { NgxEchartsModule } from 'ngx-echarts';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import {
  TRANSLATE_HTTP_LOADER_CONFIG,
  TranslateHttpLoader,
} from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
// Create array of all icons
const icons: IconDefinition[] = Object.keys(AllIcons).map(
  (key) => (AllIcons as any)[key]
);
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),

    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    importProvidersFrom(
      NgxEchartsModule.forRoot({
        echarts: () => import('echarts'),
      })
    ),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
      NzModalModule
    ),
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: {
        prefix: './assets/i18n/',
        suffix: '.json',
      },
    },
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_ICONS, useValue: icons },
  ],
};
export function HttpLoaderFactory() {
  return new TranslateHttpLoader();
}
registerLocaleData(en);
