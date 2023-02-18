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
import { CommonService } from 'src/app/core/services/common.service';
import { StoreModuleService } from 'src/app/core/services/features/f15-store-module.service';

@Component({
  selector: 'app-f15-store-module-update',
  templateUrl: './f15-store-module-update.component.html',
  styleUrls: ['./f15-store-module-update.component.scss'],
})
export class F15StoreModuleUpdateComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  arrayImg: any = [];
  styleImg = 'background-image: url(assets/media/svg/files/blank-image.svg)';
  isCheckUploadImg = false;

  // binding data
  input = {
    thumbnail: '',
    title: '',
    position: '',
    link: '',
  };

  //binding uploads image or file
  @ViewChild('inputImage', { static: false })
  inputImage: ElementRef;

  //form
  form: FormGroup;
  id: any;

  /**
   * Constructor
   * @param api
   * @param common
   * @param route
   * @param router
   * @param cdr
   * @param formBuilder
   */
  constructor(
    private api: StoreModuleService,
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
      thumbnail: [null, [Validators.required]],
      title: [null, [Validators.required]],
      position: [null, [Validators.required, Validators.min(1)]],
      link: [null, [Validators.required]],
    });
  }
  /**
   * ng On Init
   */
  ngOnInit(): void {
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
   * on Load Data By Id
   * @param id
   */
  onLoadDataById(id: String) {
    // show loading
    this.isLoading$.next(true);

    this.subscription.push(
      this.api.find(id).subscribe((data) => {

        // load data to view input
        this.input = {
          thumbnail: data.thumbnail,
          title: data.title,
          position: data.position,
          link: data.link,
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
   * on Upload Image Click
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
   * on Add New Btn Click
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
              this.router.navigate(['/features/storemodules']);
            })
          );
        });
      }
    }
  }
}
