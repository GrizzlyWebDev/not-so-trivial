import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SoundsService } from '../../../../services/Sounds.service';

@Component({
  selector: 'app-router-button',
  imports: [CommonModule, RouterLink],
  templateUrl: './router-button.component.html',
  styleUrls: ['./router-button.component.css'],
})
export class RouterButtonComponent implements OnInit {
  @Input() buttonText: string = '';
  @Input() onClick: Function | undefined;
  @Input() routerLink: string | undefined;
  soundsOn: boolean = true;

  constructor(private soundsService: SoundsService) {}

  ngOnInit() {
    this.soundsService.soundEffectsOn.subscribe(
      (soundEffectsOn) => (this.soundsOn = soundEffectsOn)
    );
  }

  handleClick() {
    if (this.soundsOn) {
      new Howl({
        src: ['sounds/button.mp3'],
        autoplay: true,
        loop: false,
        volume: 0.5,
      });
    }

    this.onClick ? this.onClick() : null;
  }
}
