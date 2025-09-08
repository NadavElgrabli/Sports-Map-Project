import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloseUsersDirective } from '../directives/close-users-highlight.directive';

@NgModule({
  declarations: [CloseUsersDirective],
  imports: [CommonModule],
  exports: [CloseUsersDirective], 
})
export class SharedModule {}
