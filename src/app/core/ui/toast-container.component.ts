import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastType } from './toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pile-toasts" aria-live="polite">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast" [class]="'toast-' + t.type" role="status">
          <span class="icone">{{ icone(t.type) }}</span>
          <div class="corps">
            @if (t.titre) { <strong class="titre">{{ t.titre }}</strong> }
            <span class="message">{{ t.message }}</span>
          </div>
          <button class="fermer" (click)="toast.fermer(t.id)" aria-label="Fermer">×</button>
          <span class="barre-temps"></span>
        </div>
      }
    </div>
  `,
  styles: [`
    .pile-toasts {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 380px;
      pointer-events: none;
    }
    .toast {
      position: relative;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: var(--surface);
      border-radius: 12px;
      padding: 14px 16px;
      box-shadow: 0 12px 32px rgba(26, 29, 35, 0.16);
      border-left: 4px solid var(--bordure);
      overflow: hidden;
      pointer-events: auto;
      animation: entree .3s cubic-bezier(.16,1,.3,1);
    }
    @keyframes entree {
      from { opacity: 0; transform: translateX(40px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .toast-succes        { border-left-color: var(--vert); }
    .toast-erreur        { border-left-color: var(--rouge-afb); }
    .toast-avertissement { border-left-color: var(--orange); }
    .toast-info          { border-left-color: var(--bleu); }
    .icone {
      flex: none;
      width: 24px;
      height: 24px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      font-size: 14px;
      font-weight: 700;
      color: #FFFFFF;
    }
    .toast-succes .icone        { background: var(--vert); }
    .toast-erreur .icone        { background: var(--rouge-afb); }
    .toast-avertissement .icone { background: var(--orange); }
    .toast-info .icone          { background: var(--bleu); }
    .corps { display: flex; flex-direction: column; gap: 2px; flex: 1; }
    .titre { font-size: 13.5px; color: var(--texte); }
    .message { font-size: 13px; color: var(--gris-texte); line-height: 1.45; }
    .fermer {
      flex: none;
      background: none;
      border: none;
      font-size: 20px;
      line-height: 1;
      color: var(--texte-faible);
      cursor: pointer;
      padding: 0 2px;
    }
    .fermer:hover { color: var(--texte); }
    .barre-temps {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      width: 100%;
      transform-origin: left;
      animation: ecoulement 4s linear forwards;
      opacity: .5;
    }
    .toast-succes .barre-temps        { background: var(--vert); }
    .toast-erreur .barre-temps        { background: var(--rouge-afb); }
    .toast-avertissement .barre-temps { background: var(--orange); }
    .toast-info .barre-temps          { background: var(--bleu); }
    @keyframes ecoulement { to { transform: scaleX(0); } }
    @media (max-width: 480px) {
      .pile-toasts { left: 14px; right: 14px; max-width: none; }
    }
  `]
})
export class ToastContainerComponent {
  readonly toast = inject(ToastService);

  icone(type: ToastType): string {
    switch (type) {
      case 'succes': return '✓';
      case 'erreur': return '×';
      case 'avertissement': return '!';
      default: return 'i';
    }
  }
}