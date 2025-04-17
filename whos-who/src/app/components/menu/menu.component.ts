import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SelectComponent } from '../common/select/select.component';
import Difficulty from '../../../interfaces/Difficulty';
import { ToggleComponent } from '../common/toggle/toggle.component';
import { AppService } from '../../../services/App.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterButtonComponent } from '../common/router-button/router-button.component';
import { ButtonComponent } from '../common/button/button.component';
import { SoundsService } from '../../../services/Sounds.service';

@Component({
  selector: 'app-menu',
  imports: [
    RouterLink,
    CommonModule,
    SelectComponent,
    ToggleComponent,
    ReactiveFormsModule,
    RouterButtonComponent,
    ButtonComponent,
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  isOpen: boolean = false;
  difficultyOptions: Difficulty[] = ['easy', 'medium', 'hard'];

  settingsForm = new FormGroup({
    selectedDifficulty: new FormControl<Difficulty>('easy', [
      Validators.required,
    ]),
    musicIsOn: new FormControl<boolean>(false, []),
    soundEffectsAreOn: new FormControl<boolean>(false, []),
  });

  constructor(
    private appService: AppService,
    private soundsService: SoundsService
  ) {}

  ngOnInit() {
    this.soundsService.backgroundMusicOn.subscribe((isMusicOn) => {
      this.settingsForm.controls['musicIsOn'].setValue(isMusicOn);
    });

    this.soundsService.soundEffectsOn.subscribe((areSoundsOn) => {
      this.settingsForm.controls['soundEffectsAreOn'].setValue(areSoundsOn);
    });
  }

  toggleIsOpen() {
    this.isOpen = !this.isOpen;
  }

  onSubmit() {
    this.appService.setSelectedDifficulty(
      this.settingsForm.controls['selectedDifficulty'].value ?? 'easy'
    );
    this.soundsService.setBackgroundMusicOn(
      this.settingsForm.controls['musicIsOn'].value ?? false
    );
    this.soundsService.setSoundEffectsOn(
      this.settingsForm.controls['soundEffectsAreOn'].value ?? false
    );
  }
}
