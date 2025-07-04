import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UserService } from "../../../user.service";
import { User } from "../../../user.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-users",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./users.component.html",
  styleUrl: "./users.component.css",
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  searchTerm: string = '';
  expandedUsers: Set<string> = new Set();
  addingKeyToUser: string | null = null;
  newKeyId: string = '';
  isAddingKey: boolean = false;
  keyError: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

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

  onUserClick(user: User): void {
    this.router.navigate(["/add", user.id]);
  }

  toggleUserExpansion(userId: string, event: Event): void {
    event.stopPropagation();
    if (this.expandedUsers.has(userId)) {
      this.expandedUsers.delete(userId);
    } else {
      this.expandedUsers.add(userId);
    }
  }

  isUserExpanded(userId: string): boolean {
    return this.expandedUsers.has(userId);
  }

  startAddingKey(userId: string, event: Event): void {
    event.stopPropagation();
    this.addingKeyToUser = userId;
    this.newKeyId = '';
    this.keyError = '';
  }

  cancelAddingKey(): void {
    this.addingKeyToUser = null;
    this.newKeyId = '';
    this.keyError = '';
  }

  addKeyToUser(userId: string): void {
    if (!this.newKeyId.trim()) {
      this.keyError = 'Please enter a Security Key ID';
      return;
    }

    // Basic validation for Security Key format (32 characters, alphanumeric)
    const keyRegex = /^[a-fA-F0-9]{32}$/;
    if (!keyRegex.test(this.newKeyId.replace(/-/g, ''))) {
      this.keyError = 'Please enter a valid Security Key ID (32 characters)';
      return;
    }

    this.isAddingKey = true;
    this.keyError = '';

    // Normalize the key ID (remove dashes if present)
    const normalizedKeyId = this.newKeyId.replace(/-/g, '');

    this.userService.addKeyToUser(userId, normalizedKeyId).subscribe({
      next: (response) => {
        this.isAddingKey = false;
        this.addingKeyToUser = null;
        this.newKeyId = '';
        
        // Refresh the users list to show the new key
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error adding key:', error);
        this.keyError = 'Failed to add key. Please try again.';
        this.isAddingKey = false;
      }
    });
  }

  onKeyInputKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.addingKeyToUser) {
      this.addKeyToUser(this.addingKeyToUser);
    }
  }

  getProfilePicUrl(user: User): string {
    const encodedName = encodeURIComponent(
      user.first_name + " " + user.last_name,
    );
    return `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=128`;
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

  getFilteredUsers(): User[] {
    if (!this.searchTerm) {
      return this.users;
    }
    
    const search = this.searchTerm.toLowerCase();
    return this.users.filter(user => 
      user.first_name.toLowerCase().includes(search) ||
      user.last_name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    );
  }

  getKeysCountText(count: number): string {
    if (count === 0) return 'No keys';
    if (count === 1) return '1 key';
    return `${count} keys`;
  }

  refreshUsers(): void {
    this.loadUsers();
  }

  trackByUserId(index: number, user: User): string {
    return user.id;
  }

  trackByKeyId(index: number, key: string): string {
    return key;
  }

  // Helper method for template
  encodeURIComponent(str: string): string {
    return encodeURIComponent(str);
  }

  // Helper method for template
  getCurrentDate(): string {
    return new Date().toLocaleDateString();
  }

  navigateToManageKeys(): void {
    this.router.navigate(['/manage-keys']);
  }

  navigateToAddUser(): void {
    this.router.navigate(['/add-user']);
  }

  onKeyPress(event: KeyboardEvent): void {
  }
}
