import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { UsersService } from '../../services/users.service';
declare var bootstrap: any;
import { FormsModule } from '@angular/forms';

interface User {
  name: string;
  email: string;
  password: string;
  profile: string;
}

@Component({
  selector: 'app-admin-user-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-user-management.component.html',
  styleUrl: './admin-user-management.component.scss'
})
export class AdminUserManagementComponent implements AfterViewInit {

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private userService: UsersService
  ) { }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const links = document.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', (event: Event) => {
          event.preventDefault();
          const target = event.target as HTMLElement;
          const href = target.getAttribute('href');
          if (href) {
            this.navigationService.navigateWithDelay(href);
          }
        });
      });
    }
  }

  users: User[] = [];
  newUser: User = { name: '', email: '', password: '', profile: '' };
  selectedUser: User = { name: '', email: '', password: '', profile: '' };
  selectedIndex: number | null = null;

  ngOnInit(): void {
    if (this.userService.isLocalStorageAvailable()) {
      this.loadUsers();
    }
  }

  loadUsers(): void {
    this.users = this.userService.getUsers();
  }

  onAddUser(): void {
    this.userService.addUser(this.newUser);
    this.newUser = { name: '', email: '', password: '', profile: '' };
    this.loadUsers();
    // Close modal
    const addUserModal = document.getElementById('addUserModal');
    const modalInstance = bootstrap.Modal.getInstance(addUserModal);
    modalInstance.hide();
  }

  editUser(index: number): void {
    this.selectedUser = { ...this.users[index] };
    this.selectedIndex = index;
    // Show modal
    const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
    editUserModal.show();
  }

  onUpdateUser(): void {
    if (this.selectedIndex !== null) {
      this.userService.updateUser(this.selectedIndex, this.selectedUser);
      this.selectedUser = { name: '', email: '', password: '', profile: '' };
      this.selectedIndex = null;
      this.loadUsers();
      // Close modal
      const editUserModal = document.getElementById('editUserModal');
      const modalInstance = bootstrap.Modal.getInstance(editUserModal);
      modalInstance.hide();
    }
  }

  deleteUser(index: number): void {
    this.userService.deleteUser(index);
    this.loadUsers();
  }
}
