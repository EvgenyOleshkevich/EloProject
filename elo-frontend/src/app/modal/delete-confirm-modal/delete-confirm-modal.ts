import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'delete-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-confirm-modal.html',
  styleUrl: '../modal.css',
})
export class DeleteConfirmModal {
  @Input({ required: true }) title: string = "";
  @Input() message = 'Are you sure you want to delete this item?';

  @Output() confirm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onClose() {
    this.close.emit();
  }
}