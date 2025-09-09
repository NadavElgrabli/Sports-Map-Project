import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloseUsersDirective } from '../directives/close-users-highlight.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [CloseUsersDirective, LoadingSpinnerComponent],
  imports: [CommonModule],
  exports: [CloseUsersDirective, LoadingSpinnerComponent], 
})
export class SharedModule {}
