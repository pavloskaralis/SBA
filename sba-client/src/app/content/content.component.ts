import { Component, OnInit, Input, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { DictionaryService } from '../dictionary.service';
import { last } from 'rxjs/operators';

@Component({
  selector: 'content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  preload = true; 
  fullScreen = false; 

  content;
  splitContent;
  wordcount = 0; 

  response: any; 
  misspellings: any; 

 
  innerHTML = "";
  
  
 

  @ViewChild("contentBodyContainer") contentBodyContainer: ElementRef;
  // @ViewChildren('suggestions')suggestions: QueryList<ElementRef>;
  
  resize() {
    this.fullScreen = !this.fullScreen;
  }

  setContent () {
    this.content = this.contentBodyContainer.nativeElement.textContent.trim();
    this.splitContent = this.content.replace(/(Suggestion|No)\w+(Ignore|Submit)/,'').split(/\s+/);
    // console.log(this.splitContent);
    this.setWordCount();
    // this.checkSpanChange();
  }

  setWordCount() {
    this.splitContent[0] === "" ? this.wordcount = 0 : this.wordcount = this.splitContent.length;
  }
  
  configureResponse(response) {
    //readd punctuation and spaces
    let configuredResponse = [];
    let createResult = word => {return {word: word, suggestions: [], misspelled: false}};
    for(let i = 0; i < response.length; i++) {
      let result = response[i];
      let original = this.splitContent[i];
      let lastIndex = original.split("").length - 1;
      let lastChar = original.split("")[lastIndex];
      if(result.word === this.splitContent[i]){
        // result.word += " ";
        configuredResponse.push(result);
        configuredResponse.push(createResult(""));
      } else {
        if(lastChar === "s") {
          result.word += lastChar;
          configuredResponse.push(result);
          configuredResponse.push(createResult(""));
        } else {
          configuredResponse.push(result);
          configuredResponse.push(createResult(lastChar));
          configuredResponse.push(createResult(""));
        }
      }
    }
    return configuredResponse;
  }

  checkContent () {
    //configure to empty stay
    if(!this.content) return; 
    console.log(this.content);
    let request = {content: this.content}
    this.dictionary.checkContent(request)
      .subscribe( response => {
          console.log(response)
          let configuredResponse = this.configureResponse(response["results"]);
          this.response = configuredResponse;
          console.log(configuredResponse)
          // console.log(this.response);
          // this.misspellings = this.response.filter(result => result["suggestions"].length > 0);
          // let hiddenRendser = document.query
          // this.setInnerHTML();
          // console.log(this.misspellings)
      }, (error: Response) => {
        console.log(error)
        if(error.status === 404) {
          console.log(error)
        } else if (error.status === 400) {
          console.log(error)
        } else {
          console.log(error);
        }
      })
  }

  setInnerHTML () {
    let hiddenRenders = document.querySelector(".hidden-renders");
    setTimeout( ()=> {
      // console.log(hiddenRenders);
      let children = hiddenRenders.children; 
      let childrenInnerHTML = [];
      let childrenContent = [];
      for(let i = 0; i < children.length; i ++) {
        childrenInnerHTML.push(children[i].innerHTML);
        childrenContent.push(children[i].textContent.trim().split(" ")[0]);
      }
      let merged = [];
      for(let i = 0; i < this.splitContent.length; i++) {
        let matchedIndex = childrenContent.indexOf(this.splitContent[i]); 
        matchedIndex === -1 ? merged.push(this.splitContent[i]) : merged.push(childrenInnerHTML[matchedIndex]);
      }

      let newInnerHTML = merged.join(" ");
      this.innerHTML = newInnerHTML;
    }, 0);
    
  }

  eraseContent () {
    // this.contentBodyContainer.nativeElement.textContent = null;
    // this.content = null;  
    // this.wordcount = 0;
  }

  // checkSpanChange () {
  //   this.misspellings.forEach( (misspelling, index) => {
  //     if(this.splitContent.indexOf(misspelling) === -1) return this.changeSpan(misspelling, index); 
  //   });
  // }

  // changeSpan(misspelling, index) {

  // }

 
  
  constructor(private dictionary: DictionaryService) {}

  //required to avoid initial animation for resize button transition 
  ngOnInit(): void {
    this.response = [{word: "", suggestion: [], misspelled: false}];
    setTimeout(
      ()=> this.preload = false,
      500
    )
  }

  test () {
    alert("test")
  }



}
