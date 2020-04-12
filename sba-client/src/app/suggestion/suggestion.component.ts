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
  @Input() 
  result: { word: string, suggestions: string[], misspelled: boolean };
  //sets id of misspelled word to check if changed
  @Input() 
  wordID: string;
  //other field of dropdown
  @Input()
  otherInput: string;
  //signals to parent to add word to ignored array
  @Output() 
  ignoreRequest = new EventEmitter<string>();
  //sets id of dropdown to check if overflowing
  dropdownID: string; 
  //title default; changes if no suggestions are found
  title: string = "Suggestions";
  //tracks user input in other field of dropdown
  other: boolean = false;
  //toggles position of dropdown when overflowing
  overflowRight: boolean = false;
  overflowBottom: boolean = false;
  //toggles dropdown visibility
  dropdown: boolean = false;

  @ViewChild("suggestionContainer") suggestionContainer: ElementRef; 
  @ViewChild("misspelledWord") misspelledWord: ElementRef; 

  //on init checks for suggestions
  setTittle(){
    if(this.result.suggestions && this.result.suggestions.length < 1) this.title = "No Suggestions Found";
  }

  toggleDropdown() {
    this.dropdown = !this.dropdown;
    this.dropdown? this.checkOverflow() : ()=> {this.overflowRight=false; this.overflowBottom=false}; 
  }

  //allows offclick toggle of dropdown
  dropdownOffClick(event) {
    if (this.suggestionContainer && !this.suggestionContainer.nativeElement.contains(event.target)) { // or some similar check
      if(this.dropdown) this.dropdown=false; 
    }
    this.overflowRight=false; 
    this.overflowBottom=false; 
  }

  //realigns dropdown if overflowing
  checkOverflow () { 
    let rightBorder = document.documentElement.clientWidth;
    let bottomBorder = document.documentElement.clientHeight;
    let dropdown = document.getElementById(this.dropdownID);

    setTimeout(() => {
      let positions = dropdown.getBoundingClientRect();
      let rightPosition = positions["right"];
      let bottomPosition = positions["bottom"];

      let overflowRight = rightBorder - rightPosition;
      let overflowBottom = bottomBorder - bottomPosition;
  
      if(overflowRight < 0) this.overflowRight = true;   
      if(overflowBottom < 0) this.overflowBottom = true;   
    },0); 
  } 

  //ignore button of dropdown
  ignore() {
    this.result.misspelled = false; 
    this.ignoreRequest.next();
  }

  //when user clicks provided suggestion or inputs their own
  updateWord(suggestion) {
    this.result.word = suggestion; 
    this.result.misspelled = false; 
  }

  //tracks user input of other suggestion
  otherChange() {
    this.otherInput ? this.other = true : this.other = false;
    console.log(this.otherInput)
  }
  
  constructor() { }

  ngOnInit(): void {
    this.setTittle();
    this.dropdownID = this.wordID + "dropdown";
    //remove misspelled status if changed
    // window.addEventListener("keydown", () => {
    //   setTimeout( ()=> {
    //     if(this.misspelledWord && this.result && document.getElementById(this.wordID) && this.result.word !== document.getElementById(this.wordID).innerText) {
    //       this.result.misspelled = false; 
    //     }
    //   },0);
    // });
  }

}
