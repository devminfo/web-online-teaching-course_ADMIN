import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/api/00auth.service';
import flatpickr from 'flatpickr';
import { F8VoucherTemplateDefaultService } from 'src/app/core/services/features/f8-voucher-template-default.service';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-f8-voucher-template-default-update',
  templateUrl: './f8-voucher-template-default-update.component.html',
  styleUrls: ['./f8-voucher-template-default-update.scss'],
})
export class F8VoucherTemplateDefaultUpdateComponent
  implements OnInit, OnDestroy
{

  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  startTime: any;
  endTime: any;
  startDate: any;
  endDate: any;
  arrayAvatar: any = [];
  idOwner: any;
  styleAvatar = 'background-image: url(./assets/media/svg/files/image.svg)';
  isCheckUploadImg: boolean = false;
  // binding uploads image or file
  @ViewChild('inputThumbnail', { static: false })
  inputThumbnail: ElementRef;

  // update data
  update: any = {
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
  id: any;
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
    private voucherTemplateDefault: F8VoucherTemplateDefaultService,
    public common: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
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
        [Validators.max(100), Validators.min(0), Validators.required],
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
    // get id from url
    this.id = this.route.snapshot.paramMap.get('id');

    // load data by param
    if (this.id) {
      this.onLoadDataById(this.id);
    }

    // load start Date
    flatpickr('#startDate_datepicker', {
      dateFormat: 'Y-m-d',
      minDate: 'today',
    });

    // load end Date
    flatpickr('#endDate_datepicker', {
      dateFormat: 'Y-m-d',
      minDate: this.update.endDate || 'today',
    });

    // load start Time
    flatpickr('#startTime_timepicker', {
      enableTime: true,
      noCalendar: true,
      time_24hr: true,
    });

    // load end Time
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
    this.update.unitTypeDiscount = checked;
  }

  /**
   * changeIsCheckedFalse
   * @param checked
   */
  changeIsCheckedFalse(checked: string) {
    this.update.unitTypeDiscount = checked;
  }

  /**
   * onLoadDataById
   * @param id
   */
  onLoadDataById(id: String) {
    // show loading
    this.isLoading$.next(true);
    this.subscription.push(
      this.voucherTemplateDefault.find(id).subscribe((data) => {
        // load data to view input
        this.update = {
          thumbnail: data.thumbnail,
          title: data.title,
          code: data.code,
          startDateTime: data.startDateTime,
          endDateTime: data.endDateTime,
          priceDiscount: data.priceDiscount,
          percentDiscount: data.percentDiscount,
          originalQuantity: data.originalQuantity,
          minOrder: data.minOrder,
          maxDiscount: data.maxDiscount,
          description: data.description,
          idOwner: data.idOwner,
          unitTypeDiscount: data.unitTypeDiscount,
        };

        //thumbnail
        if (this.update.thumbnail != '') {
          this.arrayAvatar.push(this.update.Thumbnail);
          this.styleAvatar = `background-image: url(${this.update.thumbnail})`;
        }

        // startDate
        this.startDate = this.common.formatUnixTimestampToDDMMYYY(
          data.startDateTime
        );

        // endDate
        this.endDate = this.common.formatUnixTimestampToDDMMYYY(
          data.endDateTime
        );

        // startTime
        this.startTime = this.common.formatUnixTimestampToHHIISS(
          data.startDateTime
        );

        // endTime
        this.endTime = this.common.formatUnixTimestampToHHIISS(
          data.endDateTime
        );

        //hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();
      })
    );
  }

  /**
   * onThumbnailUploadClick
   */
  onThumbnailUploadClick() {
    this.subscription.push(
      this.common.uploadImageCore(this.inputThumbnail).subscribe((data) => {
        if (data) {
          this.update.thumbnail = data['files'][0];
          this.isCheckUploadImg = true;
        }
      })
    );
  }

  /**
   * onUpdateBtnClick
   */
  onUpdateBtnClick() {
    // touch all control to show error
    this.form.markAllAsTouched();
    if (
      this.common.differenceBetweenDates(
        new Date(this.startDate!),
        new Date(this.endDate!)
      ) <= 0
    ) {
      this.common.showError(
        'The end date must be greater than the start date.'
      );
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
    if (!this.isCheckUploadImg) {
      this.form.controls['thumbnail'].removeValidators(Validators.required);

      this.form.controls['thumbnail'].updateValueAndValidity();
    }
    if (!this.form.invalid) {
      // show loading
      this.isLoading$.next(true);

      // startDateTime getTime
      this.update.startDateTime = new Date(
        this.startDate + ' ' + this.startTime
      ).getTime();

      // endDateTime getTime
      this.update.endDateTime = new Date(
        this.endDate + ' ' + this.endTime
      ).getTime();

      //getIdOwner
      this.getIdOwner();
      this.update.idOwner = this.idOwner;

      //getImage
      let images = [];
      if (this.update.thumbnail) images.push(this.update.thumbnail);

      if (images.length > 0) {
        this.common.comfirmImages(images).subscribe((data) => {
          // Set public image
          this.update.thumbnail = this.update.thumbnail ? data[0][2] : '';
          this.subscription.push(
            this.voucherTemplateDefault
              .update(this.id, this.update)
              .subscribe(() => {
                // hide loading
                this.isLoading$.next(false);
                this.cdr.detectChanges();
                this.common.showSuccess('Update Success!');

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
