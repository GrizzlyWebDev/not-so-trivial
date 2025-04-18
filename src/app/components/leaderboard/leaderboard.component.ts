import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppService } from '../../../services/App.service';
import { ButtonComponent } from '../common/button/button.component';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
  standalone: true, // Ensure this is defined for standalone component
  imports: [CommonModule, ButtonComponent],
})
export class LeaderboardComponent {
  leaderboard: {
    name: string;
    score: number;
    totalGames: number;
    averageScore: number;
    bestScore: number;
  }[] = [];
  filteredLeaderboard: {
    name: string;
    score: number;
    totalGames: number;
    averageScore: number;
    bestScore: number;
  }[] = [];
  isFilterDropdownOpen: boolean = false; // To toggle dropdown visibility
  filterCriteria: string = ''; // To track the current filter being applied

  constructor(private appService: AppService, private router: Router) {}

  ngOnInit() {
    // Load leaderboard from localStorage
    const storedLeaderboard = JSON.parse(
      localStorage.getItem('leaderboard') || '[]'
    );

    // Loop through each player in the leaderboard and fetch their game statistics
    this.leaderboard = storedLeaderboard
      .sort((a: any, b: any) => b.score - a.score) // Sort leaderboard by score in descending order
      .slice(0, 15) // Take the top 15 players
      .map((player: any) => {
        // Fetch the statistics for each player
        const stats = this.appService.getGameStatisticsForPlayer(player.name);
        return {
          ...player,
          totalGames: stats.totalGames || 0,
          averageScore: stats.averageScore || 0,
          bestScore: stats.bestScore || 0,
        };
      });

    // Initialize filtered leaderboard with the full leaderboard
    this.filteredLeaderboard = [...this.leaderboard];
  }

  toggleFilterDropdown() {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }

  applyFilter(criteria: string) {
    this.filterCriteria = criteria;
    this.filterLeaderboard();
    this.isFilterDropdownOpen = false; // Close the dropdown
  }

  filterLeaderboard() {
    // Apply the filtering based on the selected criteria
    this.filteredLeaderboard = this.leaderboard.sort((a, b) => {
      if (this.filterCriteria === 'name') {
        return a.name.localeCompare(b.name);
      } else if (this.filterCriteria === 'score') {
        return b.score - a.score;
      } else if (this.filterCriteria === 'totalGames') {
        return b.totalGames - a.totalGames;
      } else if (this.filterCriteria === 'averageScore') {
        return b.averageScore - a.averageScore;
      } else if (this.filterCriteria === 'bestScore') {
        return b.bestScore - a.bestScore;
      } else {
        return 0;
      }
    });
  }

  playAgain() {
    // Navigate to the game page to play again
    this.router.navigateByUrl('/');
  }
}
