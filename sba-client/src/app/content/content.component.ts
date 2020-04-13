import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DictionaryService } from '../dictionary.service';

@Component({
  selector: 'content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  //prevents animations on page load
  preload: boolean = true; 
  fullScreen: boolean = false; 
  //reconfigured text content
  content: string = " ";
  //stores pre-response values for response configuration and misspelled value change check; also used to set word count
  splitContent: any[]; //string and regex
  //last character of unconfigured response for checking value changes of misspelled words
  lastChar: any; //string and regex
  wordcount: number = 0; 
  //configured response of results from api
  response: { word: string, suggestions: string[], misspelled: boolean }[] = [
    {word: " ", suggestions: [], misspelled: false}
  ]; 
  //all misspelled results for checking value changes of misspelled words
  misspellings:{ word: string, suggestions: string[], misspelled: boolean }[] = [];  
  //stores all ignored
  ignored: string[] = [];  
  //loading state boolean
  loading: boolean = false;
  //pop up toggle for no misspellings and clipboard copied
  popup: boolean = false; 
  //message for popup
  status: {message: string, check: boolean};
  //disable content editable when loading

  @ViewChild("contentBodyContainer") contentBodyContainer: ElementRef;
  
  //resize button
  resize() {
    this.fullScreen = !this.fullScreen;
  }
  //tracks user input to body content
  onChange() {
    console.log("works")
    this.setContent();
    this.checkMisspelledChange();
  }
  //configure text content for api request
  setContent () {
    // console.log("Raw:",this.content)
    // console.log("Live:",this.contentBodyContainer.nativeElement.textContent)
    let noTrim = this.contentBodyContainer.nativeElement.textContent.replace(/No\sSuggestions\s(FoundIgnore|FoundSubmit)/g,"").replace(/Suggestions\s[a-zA-Z0-9 '\-]+\s(Ignore|Submit)/g,"").replace(/\s{3,}/g," ").replace(/\s{2}/g,"");
    this.lastChar = noTrim.split("")[noTrim.length -1];
    this.content = noTrim.trim();
    //prevents content-editable from delete innerHTML formatting
    if(!this.content.charCodeAt(0)) {
      this.response = [{word: " ", suggestions: [], misspelled: false}];
      this.misspellings = [];
    }
    // console.log("next:",this.contentBodyContainer.nativeElement.textContent.charCodeAt(0))
    // console.log("Set:",this.content)
    this.splitContent = this.content.replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g,"").split(/\s+/);
    this.setWordCount();
  }

  setWordCount() {
    this.splitContent[0] === "" ? this.wordcount = 0 : this.wordcount = this.splitContent.length;
  }
  
  //check button api call
  checkContent () {
    //configure to empty stay
    this.popup = false;
    this.loading = true;
    let request = {content: this.content}
    // console.log("request",this.content)
    this.dictionary.checkContent(request)
      .subscribe( response => {
          console.log("raw response", response["results"])
          let configuredResponse = this.configureResponse(response["results"]);
          setTimeout(()=> {
            this.response = configuredResponse;
            this.setContent();
            console.log("response", this.response)
            this.misspellings = this.response.filter(result => result.misspelled);
            this.loading = false; 
            if(this.misspellings.length === 0) {
              this.popup = true;
              this.status = {message: "No Misspellings Found", check: true};
            }
          },0);
      }, (error: Response) => {
        if(error.status === 404) {
          console.log(error.status)
        } else if (error.status === 400) {
          console.log(error.status)
        } else {
          console.log(error.status)
        }
      })
  }

  configureResponse(response) {
    //re-add punctuation and spaces
    let configuredResponse = [];
    let createResult = word => {return {word: word, suggestions: [], misspelled: false}};
    //re-add spacing and any removed characters from plural to singular conversion by api
    for(let i = 0; i < response.length; i++) {
      let lastLoop = response.length - 1;
      let result = response[i];
      let request = this.splitContent[i];
      let lastIndex = request.split("").length - 1;
      let lastChar = request.split("")[lastIndex];
      let exceptLast = request.slice(0,request.length - 1);
      //if result word exactly matches request word directly add it
      if(result.word === request){
        configuredResponse.push(result);
        //otherwise
      } else {
        //if all but the last characters match
        if(result.word.slice(0,result.word.length - 1) === exceptLast) {
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
      }
      //add space between words except for end
      if(i !== lastLoop) configuredResponse.push(createResult(""));
      //don't consider ignored words as misspelled
      if(this.ignored.indexOf(result.word) !== -1) result.misspelled = false; 
    }
    return configuredResponse;
  }

  addIgnored (ignored) {
    this.ignored.push(ignored)
  }

  //old method
  checkMisspelledChange () {
    for(let i = 0; i < this.misspellings.length; i++){
      //when a character is added alter word to no longer be misspelled
      if(this.splitContent.indexOf(this.misspellings[i].word) === -1){
        console.log("change:",this.misspellings[i], this.splitContent);
        let index = this.response.findIndex(result => result.word === this.misspellings[i].word);
        this.misspellings.splice(i,1);
        console.log(index)
        this.response[index].misspelled = false;
        this.setContent();
      }
      // same as above but incase a space is added
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

  //copy button
  copyContent () {
    let textarea = document.createElement("textarea")
    textarea.value = this.content;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    this.popup = true;
    this.status = {message: "Copied To Clipboard", check: false};
  }

  //erase button
  eraseContent() {
    this.response = [{word: " ", suggestions: [], misspelled: false}];
    this.popup = false; 
    setTimeout(()=> this.setContent(), 0); 
  }

  closePopup() {
    this.popup = false;
  }
  constructor(private dictionary: DictionaryService) {}

  //required to avoid initial animation for resize button transition 
  ngOnInit(): void {
    setTimeout(
      ()=> {
        this.preload = false;     
    },500)
  }

}
