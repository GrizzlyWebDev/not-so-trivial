import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-circular-progress',
  imports: [CommonModule],
  templateUrl: './circular-progress.component.html',
  styleUrls: ['./circular-progress.component.css'],
})
export class CircularProgressComponent implements OnInit {
  @Input() percent: number = 0;
  @Input() text: string = '';
  @Input() lessThanPercent: number = 0;
  circumference: number = 0;
  strokeDashoffset: number = 0;
  constructor() {}

  ngOnInit(): void {
    this.calculateCircumference();
    this.updateProgress();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['percent']) {
      this.updateProgress();
    }
    if (changes['text']) {
      this.text = changes['text'].currentValue;
    }
  }

  private calculateCircumference(): void {
    const radius = 42;
    this.circumference = radius * 2 * Math.PI;
  }

  private updateProgress(): void {
    const offset =
      this.circumference - (this.percent / 100) * this.circumference;
    this.strokeDashoffset = offset;
  }
}
