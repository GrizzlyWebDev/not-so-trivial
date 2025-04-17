import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-select',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
})
export class SelectComponent implements OnInit {
  @Input() options: any = [];
  @Input() control: FormControl = new FormControl();
  @Input() placeHolder: string | undefined;
  isDropdownOpen: boolean = false;

  constructor() {}

  ngOnInit() {}

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
