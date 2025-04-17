import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../common/button/button.component';
import { SoundsService } from '../../../services/Sounds.service';
import { AppService } from '../../../services/App.service';
@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
  standalone: true, // Ensure this is defined for standalone component
  imports: [CommonModule, ButtonComponent],
})
export class LeaderboardComponent {
  leaderboard: { name: string; score: number; totalGames: number; averageScore: number; bestScore: number }[] = [];

  constructor(private soundsService: SoundsService, private router: Router, private appService: AppService) {
    this.soundsService.playBackgroundMusic();
  }

  ngOnInit() {
    // Load leaderboard from localStorage
    const storedLeaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
  
    // Loop through each player in the leaderboard and fetch their game statistics
    this.leaderboard = storedLeaderboard
      .sort((a: any, b: any) => b.score - a.score) // Sort leaderboard by score in descending order
      .slice(0, 10) // Take the top 15 players
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
  }
  

  playAgain() {
    // Navigate to the game page to play again
    this.router.navigateByUrl('/');
  }
}
