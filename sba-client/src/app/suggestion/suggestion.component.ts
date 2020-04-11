import { Component, OnInit, Input, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { I18nPluralPipe } from '@angular/common';
import { StringifyOptions } from 'querystring';

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
  @Input() suggestions: any; 
  @Input() id: string;

  title = "Suggestions"; 
  overflowRight = false;
  overflowBottom = false;
  dropdown = false;

  setTittle(){
    if(this.suggestions.length < 1) this.title = "No Suggestions Found";
  }

  toggleDropdown() {
    this.dropdown = !this.dropdown;
    this.dropdown? this.checkOverflow() : ()=> {this.overflowRight=false; this.overflowBottom=false}; 
  }

  dropdownOffClick(event) {
    if (!this.suggestion.nativeElement.contains(event.target)) { // or some similar check
      if(this.dropdown) this.dropdown=false; 
    }
    // this.overflowRight=false; 
    // this.overflowBottom=false; 
  }

  checkOverflow () { 
    let content = document.getElementById(this.id);
    setTimeout(() => {
      console.log(window.getComputedStyle(content))
      let overflowRight = parseFloat(window.getComputedStyle(content).right); 
      let overflowBottom = parseFloat(window.getComputedStyle(content).bottom); 
      setTimeout(()=> { 
        if(overflowRight < 0) this.overflowRight = true;   
        if(overflowBottom < 0) this.overflowBottom = true;   
      },0);
    },0); 
  } 

  constructor(private suggestion: ElementRef) { }

  ngOnInit(): void {
    this.setTittle();
  }

}
