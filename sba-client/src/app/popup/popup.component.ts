import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  @Input()
  status: {message: string, type: string};
  @Output()
  closeRequest = new EventEmitter<boolean>(); 

  constructor() { }

  close() {
    this.closeRequest.next();
  }

  ngOnInit(): void {
  }

}
