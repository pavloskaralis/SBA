import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  preload = true; 
  fullScreen = false; 

  resize() {
    this.fullScreen = !this.fullScreen;
  }
  
  constructor() { }

  ngOnInit(): void {
    setTimeout(
      ()=> this.preload = false,
      500
    )
  }

}
