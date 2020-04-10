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
  overflow = false;
  dropdown = false;
 

  toggleDropdown() {
    this.dropdown = !this.dropdown;
    this.checkOverflow();
  }

  dropdownOffClick(event) {
    if (!this.suggestion.nativeElement.contains(event.target)) { // or some similar check
      if(this.dropdown) this.dropdown=false; 
    }
   
  }

  checkOverflow () { 
    let content = document.querySelector('.dropdown-container');
    setTimeout(() => {
      let checkOverflow = parseFloat(window.getComputedStyle(content).right); 
      checkOverflow < 0 ? this.overflow = true : this.overflow = false;   
    }, 0); 
  } 

  constructor(private suggestion: ElementRef) { }

  ngOnInit(): void {
  }

}
