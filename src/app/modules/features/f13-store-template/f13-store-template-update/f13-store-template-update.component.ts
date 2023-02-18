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
import { CommonService } from 'src/app/core/services/common.service';
import { F13StoreTemplatesService } from 'src/app/core/services/features/f13-store-templates.service';

@Component({
  selector: 'app-f13-store-template-update',
  templateUrl: './f13-store-template-update.component.html',
  styleUrls: ['./f13-store-template-update.scss'],
})
export class F13StoreTemplateUpdateComponent implements OnInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  arrayAvatar: any = [];
  styleAvatar = 'background-image: url(./assets/media/svg/files/image.svg)';
  isCheckUploadImg: boolean = false;
  // binding uploads image or file
  @ViewChild('inputThumbnail', { static: false })
  inputThumbnail: ElementRef;

  // update data
  update: any = {
    image: '',
    title: '',
    idStore: '',
    type: '',
    content: '',
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
    private storeTemplate: F13StoreTemplatesService,
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
      content: [null, [Validators.required]],
      image: [null, [Validators.required]],
      idStore: [null],
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
      this.storeTemplate.find(id).subscribe((data) => {
        // load data to view update
        this.update = {
          image: data.image,
          title: data.title,
          content: data.content,
          idOwner: data.idOwner,
        };

        //image
        if (this.update.image != '') {
          this.arrayAvatar.push(this.update.image);
          this.styleAvatar = `background-image: url(${this.update.image})`;
        }

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
          this.update.image = data['files'][0];
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

    // check form pass all validate
    if (!this.isCheckUploadImg) {
      this.form.controls['image'].removeValidators(Validators.required);

      this.form.controls['image'].updateValueAndValidity();
    }

    if (!this.form.invalid) {
      // show loading
      this.isLoading$.next(true);

      //getIdOwner
      const id = this.authService.getAuthFromLocalStorage();
      this.update.idStore = id?.user.idStore;

      //getImage
      let images = [];
      if (this.update.image) images.push(this.update.image);

      if (images.length > 0) {
        this.common.comfirmImages(images).subscribe((data) => {
          // Set public image
          this.update.image = this.update.image ? data[0][2] : '';
          this.subscription.push(
            this.storeTemplate.update(this.id, this.update).subscribe(() => {
              // hide loading
              this.isLoading$.next(false);
              this.cdr.detectChanges();
              this.common.showSuccess('Update Success!');

              // redirect to list
              this.router.navigate(['/features/storetemplates']);
            })
          );
        });
      }
    }
  }
}
