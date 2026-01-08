import {Component, EventEmitter, Output} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Button} from '../../../../components/shared/button/button';

@Component({
  selector: 'app-step-welcome',
  standalone: true,
  imports: [Button, RouterLink],
  templateUrl: './step-welcome.html',
  styleUrl: './step-welcome.scss'
})
export class StepWelcome {
  @Output() continuar = new EventEmitter<void>();

  onContinue(): void {
    this.continuar.emit();
  }
}
