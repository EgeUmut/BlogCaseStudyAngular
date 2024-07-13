import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sitelayout',
  standalone: true,
  imports: [FooterComponent,NavbarComponent,RouterModule],
  templateUrl: './sitelayout.component.html',
  styleUrl: './sitelayout.component.css'
})
export class SitelayoutComponent {

}
