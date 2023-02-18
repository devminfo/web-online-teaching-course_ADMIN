import { Component, OnInit } from '@angular/core';
import { AuthService1 } from '../../services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  constructor(private authService: AuthService1) {
    this.authService.logout();
  }

  ngOnInit(): void {}
}
