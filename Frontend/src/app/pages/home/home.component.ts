import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  searchTerm: string = '';

  constructor(private router: Router) {}

  navigateToUsers(): void {
    this.router.navigate(['/users']);
  }

  navigateToAdd(): void {
    this.router.navigate(['/manage-keys']);
  }

  navigateToFindKey(): void {
    this.router.navigate(['/find-key']);
  }

  searchFromLanding(): void {
    if (this.searchTerm.trim()) {
      // Navigate to find-key page with the search term as a query parameter
      this.router.navigate(['/find-key'], { queryParams: { search: this.searchTerm.trim() } });
    } else {
      // If no search term, just navigate to the find-key page
      this.router.navigate(['/find-key']);
    }
  }

  onSearchKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.searchFromLanding();
    }
  }
}
