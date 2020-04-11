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

 
  
  
 

  @ViewChild("contentBodyContainer") contentBodyContainer: ElementRef;
  // @ViewChildren('suggestions')suggestions: QueryList<ElementRef>;
  
  resize() {
    this.fullScreen = !this.fullScreen;
  }

  setContent () {
    // console.log("Raw:",this.content)
    // console.log("Live:",this.contentBodyContainer.nativeElement.textContent)
    this.content = this.contentBodyContainer.nativeElement.textContent.replace(/No\sSuggestions\sFoundIgnore/g,"").replace(/Suggestions\s\w+\sIgnore/g,"").replace(/\s{3,}/g," ").replace(/\s{2}/g,"").trim();
    // console.log("Set:",this.content)
    this.splitContent = this.content.split(/\s+/);
    this.setWordCount();
    this.checkSpanChange();
  }

  setWordCount() {
    this.splitContent[0] === "" ? this.wordcount = 0 : this.wordcount = this.splitContent.length;
  }
  
  checkContent () {
    //configure to empty stay
    if(!this.content) return; 
    let request = {content: this.content}
    console.log("request",this.content)
    this.dictionary.checkContent(request)
      .subscribe( response => {
          let misspellings = [];
          for(let i = 0; i < response["results"].length; i ++){
            if(response["results"][i].misspelled)misspellings.push(response["results"][i].word);
          }
          this.misspellings = misspellings;
          console.log("raw response", this.response)

          let configuredResponse = this.configureResponse(response["results"]);
          this.response = configuredResponse;
          this.setContent();
          console.log("response", this.response)
          // console.log(this.misspellings,this.response,this.splitContent)

          // this.misspellings = this.response.filter(result => result["suggestions"].length > 0);
          // let hiddenRendser = document.query
          // this.setInnerHTML();
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
        if(i !== lastLoop) configuredResponse.push(createResult(""));
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
        if(i !== lastLoop) configuredResponse.push(createResult(""));
      }
    }
    return configuredResponse;
  }


  eraseContent () {
    // this.contentBodyContainer.nativeElement.textContent = null;
    // this.content = null;  
    // this.wordcount = 0;
  }

  checkSpanChange () {
    // for(let i = 0; i < this.misspellings.length; i++){
    //   if(this.splitContent.indexOf(this.misspellings[i]) === -1){

    //     let index = this.response.findIndex(result => result.word === this.misspellings[i]);
    //     console.log("change made",this.response[index].word,this.misspellings[i]);

    //     this.response[index].misspelled = false;
    //   }
    // }

  }

  // changeSpan(misspelling, index) {

  // }

 
  
  constructor(private dictionary: DictionaryService) {}

  //required to avoid initial animation for resize button transition 
  ngOnInit(): void {
    this.response = [{word: " ", suggestion: [], misspelled: false}];
    this.misspellings = [];
    setTimeout(
      ()=> this.preload = false,
      500
    )
  }

  test () {
    alert("test")
  }



}
