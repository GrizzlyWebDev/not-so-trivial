import { Component, OnInit, OnDestroy } from '@angular/core';
import { CircularProgressComponent } from '../common/circular-progress/circular-progress.component';
import { interval, Subscription, take } from 'rxjs';
import { AppService } from '../../../services/App.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Question } from '../../../interfaces/Question';
import { DecodeHtmlPipe } from './decode-html.pipe';
import { AnswerButtonComponent } from '../common/answer-button/answer-button.component';
import { SoundsService } from '../../../services/Sounds.service';
import { QuestionsService } from '../../../services/Questions.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css'],
  imports: [
    CircularProgressComponent,
    CommonModule,
    DecodeHtmlPipe,
    AnswerButtonComponent,
  ],
})
export class PlayComponent implements OnInit, OnDestroy {
  timeLeft: number = 15;
  percentTime: number = (this.timeLeft / 15) * 100;
  private intervalSubscription?: Subscription;
  questions: Question[] = [];
  currentQuestionIndex: number = 0;
  score: number = 0;
  correctAnswer: string | undefined = undefined;
  soundsOn: boolean = true;

  constructor(
    private appService: AppService,
    private router: Router,
    private soundsService: SoundsService,
    private questionsService: QuestionsService
  ) {
    this.soundsService.playBackgroundMusic();
  }

  ngOnInit(): void {
    this.questionsService.questions.subscribe(
      (currentQuestions) => (this.questions = currentQuestions)
    );
    this.soundsService.soundEffectsOn.subscribe(
      (currentSoundsOn) => (this.soundsOn = currentSoundsOn)
    );
    if (this.questions.length < 1) {
      this.router.navigateByUrl('/');
    }
    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.stopCountdown();
  }

  startCountdown() {
    this.intervalSubscription = interval(1000)
      .pipe(take(31))
      .subscribe(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
          this.percentTime = (this.timeLeft / 15) * 100;
        } else {
          this.stopCountdown();
          if (this.currentQuestionIndex < this.questions.length) {
            this.playIncorrectSound();
            this.revealAnswer();
          } else {
            this.goToResults();
          }
        }
      });
  }

  stopCountdown() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
    this.timeLeft = 15;
    this.percentTime = (this.timeLeft / 15) * 100;
    this.intervalSubscription = undefined;
  }

  // Handle user's answer
  answerQuestion(selectedAnswer: string) {
    if (this.correctAnswer) return;
    this.stopCountdown();
    const currentQuestion = this.questions[this.currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correct_answer) {
      this.score++;
      this.playCorrectSound();
    } else {
      this.playIncorrectSound();
    }
    this.revealAnswer();
  }

  // Navigate to the results page
  goToResults() {
    this.appService.setScore(this.score);
    this.router.navigateByUrl('/results');
  }

  async revealAnswer() {
    this.correctAnswer =
      this.questions[this.currentQuestionIndex].correct_answer;
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (this.currentQuestionIndex >= this.questions.length - 1) {
      this.goToResults();
    }

    this.correctAnswer = undefined;
    this.currentQuestionIndex++;
    this.startCountdown();
  }

  playCorrectSound() {
    if (!this.soundsOn) return;
    new Howl({
      src: ['sounds/correct.mp3'],
      autoplay: true,
      loop: false,
      volume: 0.6,
    });
  }
  playIncorrectSound() {
    if (!this.soundsOn) return;
    new Howl({
      src: ['sounds/incorrect.mp3'],
      autoplay: true,
      loop: false,
      volume: 0.6,
    });
  }
}
