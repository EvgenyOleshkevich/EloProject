import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Table } from '../../utils/table/table';
import { RadioButtonsComponent } from '../../utils/radio-buttons/radio-buttons';
import { UserService } from '../../services/userService';
import { User } from '../../model/user.model';
import { UserRole } from '../../model/Enums';
import { RegisterInput } from '../../model/inputs/registerInput';
import { Column } from '../../model/column.model';
import { renderUserRole, RoleOptions } from '../../utils/renders/columnRender';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, Table, RadioButtonsComponent],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  private userService = inject(UserService);

  users = signal<User[]>([]);

  input: RegisterInput = {
      email: '',
      password: '',
      role: UserRole.Player,
  };
  errorMessage = signal<string | null>(null);
  columns: Column<User>[] = [
    { key: 'email', title: 'Name' },
    { key: 'role', title: 'Role', render:  row => renderUserRole(row.role) },
  ];

  roleOptions = RoleOptions;

  canEdit = computed(() =>
    this.userService.user()?.role === UserRole.Admin
  );

  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      this.users.set(users);
    });
  }

}
