import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.scss']
})
export class SuggestionComponent implements OnInit {
  @Input() misspelling: string;
  dropdown = false;

  toggleDropdown() {
    this.dropdown = !this.dropdown;
  }

  constructor() { }

  ngOnInit(): void {
    console.log(this.dropdown)
  }

}
