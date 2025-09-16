import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';
import { CloseUsersDirective } from '../directives/close-users-highlight.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { AddMediaDialogComponent } from './add-media-dialog/add-media-dialog.component';

@NgModule({
  declarations: [
    CloseUsersDirective,
    LoadingSpinnerComponent,
    AddMediaDialogComponent,
  ],
  imports: [CommonModule, MaterialModule, FormsModule],
  exports: [
    CloseUsersDirective,
    LoadingSpinnerComponent,
    AddMediaDialogComponent,
  ],
})
export class SharedModule {}
