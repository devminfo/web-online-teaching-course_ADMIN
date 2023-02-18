import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from 'src/app/core/services/features/f5-certificate.service';
import { CommonService } from 'src/app/core/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubSpecializeService } from 'src/app/core/services/features/f2-sub-specialize.service';
@Component({
  selector: 'app-f5-certificate-update',
  templateUrl: './f5-certificate-update.component.html',
  styleUrls: ['./f5-certificate-update.component.scss'],
})
export class F5CertificateUpdateComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  @ViewChild('inputThunail', { static: false })
  inputThunail: ElementRef;

  @ViewChild('inputBanner', { static: false })
  inputBanner: ElementRef;

  // binding data
  input: any = {
    idSubSpecialize: '',
    title: '',
    thumbnail: '',
    banner: '',
    level: '',
  };

  // subSpecializes
  subSpecializes: any[];

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
    private subSpecializeService: SubSpecializeService,
    private api: CertificateService,
    private common: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
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
      thumbnail: [null, []],
      banner: [null, []],
      level: [null, [Validators.required]],
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
          idSubSpecialize: data.idSubSpecialize,
          title: data.title,
          thumbnail: data.thumbnail,
          banner: data.banner,
          level: data.level,
        };

        // hide loading
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
      this.common.uploadImageCore(this.inputThunail).subscribe((data) => {
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
   * onUpdateBtnClick
   */
  onUpdateBtnClick() {
    // touch all control to show error
    this.form.markAllAsTouched();

    // check form pass all validate
    if (!this.form.invalid) {
      // show loading
      this.isLoading$.next(true);

      // confirm use banner
      if (this.input.banner)
        this.common
          .comfirmImages([this.input.banner])
          .subscribe((dataImage) => {
            this.input.banner = dataImage[0][4];
          });

      // confirm use thumbnail
      if (this.input.thumbnail)
        this.common
          .comfirmImages([this.input.thumbnail])
          .subscribe((dataImage) => {
            this.input.banner = dataImage[0][4];
          });

      this.subscription.push(
        this.api.update(this.id, this.input).subscribe(() => {
          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();

          this.common.showSuccess('Update Success!');

          // redirect to list
          this.router.navigate(['/features/certificates']);
        })
      );
    }
  }
}
