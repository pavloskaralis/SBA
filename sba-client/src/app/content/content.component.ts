import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { DictionaryService } from '../dictionary.service';

@Component({
  selector: 'content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  response: any; 
  content;
  innerHTML;
  splitContent;
  wordcount = 0; 
  preload = true; 
  fullScreen = false; 
  word = "test";


  @ViewChild("contentContainerBody") contentContainerBody: ElementRef;

  setContent () {
    this.content = this.contentContainerBody.nativeElement.textContent;
    this.splitContent = this.content.trim().replace(/Suggestion\w+(Ignore|Submit)/,'').split(/\s+/);
    console.log(this.splitContent)
    this.splitContent[0] === "" ? this.wordcount = 0 : this.wordcount = this.splitContent.length;
  }

  checkContent () {
    if(!this.content) return; 
    let request = {content: this.content}
    this.dictionary.checkContent(request)
      .subscribe( response => {
          this.response = response;
          console.log(this.response);
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

  eraseContent () {
    this.contentContainerBody.nativeElement.textContent = null;
    this.content = null;  
    this.wordcount = 0;
  }

  resize() {
    this.fullScreen = !this.fullScreen;
  }
  
  constructor(private dictionary: DictionaryService) {}

  //required to avoid initial animation for resize button transition 
  ngOnInit(): void {
    setTimeout(
      ()=> this.preload = false,
      500
    )
  }

}
