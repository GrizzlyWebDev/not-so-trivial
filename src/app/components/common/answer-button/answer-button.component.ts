import { Component, Input, OnInit } from '@angular/core';
import { DecodeHtmlPipe } from '../../play/decode-html.pipe';

@Component({
  selector: 'app-answer-button',
  imports: [DecodeHtmlPipe],
  templateUrl: './answer-button.component.html',
  styleUrls: ['./answer-button.component.css'],
})
export class AnswerButtonComponent implements OnInit {
  @Input() answer: string = '';
  @Input() onClick!: (answer: string) => void;
  @Input() correct: boolean | undefined = undefined;

  ngOnInit() {}
}
