import { Component, inject } from '@angular/core';
import { ConfirmService } from './confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    @if (confirm.demande(); as d) {
      <div class="voile" (click)="confirm.repondre(false)">
        <div class="dialogue" [class.danger]="d.danger" (click)="$event.stopPropagation()">

          <div class="icone" [class.danger]="d.danger">
            {{ d.danger ? '!' : '?' }}
          </div>

          <h3>{{ d.titre }}</h3>
          <p>{{ d.message }}</p>

          <div class="actions">
            <button class="btn-annuler" (click)="confirm.repondre(false)">
              {{ d.texteAnnuler }}
            </button>
            <button
              class="btn-confirmer"
              [class.danger]="d.danger"
              (click)="confirm.repondre(true)">
              {{ d.texteConfirmer }}
            </button>
          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    .voile {
      position: fixed;
      inset: 0;
      z-index: 9998;
      background: rgba(26, 29, 35, 0.45);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: voile-in .2s ease;
    }
    @keyframes voile-in { from { opacity: 0; } to { opacity: 1; } }
    .dialogue {
      width: 100%;
      max-width: 420px;
      background: var(--surface);
      border-radius: 16px;
      padding: 28px 26px 22px;
      text-align: center;
      box-shadow: 0 24px 60px rgba(26, 29, 35, 0.24);
      animation: dialogue-in .25s cubic-bezier(.16,1,.3,1);
    }
    @keyframes dialogue-in {
      from { opacity: 0; transform: translateY(16px) scale(.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .icone {
      width: 52px;
      height: 52px;
      margin: 0 auto 16px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      font-size: 26px;
      font-weight: 700;
      background: var(--bleu-fond);
      color: var(--bleu);
    }
    .icone.danger { background: var(--rouge-fond); color: var(--rouge-afb); }
    h3 { margin: 0 0 8px; font-size: 19px; color: var(--noir); }
    p { margin: 0 0 24px; font-size: 14px; line-height: 1.55; color: var(--gris-texte); }
    .actions { display: flex; gap: 12px; }
    .actions button {
      flex: 1;
      padding: 12px 18px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all .15s ease;
    }
    .btn-annuler {
      background: var(--surface);
      border: 1.5px solid var(--gris-bordure);
      color: var(--noir);
    }
    .btn-annuler:hover { background: var(--gris-clair); }
    .btn-confirmer {
      border: none;
      background: var(--bleu);
      color: #FFFFFF;
    }
    .btn-confirmer:hover { background: #1A5FCC; transform: translateY(-1px); }
    .btn-confirmer.danger { background: var(--rouge-afb); }
    .btn-confirmer.danger:hover { background: var(--rouge-fonce); }
    .btn-confirmer:active { transform: translateY(0); }
    @media (max-width: 460px) {
      .actions { flex-direction: column-reverse; }
    }
  `]
})
export class ConfirmDialogComponent {
  readonly confirm = inject(ConfirmService);
}