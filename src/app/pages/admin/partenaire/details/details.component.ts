import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PartenaireService } from '../../../../services/partenaire.service';
import { Partenaire } from '../../../../models/models';

@Component({
  selector: 'app-details-partenaire',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(PartenaireService);

  id!: string;
  partenaire: Partenaire | null = null;
  chargement = true;
  erreur = '';

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.service.getById(this.id).subscribe({
      next: p => { this.partenaire = p; this.chargement = false; },
      error: (err) => {
        this.chargement = false;
        this.erreur = err.status === 404
          ? 'Partenaire introuvable.'
          : (err?.error?.message ?? 'Impossible de charger ce partenaire.');
      }
    });
  }

  retour(): void {
    this.router.navigate(['/admin/partenaires']);
  }
}
