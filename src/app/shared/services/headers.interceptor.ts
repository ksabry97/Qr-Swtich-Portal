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
import {
  decryptBackendResponse,
  encryptBackendRequest,
} from '../../utils/aes-decryptor';
import { environment } from '../../../environments/environment';

const { rsaPublicKey, rsaPrivateKey } = environment;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const lang = localStorage.getItem('lang') ?? '';
  const router = inject(Router);
  const globalServ = inject(GlobalService);
  const authReq = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}`, acceptLanguage: lang },
      })
    : req;

  return from(applyEncryption(authReq)).pipe(
    switchMap((securedReq) =>
      next(securedReq).pipe(
        switchMap((event) => decryptResponse(event)),
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
    req.headers.has('x-bypass-encryption') ||
    req.params.has('skipEncryption') ||
    !isEncryptableBody(req.body) ||
    req.body?.cipherText ||
    !rsaPublicKey;
  if (bypassEncryption) return req;

  try {
    const { cipherText, encryptedKey } = await buildHybridPayload(req.body);
    return req.clone({
      body: { cipherText, encryptedKey },
    });
  } catch (error) {
    console.warn('Failed to encrypt request payload, sending raw body', error);
    return req;
  }
}

function decryptResponse(event: any) {
  if (!(event instanceof HttpResponse) || !rsaPrivateKey) {
    return of(event);
  }

  const hybridPayload = extractHybridPayload(event.body);
  if (!hybridPayload) {
    return of(event);
  }

  return from(decryptHybridPayload(hybridPayload)).pipe(
    map((decrypted) => event.clone({ body: decrypted })),
    catchError(() => of(event))
  );
}

function isEncryptableBody(body: any): boolean {
  if (!body) return false;
  if (body instanceof FormData) return false;
  if (body instanceof ArrayBuffer) return false;
  if (ArrayBuffer.isView(body)) return false;
  if (body instanceof Blob) return false;
  return true;
}

type HybridPayload = { cipherText: string; encryptedKey: string };

async function buildHybridPayload(body: any): Promise<HybridPayload> {
  const aesKey = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  const rawKey = await crypto.subtle.exportKey('raw', aesKey);
  const aesKeyBase64 = arrayBufferToBase64(rawKey);

  const cipherText = await encryptBackendRequest(body, aesKeyBase64);
  const encryptedKey = await rsaEncryptWithPublicKey(aesKeyBase64, rsaPublicKey);

  return { cipherText, encryptedKey };
}

function extractHybridPayload(body: any): HybridPayload | null {
  if (
    body &&
    typeof body === 'object' &&
    typeof body.cipherText === 'string' &&
    typeof body.encryptedKey === 'string'
  ) {
    return {
      cipherText: body.cipherText,
      encryptedKey: body.encryptedKey,
    };
  }
  return null;
}

async function decryptHybridPayload(payload: HybridPayload): Promise<any> {
  const aesKeyBase64 = await rsaDecryptWithPrivateKey(
    payload.encryptedKey,
    rsaPrivateKey
  );
  if (typeof aesKeyBase64 !== 'string') {
    throw new Error('Invalid AES key returned from RSA decrypt');
  }

  return decryptBackendResponse(payload.cipherText, aesKeyBase64);
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
