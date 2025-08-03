import { Injectable } from '@angular/core';
// @ts-ignore for some reason https://www.npmjs.com/package/keycloak-js says the package has no type definitions,
// but when accessing https://www.npmjs.com/package/@types/keycloak-js it says keycloak provides its own type definitions..
import Keycloak from "keycloak-js";

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  private _keycloak: Keycloak | undefined;

  constructor() { }

  get keycloak() {
    if (!this._keycloak) {
      this._keycloak = new Keycloak({
        url: 'http://localhost:9090',
        realm: 'whatsapp-clone',
        clientId: 'whatsapp-clone-app',
      })
    }
    return this._keycloak;
  }

  async init() {
    const authenticated: boolean = await this.keycloak.init({
      onLoad: 'login-required',
    });
  }

  async login(){
    await this.keycloak.login();
  }

  get userId() {
    return this.keycloak?.tokenParsed.sub as string;
  }

  get isTokenValid() {
    return !this.keycloak.isTokenExpired();
  }

  get fullName() {
    return this.keycloak.tokenParsed?.['name'] as string;
  }

  logout(): Promise<void> {
    return this.keycloak.logout({
      redirectUri: '/',
    });
  }

  accountManagement(): Promise<void> {
    return this.keycloak.accountManagement();
  }
}
