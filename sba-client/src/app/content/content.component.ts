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
  lastChar;
  wordcount = 0; 

  response: any; 
  misspellings: any; 



  // recentCheck = false; 
  
  // 
  @ViewChild("contentBodyContainer") contentBodyContainer: ElementRef;
  // @ViewChildren('suggestions')suggestions: QueryList<ElementRef>;
  
  resize() {
    this.fullScreen = !this.fullScreen;
  }

  onChange() {
    this.setContent();
    this.checkMisspelledChange();
  }
  setContent () {
    // console.log("Raw:",this.content)
 
    console.log("Live:",this.contentBodyContainer.nativeElement.textContent)
    let noTrim = this.contentBodyContainer.nativeElement.textContent.replace(/No\sSuggestions\sFoundIgnore/g,"").replace(/Suggestions\s[a-zA-Z0-9 ]+\sIgnore/g,"").replace(/\s{3,}/g," ").replace(/\s{2}/g,"");
    this.lastChar = noTrim.split("")[noTrim.length -1];
    this.content = noTrim.trim();
    if(!this.content.charCodeAt(0)) {
      this.response = [{word: " ", suggestion: [], misspelled: false}];
    }

    console.log("next:",this.contentBodyContainer.nativeElement.textContent.charCodeAt(0))

    console.log("Set:",this.content)
    this.splitContent = this.content.split(/\s+/);
    this.setWordCount();

    // if(this.recentCheck && this.lastChar.charCodeAt(0) === 160){
    //   let lastIndex = this.response.length -1;
    //   this.response[lastIndex].word += this.lastChar; 
    //   this.recentCheck = !this.recentCheck;
    // }
  }

  setWordCount() {
    this.splitContent[0] === "" ? this.wordcount = 0 : this.wordcount = this.splitContent.length;
  }
  
  checkContent () {
    //configure to empty stay
    if(!this.content) return; 
    let request = {content: this.content}
    // console.log("request",this.content)
    this.dictionary.checkContent(request)
      .subscribe( response => {

          // console.log("raw response", this.response)

          let configuredResponse = this.configureResponse(response["results"]);

          setTimeout(()=> {
            this.response = configuredResponse;
            this.setContent();
            console.log("response", this.response)
            this.misspellings = this.response.filter(result => result.misspelled);
            // this.recentCheck = true; 
          },0);
      }, (error: Response) => {
        if(error.status === 404) {
        } else if (error.status === 400) {
        } else {
        }
      })
  }

  configureResponse(response) {
    //readd punctuation and spaces
    let configuredResponse = [];
    let createResult = word => {return {word: word, suggestions: [], misspelled: false}};
    for(let i = 0; i < response.length; i++) {
      let lastLoop = response.length - 1;
      let result = response[i];
      let request = this.splitContent[i];
      let lastIndex = request.split("").length - 1;
      let lastChar = request.split("")[lastIndex];
      let exceptLast = request.slice(0,request.length -1);
      //if result word exactly matches request word directly add it
      if(result.word === request){
        configuredResponse.push(result);
        // if(i !== lastLoop) configuredResponse.push(createResult(""));
        //otherwise
      } else {
        //if all but the last characters match
        if(result.word.slice(0,request.length -1) === exceptLast) {
          //and the last character is s (plural)
          if(lastChar === "s") {
            //add s back
            result.word += lastChar;
            configuredResponse.push(result);
            //and the last character is punctuation
          } else if (lastChar !== RegExp(/\w/)) {
            configuredResponse.push(result);
            //add punctuation
            configuredResponse.push(createResult(lastChar));
          }
          //otherwise replace result with request
        } else {
          result.word = request;
          configuredResponse.push(result);
        }
        //add space if not the end of content
        // if(i !== lastLoop) configuredResponse.push(createResult(""));
      }
      if(i !== lastLoop) configuredResponse.push(createResult(""));
    }
    return configuredResponse;
  }


  eraseContent () {
    this.response = [{word: " ", suggestion: [], misspelled: false}];
    this.misspellings = [];
  }

  checkMisspelledChange () {
    for(let i = 0; i < this.misspellings.length; i++){
      //when a character is added alter word to no longer be misspelled
      if(this.splitContent.indexOf(this.misspellings[i].word) === -1){
        // console.log("change:",this.misspellings[i], this.splitContent);
        let index = this.response.findIndex(result => result.word === this.misspellings[i].word);
        this.misspellings.splice(i,1);
        this.response[index].misspelled = false;
        this.setContent();
      }
      // incase a space is added
      // console.log(this.misspellings[this.misspellings.length - 1].word === this.splitContent[this.splitContent.length - 1], this.lastChar.charCodeAt(0) )
      
      if(this.lastChar && (this.lastChar.charCodeAt(0) === 115 || this.lastChar.charCodeAt(0) === 160) && (this.misspellings[this.misspellings.length - 1].word === this.splitContent[this.splitContent.length - 1])) {
        let index = this.response.findIndex(result => result.word === this.misspellings[this.misspellings.length - 1].word);
        this.misspellings.splice(i,1);
        this.response[index].misspelled = false;
        this.setContent();
      }
    }
    // console.log(this.content)

  }

  constructor(private dictionary: DictionaryService) {}

  //required to avoid initial animation for resize button transition 
  ngOnInit(): void {
   

    this.response = [{word: " ", suggestion: [], misspelled: false}];
    this.misspellings = [];
    setTimeout(
      ()=> {
        this.preload = false;     
        console.log("first:",this.contentBodyContainer.nativeElement.textContent.charCodeAt(0))
    },500)
  }


}
