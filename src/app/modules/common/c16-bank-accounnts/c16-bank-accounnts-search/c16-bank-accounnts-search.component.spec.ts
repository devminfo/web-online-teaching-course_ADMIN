import { ComponentFixture, TestBed } from '@angular/core/testing';

import { C16BankAccounntsSearchComponent } from './c16-bank-accounnts-search.component';

describe('C16BankAccounntsSearchComponent', () => {
  let component: C16BankAccounntsSearchComponent;
  let fixture: ComponentFixture<C16BankAccounntsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ C16BankAccounntsSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(C16BankAccounntsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
