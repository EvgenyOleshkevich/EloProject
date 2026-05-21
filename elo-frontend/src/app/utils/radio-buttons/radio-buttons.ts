import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RadioOption } from './radio-option';

@Component({
  selector: 'app-radio-buttons',
  standalone: true,
  imports: [],
  templateUrl: './radio-buttons.html',
  styleUrl: './radio-buttons.css',
})
export class RadioButtonsComponent<T = any> {
  @Input() title: string = "";
  @Input() name : string= 'radio-group';
  @Input() options: RadioOption<T>[] = [];
  @Input() selectedValue: T | null = null;

  @Output() selectionChange = new EventEmitter<T>();

  onSelect(option: RadioOption<T>) {
    this.selectionChange.emit(option.value);
  }

  isSelected(option: RadioOption<T>): boolean {
    return this.selectedValue === option.value;
  }
}
