import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProvinceService } from 'src/app/core/services/common/c5-province.service';

declare var $: any;
@Component({
  selector: 'app-c5-province-add',
  templateUrl: './c5-province-add.component.html',
  styleUrls: ['./c5-province-add.component.scss'],
})
export class C5ProvinceAddComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  // binding data
  input = {
    type: 'Tỉnh',
    name: '',
  };

  //form
  form: FormGroup;

  amGet: boolean = false;
  amPost: boolean = false;
  amPut: boolean = false;
  amDelete: boolean = false;

  /**
   * Constructor
   *
   * @param api
   * @param common
   * @param router
   * @param cdr
   * @param formBuilder
   */
  constructor(
    private api: ProvinceService,
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
      type: [null, []],
      name: [null, [Validators.required]],
    });
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    setTimeout(() => {
      $('.js-example-basic-single').select2({
        closeOnSelect: false,
      });
    }, 500);
  }

  /**
   * ng After View Init
   */
  ngAfterViewInit(): void {}

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
      console.log(this.input);

      this.subscription.push(
        this.api.add(this.input).subscribe(() => {
          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();

          this.common.showSuccess('Insert new success!');

          // redirect to list
          this.router.navigate(['/features/provinces']);
        })
      );
    }
  }
}
