import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/api/00auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { SettingService } from 'src/app/core/services/features/f12-setting.service';
import { StoresService } from 'src/app/core/services/features/stores.service';

@Component({
  selector: 'app-f16-store-update',
  templateUrl: './f16-store-update.component.html',
  styleUrls: ['./f16-store-update.component.scss'],
})
export class F16StoreUpdateComponent implements OnInit, AfterViewInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  idOwner: any;
  id: any;
  timeZoneData: any[] = [];
  arrayImg: any = [];
  styleImg = 'background-image: url(assets/media/svg/files/blank-image.svg)';
  isCheckUploadImg = false;

  // binding data
  input = {
    idOwner: '',
    thumbnail: '',
    name: '',
    representativeName: '',
    code: '',
    timezoneApp: '',
    businessPhone: '',
    mobilePhone: '',
    email: '',
    city: '',
    state: '',
    country: '',
    areaCode: '',
  };

  //binding uploads image or file
  @ViewChild('inputImage', { static: false })
  inputImage: ElementRef;

  //form
  form: FormGroup;

  constructor(
    private api: StoresService,
    private settingService: SettingService,
    public common: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );

    // add validate for controls
    this.form = this.formBuilder.group({
      idOwner: [null],
      thumbnail: [null, [Validators.required]],
      name: [null, [Validators.required]],
      representativeName: [null, [Validators.required]],
      code: [null, [Validators.required]],
      timezoneApp: [null, [Validators.required]],
      businessPhone: [null, [Validators.required]],
      mobilePhone: [null, [Validators.required]],
      email: [null, [Validators.required]],
      city: [null, []],
      state: [null, []],
      country: [null, []],
      areaCode: [null, []],
    });
  }

  /**
   * ng On Init
   */
  ngOnInit(): void {
    // get id from url
    this.id = this.route.snapshot.paramMap.get('id');

    // load data time zone
    this.getTimeZone();

    // load data by param
    if (this.id) {
      this.onLoadDataById(this.id);
    }
  }

  /**
   * ngAfterViewInit
   */
  ngAfterViewInit(): void {
    // scroll top screen
    window.scroll({ left: 0, top: 0, behavior: 'smooth' });
  }

  /**
   * ng On Destroy
   */
  ngOnDestroy() {
    this.subscription.forEach((item) => {
      item.unsubscribe();
    });
  }

  /**
   * get Time Zone
   */
  getTimeZone() {
    this.settingService.getTimeZone().subscribe((timeZone) => {
      this.timeZoneData = timeZone.data;
    });
  }

  /**
   * onLoadDataById
   * @param id
   */
  onLoadDataById(id: String) {
    // show loading
    this.isLoading$.next(true);

    this.subscription.push(
      this.api.find(id).subscribe((data) => {

        // load data to view input
        this.input = {
          idOwner: data.idOwner,
          thumbnail: data.thumbnail,
          name: data.name,
          representativeName: data.representativeName,
          code: data.code,
          timezoneApp: data.timezoneApp,
          businessPhone: data.businessPhone,
          mobilePhone: data.mobilePhone,
          email: data.email,
          city: data.city,
          state: data.state,
          country: data.country,
          areaCode: data.areaCode,
        };

        if (this.input.thumbnail != '') {
          this.arrayImg.push(this.input.thumbnail);
          this.styleImg = `background-image: url(${this.input.thumbnail})`;
        }

        // hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();
      })
    );
  }

  /**
   * on Upload image Click
   */
  onUploadImageClick() {
    this.subscription.push(
      this.common.uploadImageCore(this.inputImage).subscribe((data) => {
        if (data) {
          if (data['files'].length > 0) {
            this.input.thumbnail = data['files'][0];
            this.isCheckUploadImg = true;
          }
        }
      })
    );
  }

  /**
   * onDeleteImageClick
   */
  onDeleteImageClick() {
    this.input.thumbnail = '';
  }

  /**
   * onAddNewBtnClick
   */
  onAddNewBtnClick() {
    // touch all control to show error
    this.form.markAllAsTouched();

    // check isCheckUploadImg
    if (!this.isCheckUploadImg) {
      this.form.controls['thumbnail'].removeValidators(Validators.required);
      this.form.controls['thumbnail'].updateValueAndValidity();
    }

    // check form pass all validate
    if (!this.form.invalid) {
      // show loading
      this.isLoading$.next(true);

      let images = [];
      images.push(this.input.thumbnail);

      // check thumbnail > 0
      if (this.input.thumbnail != '') {
        this.common.comfirmImages(images).subscribe((data) => {
          // Set public image
          this.input.thumbnail = data[0][4];
          this.subscription.push(
            this.api.update(this.id, this.input).subscribe(() => {
              // hide loading
              this.isLoading$.next(false);
              this.cdr.detectChanges();

              this.common.showSuccess('Update success!');

              // redirect to list
              this.router.navigate(['/features/stores']);
            })
          );
        });
      }
    }
  }
}
