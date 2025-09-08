import { Directive, Input, HostBinding, OnInit } from '@angular/core';

@Directive({
  selector: '[appCloseUsersHighlight]',
})
export class CloseUsersDirective implements OnInit {
  //@Input allows data to be passed from the template into the directive.
  @Input('appCloseUsersHighlight') distance: number = 0;

  //@HostBinding binds a property of the host element (the element the directive is attached to).
  @HostBinding('style.backgroundColor') backgroundColor: string = 'transparent';

  ngOnInit() {
    this.backgroundColor = this.distance <= 2 ? '#e1ff00ff' : 'transparent';
  }
}
