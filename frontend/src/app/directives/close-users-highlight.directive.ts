import { Directive, Input, HostBinding, OnInit } from '@angular/core';

@Directive({
  selector: '[appCloseUsersHighlight]',
})
export class CloseUsersDirective implements OnInit {
  @Input('appCloseUsersHighlight') distance: number = 0; 
  @HostBinding('style.backgroundColor') backgroundColor: string = 'transparent';

  ngOnInit() {
    this.backgroundColor = this.distance <= 1.5 ? '#e1ff00ff' : 'transparent';
  }
}
