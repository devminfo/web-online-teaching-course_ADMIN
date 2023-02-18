import { ComponentFixture, TestBed } from '@angular/core/testing';

import { C16BankAccounntsUpdateComponent } from './c16-bank-accounnts-update.component';

describe('C16BankAccounntsUpdateComponent', () => {
  let component: C16BankAccounntsUpdateComponent;
  let fixture: ComponentFixture<C16BankAccounntsUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ C16BankAccounntsUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(C16BankAccounntsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
