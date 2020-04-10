import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
  host: {
    '(document:click)': 'dropdownOffClick($event)',
  },
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

  dropdownOffClick(event) {
    if (!this.suggestion.nativeElement.contains(event.target)) { // or some similar check
      if(this.dropdown) this.dropdown=false; 
    }
   
  }

  constructor(private suggestion: ElementRef) { }

  ngOnInit(): void {
    console.log(this.dropdown)
  }

}
