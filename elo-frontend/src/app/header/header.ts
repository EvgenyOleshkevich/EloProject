import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Game } from '../model/game.model';
import { UserService } from '../services/userService';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  userService = inject(UserService);
  private router = inject(Router);
  @Input() title!: string;
  @Input() games!: Game[];

  onLogin() {
    this.router.navigate(['/login']);
  }

  onLogout() {
    this.userService.logout();
  }
}
