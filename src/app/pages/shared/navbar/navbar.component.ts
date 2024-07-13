import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../features/services/concretes/auth.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,CommonModule],
  providers:[AuthService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  loggedin:boolean = false;
  currentUserId!:string;

  ngOnInit(): void {
    this.isLoggedIn();
  }

  /**
   *
   */
  constructor(private authService:AuthService, private cd: ChangeDetectorRef, private toastr:ToastrService,private router:Router) {}

  isLoggedIn(){
    this.loggedin = this.authService.loggedIn();
    if(this.loggedin){
      this.currentUserId = this.authService.getCurrentUserId();
    }
    this.cd.detectChanges(); 
  }


  LogOut(){
    this.loggedin = false;
    this.authService.logOut();
    this.toastr.success("Logget Out Successfully!")
    this.cd.detectChanges();
    this.router.navigate(['/blogs']);
  }
}
