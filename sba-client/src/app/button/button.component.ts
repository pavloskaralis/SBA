import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() buttonType: string;
  @Output() click = new EventEmitter<string>();

  callParent(): void {
    this.click.emit();
  }
  
  constructor() { }

  ngOnInit(): void {
  }

}
