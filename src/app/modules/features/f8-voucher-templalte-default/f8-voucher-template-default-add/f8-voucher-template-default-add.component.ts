import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { BehaviorSubject, Observer, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import flatpickr from 'flatpickr';
import { F8VoucherTemplateDefaultService } from 'src/app/core/services/features/f8-voucher-template-default.service';
import { AuthService } from 'src/app/core/services/api/00auth.service';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-f8-voucher-template-default-add',
  templateUrl: './f8-voucher-template-default-add.component.html',
  styleUrls: ['./f8-voucher-template-default-add.scss'],
})
export class F8VoucherTemplateDefaultAddComponent implements OnInit, OnDestroy {

  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  //data

  call: number = 0;
  observer: Observer<any>;
  pageIndex = 1;
  pageLength = 0;
  pageSize = 5;
  conditionFilter: string = '';

  startDate: any;
  endDate: any;
  startTime: any;
  endTime: any;
  idOwner: any;

  // binding data
  input: any = {
    thumbnail: '',
    title: '',
    code: '',
    startDateTime: 0,
    endDateTime: 0,
    priceDiscount: 0,
    percentDiscount: 0,
    originalQuantity: 0,
    minOrder: 0,
    maxDiscount: 0,
    description: '',
    idOwner: '',
    unitTypeDiscount: 'MONEY',
  };

  //form
  form: FormGroup;
  amGet: boolean = false;
  amPost: boolean = false;
  amPut: boolean = false;
  amDelete: boolean = false;

  // binding uploads image or file
  @ViewChild('inputThumbnail', { static: false })
  inputThumbnail: ElementRef;

  /**
   * constructor
   *
   * @param api
   * @param common
   * @param router
   * @param cdr
   * @param subSpecializeService
   * @param formBuilder
   */
  constructor(
    public common: CommonService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private voucherTemplateDefault: F8VoucherTemplateDefaultService,
    private authService: AuthService
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );

    // add validate for controls
    this.form = this.formBuilder.group({
      title: [null, [Validators.required]],
      code: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      startTime: [null, [Validators.required]],
      endTime: [null, [Validators.required]],
      percentDiscount: [
        null,
        [Validators.required, Validators.max(100), Validators.min(0)],
      ],
      originalQuantity: [null, [Validators.required, Validators.min(0)]],
      priceDiscount: [null, [Validators.required, Validators.min(0)]],
      minOrder: [null, [Validators.required, Validators.min(0)]],
      maxDiscount: [null, [Validators.required, Validators.min(0)]],
      description: [null],
      thumbnail: [null, [Validators.required]],
      unitTypeDiscount: [null, [Validators.required, Validators.min(0)]],
      idOwner: [null],
    });
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    
    // load start date
    flatpickr('#startDate_datepicker', {
      dateFormat: 'Y-m-d',
      minDate: 'today',
    });

    // load end date
    flatpickr('#endDate_datepicker', {
      dateFormat: 'Y-m-d',
      minDate: this.input.endDate || 'today',
    });

    // load start time
    flatpickr('#startTime_timepicker', {
      enableTime: true,
      noCalendar: true,
      time_24hr: true,
    });

    // load end time
    flatpickr('#endTime_datepicker', {
      enableTime: true,
      noCalendar: true,
      time_24hr: true,
    });
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
   * changeIsCheckedTrue
   * @param checked
   */
  changeIsCheckedTrue(checked: string) {
    this.input.unitTypeDiscount = checked;
  }

  /**
   * changeIsCheckedFalse
   * @param checked
   */
  changeIsCheckedFalse(checked: string) {
    this.input.unitTypeDiscount = checked;
  }

  /**
   * onThumbnailUploadClick
   */
  onThumbnailUploadClick() {
    this.subscription.push(
      this.common.uploadImageCore(this.inputThumbnail).subscribe((data) => {
        if (data) {
          this.input.thumbnail = data['files'][0];
        }
      })
    );
  }

  /**
   * onAddNewBtnClick
   */
  onAddNewBtnClick() {
    // touch all control to show error
    this.form.markAllAsTouched();
    if (
      this.common.differenceBetweenDates(
        new Date(this.startDate!),
        new Date(this.endDate!)
      ) <= 0
    ) {
      this.common.showError('The End day must be greater than the Start day.');
      return;
    }

    //remote validate priceDiscount
    this.form.controls['priceDiscount'].removeValidators(Validators.required);
    this.form.controls['priceDiscount'].updateValueAndValidity();

    //remote validate percentDiscount
    this.form.controls['percentDiscount'].removeValidators(Validators.required);
    this.form.controls['percentDiscount'].updateValueAndValidity();

    // remote validate maxDiscount
    this.form.controls['maxDiscount'].removeValidators(Validators.required);
    this.form.controls['maxDiscount'].updateValueAndValidity();

    // check form pass all validate
    if (!this.form.invalid) {
      // show loading
      this.isLoading$.next(true);

      // startDateTime getTime
      this.input.startDateTime = new Date(
        this.startDate + ' ' + this.startTime
      ).getTime();

      // endDateTime getTime
      this.input.endDateTime = new Date(
        this.endDate + ' ' + this.endTime
      ).getTime();

      //get idOwner
      this.getIdOwner();
      this.input.idOwner = this.idOwner;

      //getImage
      let images = [];
      if (this.input.thumbnail) images.push(this.input.thumbnail);
      if (images.length > 0) {
        this.common.comfirmImages(images).subscribe((data) => {
          // Set public image
          this.input.thumbnail = this.input.thumbnail ? data[0][2] : '';

          // Create list image uploads
          this.subscription.push(
            this.voucherTemplateDefault.add(this.input).subscribe((data) => {
              // hide loading
              this.isLoading$.next(false);
              this.cdr.detectChanges();
              this.common.showSuccess('Insert new success!');

              // redirect to list
              this.router.navigate(['/features/vouchertemplatedefaults']);
            })
          );
        });
      }
    }
  }

  /**
   * getIdOwner
   */
  getIdOwner() {
    const id = this.authService.getAuthFromLocalStorage();
    this.idOwner = id?.user._id;
  }
}
