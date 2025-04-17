import { Component, OnInit } from '@angular/core';
import Category from '../../../interfaces/Category';
import { AppService } from '../../../services/App.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SelectComponent } from '../common/select/select.component';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../common/button/button.component';
import { Router } from '@angular/router';
import Difficulty from '../../../interfaces/Difficulty';
import { SoundsService } from '../../../services/Sounds.service';
import { QuestionsService } from '../../../services/Questions.service';
import QuestionType from '../../../interfaces/QuestionType';

@Component({
  selector: 'app-welcome',
  imports: [
    ReactiveFormsModule,
    SelectComponent,
    CommonModule,
    ButtonComponent,
  ],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements OnInit {
  categories: Category[] = [];
  questionTypes: QuestionType[] = ['multiple', 'boolean'];
  numQuestions: number = 10;
  selectedCategory: Category | undefined = undefined;
  selectedDifficulty: Difficulty = 'easy';
  selectedQuestionType: QuestionType = 'multiple';

  welcomeForm = new FormGroup({
    numQuestions: new FormControl(10, [Validators.required]),
    selectedCategory: new FormControl<Category | undefined>(undefined, [
      Validators.required,
    ]),
    selectedQuestionType: new FormControl<QuestionType>('multiple', [
      Validators.required,
    ]),
  });

  constructor(
    private appService: AppService,
    private soundsService: SoundsService,
    private questionsService: QuestionsService,
    private router: Router
  ) {
    this.soundsService.playBackgroundMusic();
  }

  ngOnInit() {
    this.appService.fetchCategories();
    this.appService.availableCategories.subscribe(
      (currentAvailableCategories) =>
        (this.categories = currentAvailableCategories)
    );
    this.appService.numberOfQuestions.subscribe(
      (currentNumQuestions) => (this.numQuestions = currentNumQuestions)
    );
    this.appService.selectedCategory.subscribe(
      (currentSelectedCategory) =>
        (this.selectedCategory = currentSelectedCategory)
    );
    this.appService.selectedDifficulty.subscribe(
      (currentSelectedDifficulty) =>
        (this.selectedDifficulty = currentSelectedDifficulty)
    );
    this.appService.selectedQuestionType.subscribe(
      (currentSelectedQuestionType) =>
        (this.selectedQuestionType = currentSelectedQuestionType)
    );
  }

  async onSubmit() {
    this.appService.setNumberOfQuestions(
      this.welcomeForm.controls['numQuestions'].value ?? 10
    );
    this.appService.setSelectedCategory(
      this.welcomeForm.controls['selectedCategory'].value ?? undefined
    );
    this.appService.setSelectedQuestionType(
      this.welcomeForm.controls['selectedQuestionType'].value ?? 'multiple'
    );
    if (!this.selectedCategory) return;
    await this.questionsService.fetchQuestions(
      this.selectedCategory?.id,
      this.numQuestions,
      this.selectedDifficulty,
      this.selectedQuestionType
    );
    this.router.navigateByUrl('/play');
  }
}
