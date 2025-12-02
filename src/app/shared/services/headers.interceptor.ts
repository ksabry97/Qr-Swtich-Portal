import {
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, map, of, switchMap, throwError } from 'rxjs';
import { GlobalService } from './global.service';
import {
  rsaDecryptWithPrivateKey,
  rsaEncryptWithPublicKey,
} from '../../utils/rsa-crypto';
import { environment } from '../../../environments/environment';

const { rsaPublicKey, rsaPrivateKey } = environment;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const lang = localStorage.getItem('lang') ?? '';
  const router = inject(Router);
  const globalServ = inject(GlobalService);
  const isIdentityLoginEndpoint =
    req.url.includes('/identity/PreLoginEndpointEncyrption') ||
    req.url.includes('/identity/VerifyOtpEndpointEncyrption') ||
    req.url.includes('https://gimuat.gimpay.org:6033');

  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Accept-Language': lang,
          'Content-Type': 'text/plain',
          ...(isIdentityLoginEndpoint ? {} : { 'X-HyperText': 'true' }),
        },
      })
    : req.clone({
        setHeaders: {
          'Accept-Language': lang,
          ...(isIdentityLoginEndpoint ? {} : { 'X-HyperText': 'true' }),
        },
      });

  return from(applyEncryption(authReq)).pipe(
    switchMap((securedReq) =>
      next(securedReq).pipe(
        switchMap((event) => decryptResponse(event, securedReq)),
        catchError((error) => {
          if ((error.status === 401 || error.status === 403) && token) {
            router.navigateByUrl('/login');
            localStorage.clear();
            globalServ.setModal(false);
          }

          return throwError(() => error);
        })
      )
    )
  );
};

async function applyEncryption(
  req: HttpRequest<any>
): Promise<HttpRequest<any>> {
  const bypassEncryption =
    !req.headers.has('X-HyperText') ||
    req.params.has('skipEncryption') ||
    !isEncryptableBody(req.body) ||
    req.body?.body ||
    !environment.hyperText ||
    !rsaPublicKey;
  if (bypassEncryption) return req;

  try {
    const body = await rsaEncryptWithPublicKey(req.body, rsaPublicKey);
    return req.clone({
      body: { body },
    });
  } catch (error) {
    console.warn('Failed to encrypt request payload, sending raw body', error);
    return req;
  }
}

function decryptResponse(event: any, req: HttpRequest<any>) {
  if (
    !(event instanceof HttpResponse) ||
    !rsaPrivateKey ||
    !environment.hyperText
  ) {
    return of(event);
  }

  const cipherPayload = extractCipherText(event.body);

  if (!cipherPayload) {
    return of(event);
  }

  const isTextResponse = req.responseType === 'text';

  return from(rsaDecryptWithPrivateKey(cipherPayload, rsaPrivateKey)).pipe(
    map((decrypted) => {
      // If responseType is 'text', Angular expects a string, so stringify the decrypted object
      const body = isTextResponse ? JSON.stringify(decrypted) : decrypted;
      return event.clone({ body });
    }),
    catchError(() => of(event))
  );
}

function extractCipherText(body: any): string | null {
  if (!body) return null;
  // if (typeof body === 'string') return body;
  if (typeof body?.body === 'string') return body.body;
  return null;
}

function isEncryptableBody(body: any): boolean {
  if (!body) return false;
  if (body instanceof FormData) return false;
  if (body instanceof ArrayBuffer) return false;
  if (ArrayBuffer.isView(body)) return false;
  if (body instanceof Blob) return false;
  return true;
}
