import { HttpInterceptorFn,HttpHeaders } from '@angular/common/http';
import {inject} from "@angular/core";
import {KeycloakService} from "../keycloak/keycloak.service";

export const keycloakHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloakService: KeycloakService = inject(keycloakHttpInterceptor);
  const token: string | undefined = keycloakService.keycloak.token;
  if (token) {
    const authReq = req.clone({
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      })
    });
    return next(authReq);
  }
  return next(req);
};
