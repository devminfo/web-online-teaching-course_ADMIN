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
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/api/00auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { SettingService } from 'src/app/core/services/features/f12-setting.service';
import { StoresService } from 'src/app/core/services/features/stores.service';

@Component({
  selector: 'app-f16-store-add',
  templateUrl: './f16-store-add.component.html',
  styleUrls: ['./f16-store-add.component.scss'],
})
export class F16StoreAddComponent implements OnInit, AfterViewInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  idOwner: any;
  timeZoneData: any[] = [];

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
    autoSendTemplates: [],
    idStoreModules: [],
  };

  //binding uploads image or file
  @ViewChild('inputImage', { static: false })
  inputImage: ElementRef;

  //form
  form: FormGroup;

  /**
   * constructor
   * @param api
   * @param authService
   * @param settingService
   * @param common
   * @param router
   * @param cdr
   * @param formBuilder
   */
  constructor(
    private api: StoresService,
    private authService: AuthService,
    private settingService: SettingService,
    public common: CommonService,
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
      autoSendTemplates: [null, []],
      idStoreModules: [null, []],
    });
  }

  /**
   * ng OnInit
   */
  ngOnInit(): void {
    // load data time zone
    this.getTimeZone();
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
   * get Id Owner
   */
  getIdOwner() {
    let id = this.authService.getAuthFromLocalStorage();
    this.idOwner = id?.user._id;
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
   * on Upload Image Click
   */
  onUploadImageClick() {
    this.subscription.push(
      this.common.uploadImageCore(this.inputImage).subscribe((data) => {
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

    // check form pass all validate
    if (!this.form.invalid) {
      // show loading
      this.isLoading$.next(true);

      this.getIdOwner();
      this.input.idOwner = this.idOwner;

      let images = [];
      images.push(this.input.thumbnail);
      // check value thumbnail
      if (this.input.thumbnail != '') {
        this.common.comfirmImages(images).subscribe((data) => {
          // Set public image
          this.input.thumbnail = data[0][4];
          this.subscription.push(
            this.api.add(this.input).subscribe(() => {
              // hide loading
              this.isLoading$.next(false);
              this.cdr.detectChanges();
              this.common.showSuccess('Insert new success!');
              // redirect to list
              this.router.navigate(['/features/stores']);
            })
          );
        });
      }
    }
  }
}
