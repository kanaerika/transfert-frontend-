import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivationService {

  private api = environment.apiUrl + '/api/invitation';

  constructor(private http: HttpClient) {}

  verifierToken(token: string): Observable<any> {
    return this.http.get(`${this.api}/${token}`);
  }

  activerCompte(token: string, motDePasse: string): Observable<any> {
    return this.http.post(`${this.api}/activer`, {
      token,
      motDePasse
    });
  }
}