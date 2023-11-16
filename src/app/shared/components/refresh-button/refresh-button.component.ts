import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ProgressSpinnerMode,
  MatProgressSpinnerModule,
} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-refresh-button',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './refresh-button.component.html',
})
export class RefreshButtonComponent {
  public mode: ProgressSpinnerMode = 'determinate';
  @Input() value: number = 0;
  @Output() refresh: EventEmitter<void> = new EventEmitter();

  public refreshTrigger() {
    this.refresh.emit();
  }
}
