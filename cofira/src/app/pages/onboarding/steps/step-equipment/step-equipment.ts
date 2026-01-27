import {Component, EventEmitter, inject, Output, signal} from '@angular/core';
import {OnboardingService} from '../../../../services/onboarding.service';
import {Button} from '../../../../components/shared/button/button';
import {Chip} from '../../../../components/shared/chip/chip';

interface EquipmentOption {
  id: string;
  label: string;
}

@Component({
  selector: 'app-step-equipment',
  standalone: true,
  imports: [Button, Chip],
  templateUrl: './step-equipment.html',
  styleUrl: './step-equipment.scss'
})
export class StepEquipment {
  @Output() continuar = new EventEmitter<void>();
  readonly options: EquipmentOption[] = [
    {id: "mancuernas", label: "Mancuernas"},
    {id: "barra", label: "Barra olimpica"},
    {id: "kettlebell", label: "Kettlebell"},
    {id: "bandas", label: "Bandas elasticas"},
    {id: "banco", label: "Banco de pesas"},
    {id: "rack", label: "Rack/Jaula"},
    {id: "poleas", label: "Poleas/Cables"},
    {id: "maquinas", label: "Maquinas"},
    {id: "bicicleta", label: "Bicicleta estatica"},
    {id: "cinta", label: "Cinta de correr"},
    {id: "remo", label: "Maquina de remo"},
    {id: "trx", label: "TRX/Suspension"}
  ];
  readonly selectedEquipment = signal<string[]>([]);
  private readonly onboardingService = inject(OnboardingService);

  constructor() {
    const data = this.onboardingService.formData();
    if (data.equipment && data.equipment.length > 0) {
      this.selectedEquipment.set([...data.equipment]);
    }
  }

  isSelected(id: string): boolean {
    return this.selectedEquipment().includes(id);
  }

  onToggle(id: string): void {
    const current = this.selectedEquipment();
    if (current.includes(id)) {
      this.selectedEquipment.set(current.filter(e => e !== id));
    } else {
      this.selectedEquipment.set([...current, id]);
    }
  }

  onContinue(): void {
    this.onboardingService.setField("equipment", this.selectedEquipment());
    this.continuar.emit();
  }

  onSkip(): void {
    this.onboardingService.setField("equipment", []);
    this.continuar.emit();
  }
}
