import {Component, EventEmitter, inject, Output, signal} from '@angular/core';
import {OnboardingService} from '../../../../services/onboarding.service';
import {Button} from '../../../../components/shared/button/button';
import {Chip} from '../../../../components/shared/chip/chip';

interface AllergyOption {
  id: string;
  label: string;
}

@Component({
  selector: 'app-step-allergies',
  standalone: true,
  imports: [Button, Chip],
  templateUrl: './step-allergies.html',
  styleUrl: './step-allergies.scss'
})
export class StepAllergies {
  @Output() continuar = new EventEmitter<void>();
  readonly options: AllergyOption[] = [
    {id: 'gluten', label: 'Gluten'},
    {id: 'lactosa', label: 'Lactosa'},
    {id: 'huevo', label: 'Huevo'},
    {id: 'frutos-secos', label: 'Frutos secos'},
    {id: 'mariscos', label: 'Mariscos'},
    {id: 'pescado', label: 'Pescado'},
    {id: 'soja', label: 'Soja'},
    {id: 'cacahuete', label: 'Cacahuete'},
    {id: 'sesamo', label: 'Sesamo'},
    {id: 'mostaza', label: 'Mostaza'}
  ];
  readonly selectedAllergies = signal<string[]>([]);
  private readonly onboardingService = inject(OnboardingService);

  constructor() {
    const data = this.onboardingService.formData();
    if (data.allergies && data.allergies.length > 0) {
      this.selectedAllergies.set([...data.allergies]);
    }
  }

  isSelected(id: string): boolean {
    return this.selectedAllergies().includes(id);
  }

  onToggle(id: string): void {
    const current = this.selectedAllergies();
    if (current.includes(id)) {
      this.selectedAllergies.set(current.filter(a => a !== id));
    } else {
      this.selectedAllergies.set([...current, id]);
    }
  }

  onContinue(): void {
    this.onboardingService.setField('allergies', this.selectedAllergies());
    this.continuar.emit();
  }

  onSkip(): void {
    this.onboardingService.setField('allergies', []);
    this.continuar.emit();
  }
}
