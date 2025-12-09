import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Gimnasio} from './gimnasio';

describe('Gimnasio', () => {
  let component: Gimnasio;
  let fixture: ComponentFixture<Gimnasio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gimnasio]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Gimnasio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
