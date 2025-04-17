import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AppService } from '../../../../services/App.service';
import { SoundsService } from '../../../../services/Sounds.service';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent implements OnInit {
  @Input() buttonText: string = '';
  @Input() onClick: Function | undefined;
  @Input() disabled: boolean = false;
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
