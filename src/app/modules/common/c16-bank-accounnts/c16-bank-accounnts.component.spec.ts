import { ComponentFixture, TestBed } from '@angular/core/testing';

import { C16BankAccounntsComponent } from './c16-bank-accounnts.component';

describe('C16BankAccounntsComponent', () => {
  let component: C16BankAccounntsComponent;
  let fixture: ComponentFixture<C16BankAccounntsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ C16BankAccounntsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(C16BankAccounntsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
