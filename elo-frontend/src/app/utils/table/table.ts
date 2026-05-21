import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Column } from '../../model/column.model';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table<T extends Record<string, any>> {
  @Input() columns: Column<T>[] = [];
  @Input() objects: T[] = [];
  @Input() trackByKey: keyof T | string = 'id';
  @Input() showOpen = false;
  @Input() showUpdate = false;
  @Input() showDelete = false;
  @Input() showAdd = false;
  @Input() showRemove = false;

  @Output() open = new EventEmitter<T>();
  @Output() update = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();
  @Output() add = new EventEmitter<T>();
  @Output() remove = new EventEmitter<T>();

  onDblClick(object: T) {
    this.open.emit(object);
  }

  onOpen(object: T) {
    this.open.emit(object);
  }

  onUpdate(object: T) {
    this.update.emit(object);
  }

  onDelete(object: T) {
    this.delete.emit(object);
  }

  onAdd(object: T) {
    this.add.emit(object);
  }

  onRemove(object: T) {
    this.remove.emit(object);
  }

  get hasActions(): boolean {
    return this.showOpen || this.showUpdate || this.showDelete || this.showAdd || this.showRemove;
  }
}
