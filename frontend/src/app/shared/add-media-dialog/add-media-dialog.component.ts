import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-media-dialog',
  templateUrl: './add-media-dialog.component.html',
  styleUrls: ['./add-media-dialog.component.scss'],
})
export class AddMediaDialogComponent {
  url: string = '';

  constructor(private dialogRef: MatDialogRef<AddMediaDialogComponent>) {}

  _onCancel() {
    this.dialogRef.close();
  }

  _onAdd() {
    if (this.url) {
      this.dialogRef.close(this.url);
    }
  }
}
