import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPrice } from './card-price';

describe('CardPrice', () => {
  let component: CardPrice;
  let fixture: ComponentFixture<CardPrice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPrice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardPrice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
