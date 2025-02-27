import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SitiosService, Sitio } from '../../services/sitios.service';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detalle',
  standalone: true,
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css'],
  imports: [MatCardModule, CommonModule, NavbarComponent, FormsModule]
})
export class DetalleComponent implements OnInit {
  sitio!: Sitio;
  newComment: string = ''; 
  currentUser: string = '';
  newRating: number | null = null;
  currentImageIndex: number = 0; // Índice de la imagen actual en el carrusel

  constructor(
    private route: ActivatedRoute,
    private sitiosService: SitiosService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.sitiosService.getSitioById(id).subscribe(sitio => this.sitio = sitio);
    }
    
    const userData = this.authService.getUserData(); 
    if (userData) {
      this.currentUser = this.authService.getUserData();
    }
  }

  addComment(): void {
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getUserData(); 
      const userName = `${user.firstName} ${user.lastName}`; 
  

      const userNameString = String(userName);
  
      const rating = Number(this.newRating); 
  
      
      if (isNaN(rating)) {
        alert('La puntuación debe ser un número válido.');
        return;
      }
     
      this.sitiosService.addCommentToSite(this.sitio.id, this.newComment, rating, userNameString).subscribe(
        (updatedSite) => {
          this.sitio = updatedSite; 
          this.newComment = ''; 
          this.newRating = null; 
        },
        (error) => {
          console.error('Error al agregar comentario', error);
        }
      );
    } else {
      alert('Inicie sesión para comentar.');
    }
  }

  // Métodos para cambiar la imagen en el carrusel
  prevImage(): void {
    if (this.sitio.imageGallery.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.sitio.imageGallery.length) % this.sitio.imageGallery.length;
    }
  }

  nextImage(): void {
    if (this.sitio.imageGallery.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.sitio.imageGallery.length;
    }
  }
}