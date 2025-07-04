import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../user.service';
import { CreateUserDto, User } from '../../../user.model';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user.component.html',
})
export class AddUserComponent {
  user: CreateUserDto = {
    first_name: '',
    last_name: '',
    email: ''
  };
  
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.createUser(this.user).subscribe({
      next: (response: User) => {
        this.successMessage = 'User added successfully!';
        this.isLoading = false;
        
        // Reset form
        this.user = {
          first_name: '',
          last_name: '',
          email: ''
        };

        // Navigate to users page after a short delay
        setTimeout(() => {
          this.router.navigate(['/users']);
        }, 2000);
      },
      error: (error: any) => {
        console.error('Error adding user:', error);
        this.errorMessage = 'Failed to add user. Please try again.';
        this.isLoading = false;
      }
    });
  }

  validateForm(): boolean {
    if (!this.user.first_name.trim()) {
      this.errorMessage = 'First name is required';
      return false;
    }

    if (!this.user.last_name.trim()) {
      this.errorMessage = 'Last name is required';
      return false;
    }

    if (!this.user.email.trim()) {
      this.errorMessage = 'Email is required';
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.user.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  clearForm(): void {
    this.user = {
      first_name: '',
      last_name: '',
      email: ''
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  navigateToUsers(): void {
    this.router.navigate(['/users']);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSubmit();
    }
  }
} 