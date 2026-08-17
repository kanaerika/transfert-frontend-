import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Adaptez si vous avez un fichier environment.ts :
import { environment } from '../../environment/environment';
const API_URL = `${environment.apiUrl}/auth`;

export interface MessageResponse {
  message: string;
}

@Injectable({ providedIn: 'root' })
export class PasswordResetService {

  constructor(private readonly http: HttpClient) {}

  /** Étape 1 : demande l'envoi du code OTP par SMS */
  forgotPassword(telephone: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${API_URL}/forgot-password`, { telephone });
  }

  /** Étape 2 : vérifie le code OTP */
  verifyOtp(telephone: string, code: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${API_URL}/verify-otp`, { telephone, code });
  }

  /** Étape 3 : réinitialise le mot de passe */
  resetPassword(telephone: string, code: string,
                nouveauMotDePasse: string,
                confirmationMotDePasse: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${API_URL}/reset-password`, {
      telephone, code, nouveauMotDePasse, confirmationMotDePasse
    });
  }
}
