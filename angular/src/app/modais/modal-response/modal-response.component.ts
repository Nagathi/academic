import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-response',
  templateUrl: './modal-response.component.html',
  styleUrls: ['./modal-response.component.css']
})
export class ModalResponseComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalResponseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  fecharModal(): void {
    this.dialogRef.close();
  }
}
