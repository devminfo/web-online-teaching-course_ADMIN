import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { C13SettingService } from 'src/app/core/services/common/c13-setting.service';
import { CommonService } from 'src/app/core/services/common.service';
import { getTimezone } from 'countries-and-timezones';
@Component({
  selector: 'app-c13-setting-update',
  templateUrl: './c13-setting-update.component.html',
  styleUrls: ['./c13-setting-update.component.scss'],
})
export class C13SettingUpdateComponent implements OnInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  arrayAvatar: any = [];
  styleAvatar = 'background-image: url(./assets/media/svg/files/image.svg)';
  isCheckUploadImg: boolean = false;
  dataTimezone: any[] = [];
  dataUTC: any[] = [];
  // update data
  update: any = {
    logo: '',
    timeZoneServer: '',
    timeZoneApp: '',
    accountName: '',
    accountNumber: '',
    bankName: '',
    bankBranch: '',
    policy: '',
  };

  //form
  form: FormGroup;
  id: any;
  amGet: boolean = false;
  amPost: boolean = false;
  amPut: boolean = false;
  amDelete: boolean = false;

  // binding uploads image or file
  @ViewChild('inputLogo', { static: false })
  inputLogo: ElementRef;

  /**
   * constructor
   * @param api
   * @param dialog
   */
  constructor(
    public common: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private settingService: C13SettingService
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );

    // add validate for controls
    this.form = this.formBuilder.group({
      logo: [null, [Validators.required]],
      timeZoneServer: [null, [Validators.required]],
      timeZoneApp: [null, [Validators.required]],
      accountName: [null, [Validators.required]],
      accountNumber: [null, [Validators.required]],
      bankName: [null, [Validators.required]],
      bankBranch: [null, [Validators.required]],
      policy: [null, [Validators.required]],
    });
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    this.getTimezone();

    // get id from url
    this.id = this.route.snapshot.paramMap.get('id');

    // load data by param
    if (this.id) {
      this.onLoadDataById(this.id);
    }
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
   * onLoadDataById
   * @param id
   */
  onLoadDataById(id: String) {
    // show loading
    this.isLoading$.next(true);
    this.subscription.push(
      this.settingService.find(id).subscribe((data) => {
        // load data to view input
        this.update = {
          logo: data.logo,
          timeZoneServer: data.timeZoneServer,
          timeZoneApp: data.timeZoneApp,
          accountName: data.accountName,
          accountNumber: data.accountNumber,
          bankName: data.bankName,
          bankBranch: data.bankBranch,
          policy: data.policy,
        };

        //logo
        if (this.update.logo != '') {
          this.arrayAvatar.push(this.update.logo);
          this.styleAvatar = `background-image: url(${this.update.logo})`;
        }

        //hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();
      })
    );
  }

  /**
   * getTimezone
   */
  getTimezone() {
    this.subscription.push(
      this.settingService.getTimezone().subscribe((data) => {
        this.dataTimezone = data.data;
        for (let i = 0; i < this.dataTimezone.length; i++) {
          this.dataUTC.push(getTimezone(this.dataTimezone[i]).utcOffsetStr);
        }
      })
    );
  }

  /**
   * onUpdateBtnClick
   */
  onUpdateBtnClick() {
    this.form.markAllAsTouched();

    // check form pass all validate
    if (!this.isCheckUploadImg) {
      this.form.controls['logo'].removeValidators(Validators.required);
      this.form.controls['logo'].updateValueAndValidity();
    }
    if (!this.form.invalid) {
      // show loading
      this.isLoading$.next(true);

      let images = [];
      if (this.update.logo) images.push(this.update.logo);

      // nếu tồn tại ảnh thì push vào
      if (images.length > 0)
        return this.common.comfirmImages(images).subscribe((data) => {
          // Set public image
          this.update.logo = this.update.logo ? data[0][2] : '';

          this.subscription.push(
            this.settingService.update(this.id, this.update).subscribe(() => {
              // hide loading
              this.isLoading$.next(false);
              this.cdr.detectChanges();
              this.common.showSuccess('Update Success!');

              // redirect to list
              this.router.navigate(['/common/settings']);
            })
          );
        });
    }
  }

  /**
   * onThumbnailUploadClick
   */
  onThumbnailUploadClick() {
    this.subscription.push(
      this.common.uploadImageCore(this.inputLogo).subscribe((data) => {
        if (data) {
          this.update.logo = data['files'][0];
        }
      })
    );
  }
}
