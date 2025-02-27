import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { SitiosService, Sitio } from '../../services/sitios.service';
import { RankingLugaresComponent } from '../ranking-lugares/ranking-lugares.component';
import { ComentariosComponent } from '../comentarios/comentarios.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { PdfMakeWrapper, Txt, Img } from 'pdfmake-wrapper';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

PdfMakeWrapper.setFonts(pdfFonts);

@Component({
  selector: 'app-lista-sitios',
  standalone: true,
  imports: [CommonModule, MatCardModule,
    MatButtonModule, RouterModule,
    RankingLugaresComponent, ComentariosComponent,
    NavbarComponent, FooterComponent],
  templateUrl: './lista-sitios.component.html',
  styleUrls: ['./lista-sitios.component.scss']
})

export class ListaSitiosComponent implements OnInit {
  sitios: Sitio[] = [];

  constructor(private sitiosService: SitiosService) {}
  
  ngOnInit(): void {
    this.sitiosService.getSitios().subscribe((data) => {
      this.sitios = data;
    });
  }

  getAverageRating(sitio: Sitio): string {
    return sitio.rating.length > 0 ? (sitio.rating.reduce((a, b) => a + b, 0) / sitio.rating.length).toFixed(1) : 'N/A';
  }

  async generatePDF(): Promise<void> {
    const pdf = new PdfMakeWrapper();

    pdf.add(
      new Txt('Listado de Localizaciones').bold().fontSize(20).end
    );

    for (const sitio of this.sitios) {
      const averageRating = this.getAverageRating(sitio);
      pdf.add(await new Img(sitio.imageUrl).width(200).height(150).build());
      pdf.add(new Txt(`Nombre: ${sitio.name}`).bold().fontSize(16).end);
      pdf.add(new Txt(`Descripción: ${sitio.description}`).fontSize(12).end);
      pdf.add(new Txt(`Detalles: ${sitio.parrafo1} ${sitio.parrafo2}`).fontSize(12).end);
      pdf.add(new Txt(`Valoración: ${averageRating}`).fontSize(12).end);
      pdf.add(new Txt(`Comentarios: ${sitio.comments.join(', ')}`).fontSize(12).end);
      pdf.add(new Txt('\n').end);
    }

    pdf.create().open();
  }
}