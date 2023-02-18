import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/core/services/api/00auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { GroupSService } from 'src/app/core/services/features/f13-group-services.service';
import { StoreSService } from 'src/app/core/services/features/f14-store-services.service';

@Component({
  selector: 'app-f18-store-services-template-add',
  templateUrl: './f18-store-services-template-add.component.html',
  styleUrls: ['./f18-store-services-template-add.component.scss']
})
export class F18StoreServicesTemplateAddComponent implements OnInit, AfterViewInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  userData: any[];
  groupServicesData: any[];

  // binding data
  input = {
    thumbnail: '',
    idStore: '',
    idGroupService: '',
    title: '',
    turn: '',
    price: '',
    position: '',
  };

  //binding uploads image or file
  @ViewChild('inputImage', { static: false })
  inputImage: ElementRef;

  //form
  form: FormGroup;

  getIdStore: any;

  /**
   * Constructor
   * @param api
   * @param storeService
   * @param groupService
   * @param common
   * @param router
   * @param cdr
   * @param formBuilder
   */
  constructor(
    private api: StoreSService,
    private authService: AuthService,
    private groupService: GroupSService,
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
      thumbnail: [null, [Validators.required]],
      idGroupService: [null, [Validators.required]],
      title: [null, [Validators.required]],
      turn: [null, [Validators.required, Validators.min(1)]],
      price: [null, [Validators.required, Validators.min(1)]],
      position: [null, [Validators.required, Validators.min(1)]],
    });
  }

  /**
   * ng On Init
   */
  ngOnInit(): void {
    // load data group service
    this.getGroupServices();

    // get data idStore by user
    const auth = this.authService.getAuthFromLocalStorage();
    this.getIdStore = auth?.user.idStore;
    this.input.idStore = this.getIdStore;
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
   * get Group Service
   */
  getGroupServices() {
    this.groupService.get().subscribe((data) => {
      this.groupServicesData = data;
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
   * on Add New Btn Click
   */
  onAddNewBtnClick() {
    // touch all control to show error
    this.form.markAllAsTouched();

    // check form pass all validate
    if (!this.form.invalid) {
      // show loading
      this.isLoading$.next(true);

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
              this.router.navigate(['/features/storeservices']);
            })
          );
        });
      }
    }
  }
}
