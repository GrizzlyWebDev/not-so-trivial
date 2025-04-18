import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Category from '../interfaces/Category';
import Difficulty from '../interfaces/Difficulty';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import QuestionType from '../interfaces/QuestionType';

const triviaApiUrl = 'https://opentdb.com';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private scoreSource = new BehaviorSubject<number>(0);
  score = this.scoreSource.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private numberOfQuestionsSource = new BehaviorSubject<number>(10);
  numberOfQuestions = this.numberOfQuestionsSource.asObservable();

  private selectedQuestionTypeSource = new BehaviorSubject<QuestionType>(
    'multiple choice'
  );
  selectedQuestionType = this.selectedQuestionTypeSource.asObservable();

  private selectedCategorySource = new BehaviorSubject<Category | undefined>({
    id: 9,
    name: 'General Knowledge',
  });
  selectedCategory = this.selectedCategorySource.asObservable();

  private availableCategoriesSource = new BehaviorSubject<Category[]>([]);
  availableCategories = this.availableCategoriesSource.asObservable();

  private selectedDifficultySource = new BehaviorSubject<Difficulty>('easy');
  selectedDifficulty = this.selectedDifficultySource.asObservable();

  setNumberOfQuestions(numQuestions: number) {
    this.numberOfQuestionsSource.next(numQuestions);
  }

  setSelectedQuestionType(type: QuestionType) {
    this.selectedQuestionTypeSource.next(type);
  }

  setSelectedCategory(category: Category | undefined) {
    this.selectedCategorySource.next(category);
  }

  setAvailableCategories(categories: Category[]) {
    this.availableCategoriesSource.next(categories);
  }

  setSelectedDifficulty(Difficulty: Difficulty) {
    this.selectedDifficultySource.next(Difficulty);
  }

  setScore(score: number) {
    this.scoreSource.next(score);
  }

  getScore() {
    return this.scoreSource.getValue();
  }

  getSelectedCategorySource(): Category | undefined {
    return this.selectedCategorySource.getValue();
  }

  getNumberOfQuestions(): number {
    return this.numberOfQuestionsSource.getValue();
  }

  async fetchCategories() {
    try {
      const data = await lastValueFrom(
        this.http.get<{ trivia_categories: Category[] }>(
          triviaApiUrl + '/api_category.php'
        )
      );
      this.setAvailableCategories(data.trivia_categories);
    } catch (error) {
      console.log(error);
      this.setAvailableCategories([]);
    } finally {
    }
  }

  setGameStatistics(playerName: string, score: number) {
    let stats = JSON.parse(localStorage.getItem('gameStats') || '{}');

    if (!stats[playerName]) {
      stats[playerName] = {
        totalGames: 0,
        totalScore: 0,
        averageScore: 0,
        bestScore: 0,
      };
    }

    // Update stats for the player
    stats[playerName].totalGames += 1;
    stats[playerName].totalScore += score;
    stats[playerName].averageScore =
      stats[playerName].totalScore / stats[playerName].totalGames;

    if (!stats[playerName].bestScore || score > stats[playerName].bestScore) {
      stats[playerName].bestScore = score;
    }

    localStorage.setItem('gameStats', JSON.stringify(stats));
  }

  getGameStatisticsForPlayer(playerName: string) {
    const stats = JSON.parse(localStorage.getItem('gameStats') || '{}');
    return (
      stats[playerName] || {
        totalGames: 0,
        averageScore: 0,
        bestScore: 0,
      }
    );
  }
}
