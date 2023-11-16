import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-copy-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './copy-input.component.html',
})
export class CopyInputComponent {
  @Input() value!: string;
  public copied: boolean = false;
  constructor(private clipboard: Clipboard) {}
  public copyToClipboard() {
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 1000);
    this.clipboard.copy(this.value);
  }
}
