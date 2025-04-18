import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Howl } from 'howler';

@Injectable({
  providedIn: 'root',
})
export class SoundsService {
  constructor(private router: Router) {}

  private backgroundMusicOnSource = new BehaviorSubject<boolean>(
    JSON.parse(localStorage.getItem('isMusicOn') || 'true')
  );
  backgroundMusicOn = this.backgroundMusicOnSource.asObservable();

  private soundEffectsOnSource = new BehaviorSubject<boolean>(
    JSON.parse(localStorage.getItem('areSoundsOn') || 'true')
  );
  soundEffectsOn = this.soundEffectsOnSource.asObservable();

  private currentBackgroundMusicSource = new BehaviorSubject<Howl | undefined>(
    undefined
  );
  currentBackgroundMusic = this.currentBackgroundMusicSource.asObservable();

  currentBackgroundMusicId: number | undefined = undefined;

  setSoundEffectsOn(isOn: boolean) {
    this.soundEffectsOnSource.next(isOn);
    localStorage.setItem('areSoundsOn', isOn.toString());
  }

  setBackgroundMusicOn(isOn: boolean) {
    // toggle the bg music on or off and store the updated value in localstorage
    this.backgroundMusicOnSource.next(isOn);
    localStorage.setItem('isMusicOn', isOn.toString());

    // stop the current music and clear the state
    this.currentBackgroundMusicSource.value?.stop();
    this.currentBackgroundMusicSource.next(undefined);

    // if user turns sound on set the music appropriately
    isOn && this.playBackgroundMusic();
  }

  playBackgroundMusic() {
    // if the user selected background music off don't play
    if (this.backgroundMusicOnSource.value === false) return;
    // otherwise set the music per page
    switch (this.router.url) {
      case '/play':
        this.setCurrentBackgroundMusic(
          new Howl({
            src: ['sounds/quiz.mp3'],
            autoplay: false,
            loop: true,
            volume: 0.1,
          })
        );
        break;
      case '/':
        this.setCurrentBackgroundMusic(
          new Howl({
            src: ['sounds/welcome.mp3'],
            autoplay: false,
            loop: true,
            volume: 0.1,
          })
        );
        break;
      case '/leaderboard':
        this.setCurrentBackgroundMusic(
          new Howl({
            src: ['sounds/leaderboard.mp3'],
            autoplay: false,
            loop: true,
            volume: 0.1,
          })
        );
        break;
      case '/results':
        this.setCurrentBackgroundMusic(
          new Howl({
            src: ['sounds/results.mp3'],
            autoplay: false,
            loop: true,
            volume: 0.1,
          })
        );
        break;
      default:
        this.setCurrentBackgroundMusic(
          new Howl({
            src: ['sounds/welcome.mp3'],
            autoplay: false,
            loop: true,
            volume: 0.1,
          })
        );
    }
  }

  setCurrentBackgroundMusic(howl: Howl) {
    // store current val as a variable for easier readablilty
    const currentMusic = this.currentBackgroundMusicSource.value;

    // if no current value set, set the value and the id returned when play is called
    if (!currentMusic) {
      this.currentBackgroundMusicSource.next(howl);
      this.currentBackgroundMusicId =
        this.currentBackgroundMusicSource.value?.play();
      return;
    }

    // if there is current music, fade it out and then turn it off
    currentMusic.fade(0.1, 0, 1000, this.currentBackgroundMusicId).off();

    // set new value and id
    this.currentBackgroundMusicSource.next(howl);
    this.currentBackgroundMusicId =
      this.currentBackgroundMusicSource.value?.play();
  }
}
