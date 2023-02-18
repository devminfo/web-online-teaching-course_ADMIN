import { ComponentFixture, TestBed } from '@angular/core/testing';

import { C16BankAccounntsFilterComponent } from './c16-bank-accounnts-filter.component';

describe('C16BankAccounntsFilterComponent', () => {
  let component: C16BankAccounntsFilterComponent;
  let fixture: ComponentFixture<C16BankAccounntsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ C16BankAccounntsFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(C16BankAccounntsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
