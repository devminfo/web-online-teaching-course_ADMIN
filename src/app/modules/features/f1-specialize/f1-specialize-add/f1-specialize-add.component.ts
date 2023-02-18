import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SpecializeService } from 'src/app/core/services/features/f1-specialize.service';
import { CommonService } from 'src/app/core/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-f1-specialize-add',
  templateUrl: './f1-specialize-add.component.html',
  styleUrls: ['./f1-specialize-add.component.scss'],
})
export class F1SpecializeAddComponent implements OnInit, AfterViewInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  // binding data
  input = {
    name: '',
    position: ''
  };

  //form
  form: FormGroup;

  amGet: boolean = false;
  amPost: boolean = false;
  amPut: boolean = false;
  amDelete: boolean = false;

  /**
   * constructor
   * @param api
   * @param dialog
   */
  constructor(
    private api: SpecializeService,
    private common: CommonService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );

    // add validate for controls
    this.form = this.formBuilder.group({
      name: [
        null,
        [
          Validators.required,
        ],
      ],
      position: [
        null,
        [
          Validators.required,
        ],
      ],
    });
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
  }

  /**
  * ng After View Init
  */
  ngAfterViewInit(): void {
  }

  /**
   * ngOnDestroy
   */
  ngOnDestroy() {
    this.subscription.forEach((item) => {
      item.unsubscribe();
    });
  }

  /**
   * onAddNewBtnClick
   */
  onAddNewBtnClick() {
    // touch all control to show error
    this.form.markAllAsTouched();

    // check form pass all validate
    if (!this.form.invalid) {
      // show loading
      this.isLoading$.next(true);

      this.subscription.push(
        this.api.add(this.input).subscribe(() => {
          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();

          this.common.showSuccess('Insert new success!');

          // redirect to list
          this.router.navigate(['/features/specializes']);
        })
      );
    }
  }
}
