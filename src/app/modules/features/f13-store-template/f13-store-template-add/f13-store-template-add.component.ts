import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/api/00auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { F13StoreTemplatesService } from 'src/app/core/services/features/f13-store-templates.service';

@Component({
  selector: 'app-f13-store-template-add',
  templateUrl: './f13-store-template-add.component.html',
  styleUrls: ['./f13-store-template-add.scss'],
})
export class F13StoreTemplateAddComponent implements OnInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  // binding data
  input: any = {
    image: '',
    title: '',
    content: '',
    type: '',
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
    private storeService: F13StoreTemplatesService,
    private authService: AuthService
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );

    // add validate for controls
    this.form = this.formBuilder.group({
      title: [null, [Validators.required]],
      content: [null, [Validators.required]],
      slug: [null],
      image: [null, [Validators.required]],
    });
  }

  /**
   * ngOnInit
   */
  ngOnInit() {}

  /**
   * ngOnDestroy
   */
  ngOnDestroy() {
    this.subscription.forEach((item) => {
      item.unsubscribe();
    });
  }

  /**
   * onThumbnailUploadClick
   */
  onThumbnailUploadClick() {
    this.subscription.push(
      this.common.uploadImageCore(this.inputThumbnail).subscribe((data) => {
        if (data) {
          this.input.image = data['files'][0];
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

      //input type
      this.input.type = 'POSTCARD';

      //get idOwner
      const id = this.authService.getAuthFromLocalStorage();
      this.input.idStore = id?.user.idStore;

      //getImage
      let images = [];
      if (this.input.image) images.push(this.input.image);
      if (images.length > 0) {
        this.common.comfirmImages(images).subscribe((data) => {
          // Set public image
          this.input.image = this.input.image ? data[0][2] : '';

          // Create list image uploads
          this.subscription.push(
            this.storeService.add(this.input).subscribe((data) => {
              // hide loading
              this.isLoading$.next(false);
              this.cdr.detectChanges();
              this.common.showSuccess('Insert new success!');

              // redirect to list
              this.router.navigate(['/features/storetemplates']);
            })
          );
        });
      }
    }
  }
}
