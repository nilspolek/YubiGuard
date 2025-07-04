import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../user.service';
import { User } from '../../../user.model';

@Component({
  selector: 'app-find-key',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './find-key.component.html',
})
export class FindKeyComponent implements OnInit {
  keyId: string = '';
  foundUser: User | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  hasSearched: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check for search query parameter from landing page
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.keyId = params['search'];
        this.searchKey();
      }
    });
  }

  searchKey(): void {
    if (!this.keyId.trim()) {
      this.errorMessage = 'Please enter a Security Key ID';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.foundUser = null;
    this.hasSearched = true;

    // Normalize the key ID (remove dashes if present)
    const normalizedKeyId = this.keyId.replace(/-/g, '').toLowerCase();

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        // Search through all users to find the key
        for (const user of users) {
          const foundKey = user.keys.find(key => 
            key.replace(/-/g, '').toLowerCase() === normalizedKeyId
          );
          
          if (foundKey) {
            this.foundUser = user;
            break;
          }
        }

        if (!this.foundUser) {
          this.errorMessage = 'Security Key not found. Please check the ID and try again.';
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error searching for key:', error);
        this.errorMessage = 'Failed to search for Security Key. Please try again.';
        this.isLoading = false;
      }
    });
  }

  formatKey(key: string): string {
    // Format UUID as 8-4-4-4-12
    if (key.length === 32) {
      return `${key.substring(0, 8)}-${key.substring(8, 12)}-${key.substring(12, 16)}-${key.substring(16, 20)}-${key.substring(20, 32)}`;
    }
    return key;
  }

  clearSearch(): void {
    this.keyId = '';
    this.foundUser = null;
    this.errorMessage = '';
    this.hasSearched = false;
  }

  navigateToManageKeys(): void {
    this.router.navigate(['/manage-keys']);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.searchKey();
    }
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