import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CertificateService } from 'src/app/core/services/features/f5-certificate.service';
import { CommonService } from 'src/app/core/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubSpecializeService } from 'src/app/core/services/features/f2-sub-specialize.service';

@Component({
  selector: 'app-f5-certificate-add',
  templateUrl: './f5-certificate-add.component.html',
  styleUrls: ['./f5-certificate-add.component.scss'],
})
export class F5CertificateAddComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  subSpecializes: any[];

  // binding data
  input: any = {
    idSubSpecialize: '',
    title: '',
    thumbnail: '',
    banner: '',
    level: '',
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

  // binding uploads image or file
  @ViewChild('inputBanner', { static: false })
  inputBanner: ElementRef;

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
    private api: CertificateService,
    private common: CommonService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private subSpecializeService: SubSpecializeService,
    private formBuilder: FormBuilder
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );

    // get all certificates
    this.getAllSubSpecializes();

    // add validate for controls
    this.form = this.formBuilder.group({
      idSubSpecialize: [null, [Validators.required]],
      title: [null, [Validators.required]],
      thumbnail: [null, [Validators.required]],
      banner: [null, []],
      level: [null, [Validators.required]],
    });
  }

  /**
   * ngOnInit
   */
  ngOnInit() {}

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
   * Get all certificates
   */
  getAllSubSpecializes() {
    this.subscription.push(
      this.subSpecializeService.get().subscribe((data) => {
        this.subSpecializes = data;
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
          this.input.thumbnail = data['files'][0];
        }
      })
    );
  }

  /**
   * onThumbnailDeleteClick
   */
  onThumbnailDeleteClick() {
    const isDelete = confirm('Bạn có muốn xóa hình? ');
    if (isDelete) this.input.thumbnail = '';
  }

  /**
   * onBannerUploadClick
   */
  onBannerUploadClick() {
    this.subscription.push(
      this.common.uploadImageCore(this.inputBanner).subscribe((data) => {
        if (data) {
          this.input.banner = data['files'][0];
        }
      })
    );
  }

  /**
   * onBannerDeleteClick
   */
  onBannerDeleteClick() {
    const isDelete = confirm('Bạn có muốn xóa hình? ');
    if (isDelete) this.input.banner = '';
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

      // Create list image uploads
      let images = [];
      if (this.input.thumbnail) images.push(this.input.thumbnail);
      if (this.input.banner) images.push(this.input.banner);

      if (images.length > 0)
        return this.common.comfirmImages(images).subscribe((data) => {
          // Set public image
          this.input.thumbnail = this.input.thumbnail ? data[0][4] : '';
          this.input.banner = this.input.banner ? data[1][1] : '';

          this.subscription.push(
            this.api.add(this.input).subscribe(() => {
              // hide loading
              this.isLoading$.next(false);
              this.cdr.detectChanges();

              this.common.showSuccess('Insert new success!');

              // redirect to list
              this.router.navigate(['/features/certificates']);
            })
          );
        });

      this.subscription.push(
        this.api.add(this.input).subscribe(() => {
          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();

          this.common.showSuccess('Insert new success!');

          // redirect to list
          this.router.navigate(['/features/certificates']);
        })
      );
    }
  }
}
