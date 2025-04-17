import { Injectable } from '@angular/core';
import Difficulty from '../interfaces/Difficulty';
import { BehaviorSubject } from 'rxjs';
import { Question } from '../interfaces/Question';
import QuestionType from '../interfaces/QuestionType';

const triviaApiUrl = 'https://opentdb.com';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  questionsSource = new BehaviorSubject<Question[] | []>([]);
  questions = this.questionsSource.asObservable();

  async fetchQuestions(
    categoryId: number,
    numQuestions: number,
    selectedDifficulty: Difficulty,
    questionType: QuestionType
  ) {
    const apiUrl = `https://opentdb.com/api.php?amount=${numQuestions}&category=${categoryId}&difficulty=${selectedDifficulty}&type=${questionType}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      this.questionsSource.next(
        data.results.map((item: any) => ({
          category: item.category,
          type: item.type,
          difficulty: item.difficulty,
          question: item.question,
          correct_answer: item.correct_answer,
          incorrect_answers: item.incorrect_answers,
          all_answers: [item.correct_answer, ...item.incorrect_answers].sort(
            () => Math.random() - 0.5
          ),
        }))
      );
    } catch (error) {
      this.questionsSource.next([]);
      console.error('Error fetching trivia questions:', error);
    }
  }
}
