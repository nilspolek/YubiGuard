import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../user.service';
import { User } from '../../../user.model';

@Component({
  selector: 'app-manage-keys',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-keys.component.html',
})
export class ManageKeysComponent implements OnInit {
  users: User[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  searchTerm: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.errorMessage = 'Failed to load users. Please try again.';
        this.isLoading = false;
      }
    });
  }

  getAllKeys(): Array<{key: string, user: User}> {
    const allKeys: Array<{key: string, user: User}> = [];
    
    this.users.forEach(user => {
      user.keys.forEach(key => {
        allKeys.push({ key, user });
      });
    });
    
    return allKeys;
  }

  getFilteredKeys(): Array<{key: string, user: User}> {
    const allKeys = this.getAllKeys();
    
    if (!this.searchTerm) {
      return allKeys;
    }
    
    const search = this.searchTerm.toLowerCase();
    return allKeys.filter(item => 
      item.key.toLowerCase().includes(search) ||
      item.user.first_name.toLowerCase().includes(search) ||
      item.user.last_name.toLowerCase().includes(search) ||
      item.user.email.toLowerCase().includes(search)
    );
  }

  formatKey(key: string): string {
    // Format UUID as 8-4-4-4-12
    if (key.length === 32) {
      return `${key.substring(0, 8)}-${key.substring(8, 12)}-${key.substring(12, 16)}-${key.substring(16, 20)}-${key.substring(20, 32)}`;
    }
    return key;
  }

  getKeyStatus(key: string): string {
    // This could be expanded to check actual key status
    return 'Active';
  }

  refreshData(): void {
    this.loadUsers();
  }

  trackByKey(index: number, item: {key: string, user: User}): string {
    return item.key;
  }

  // Helper method for template
  encodeURIComponent(str: string): string {
    return encodeURIComponent(str);
  }

  // Helper method for template
  getCurrentDate(): string {
    return new Date().toLocaleDateString();
  }
} 