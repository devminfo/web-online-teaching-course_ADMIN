import { ComponentFixture, TestBed } from '@angular/core/testing';

import { C16BankAccounntsAddComponent } from './c16-bank-accounnts-add.component';

describe('C16BankAccounntsAddComponent', () => {
  let component: C16BankAccounntsAddComponent;
  let fixture: ComponentFixture<C16BankAccounntsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ C16BankAccounntsAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(C16BankAccounntsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
