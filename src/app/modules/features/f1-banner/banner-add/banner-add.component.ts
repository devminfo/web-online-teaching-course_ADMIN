import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BannerService } from 'src/app/core/services/features/f1-banner.service';

@Component({
  selector: 'app-banner-add',
  templateUrl: './banner-add.component.html',
  styleUrls: ['./banner-add.component.scss'],
})
export class BannerAddComponent implements OnInit, AfterViewInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  // binding uploads image or file
  @ViewChild('inputImage', { static: false })
  inputImage: ElementRef;

  // binding data
  input: any = {
    text: '',
    image: '',
    position: '',
    isShow: true,
    link: '',
  };

  banners: any[];

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
    private api: BannerService,
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
      text: [null, [Validators.required]],
      image: [null, [Validators.required]],
      position: [null, [Validators.required]],
      isShow: true,
      link: [null, [Validators.required]],
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
   * onImageUploadClick
   */
  onImageUploadClick() {
    this.subscription.push(
      this.common.uploadImageCore(this.inputImage).subscribe((data) => {
        if (data) {
          this.input.image = data['files'][0];
        }
      })
    );
  }

  /**
   * onImageDeleteClick
   */
  onImageDeleteClick() {
    const isDelete = confirm('Bạn có muốn xóa hình? ');
    if (isDelete) this.input.image = '';
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

      if (this.input.image) {
        this.common.comfirmImages([this.input.image]).subscribe((dataImage) => {
          this.input.image = dataImage[0][2];

          this.subscription.push(
            this.api.add(this.input).subscribe(() => {
              // hide loading
              this.isLoading$.next(false);
              this.cdr.detectChanges();

              this.common.showSuccess('Insert new success!');

              // redirect to list
              this.router.navigate(['/features/banners']);
            })
          );
        });
      } else {
        this.subscription.push(
          this.api.add(this.input).subscribe(() => {
            // hide loading
            this.isLoading$.next(false);
            this.cdr.detectChanges();

            this.common.showSuccess('Insert new success!');

            // redirect to list
            this.router.navigate(['/features/banners']);
          })
        );
      }
    }
  }
}
