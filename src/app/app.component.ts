import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { BloglistComponent } from './pages/bloglist/bloglist.component';
import { NavbarComponent } from './pages/shared/navbar/navbar.component';
import { FooterComponent } from './pages/shared/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterModule,NavbarComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'BlogCaseStudyAngular';
}
