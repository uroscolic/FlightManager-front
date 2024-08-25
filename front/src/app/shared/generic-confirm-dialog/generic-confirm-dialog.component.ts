import { Component, Inject } from '@angular/core';
import { MatCardTitle } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { ButtonCloseDirective, ButtonDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective } from '@coreui/angular';

@Component({
  selector: 'app-generic-confirm-dialog',
  standalone: true,
  imports: [
    ButtonDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ThemeDirective,
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalFooterComponent,
    MatCardTitle,
    MatDialogActions,
    MatDialogContent,
  ],
  templateUrl: './generic-confirm-dialog.component.html',
  styleUrl: './generic-confirm-dialog.component.css'
})
export class GenericConfirmDialogComponent {

  constructor(public dialogRef: MatDialogRef<GenericConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, message: string }) { }
}
