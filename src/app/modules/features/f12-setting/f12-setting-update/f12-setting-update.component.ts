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
import { ActivatedRoute, Router } from '@angular/router';
import { SettingService } from 'src/app/core/services/features/f12-setting.service';
import { QuestionService } from 'src/app/core/services/features/f8-question.service';
import { UserService } from 'src/app/core/services/features/user.service';
import { CommonService } from 'src/app/core/services/common.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-f12-setting-update',
  templateUrl: './f12-setting-update.component.html',
  styleUrls: ['./f12-setting-update.component.scss'],
})
export class F12SettingUpdateComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  // binding uploads image or file
  @ViewChild('inputLogo', { static: false })
  inputLogo: ElementRef;
  oldLogo: ElementRef;

  // binding data
  input: any = {
    bankName: '',
    branchName: '',
    bankAccountNumber: '',
    bankAccountName: '',
    phone: '',
    momo: '',
    vnPay: '',
    quizPassPercent: '',
    shareContent: '',
    policyContent: '',
    feeAppPercent: '',
    logo: '',
  };

  //form
  form: FormGroup;

  id: any;

  // data reference binding
  userDatas: any[] = [];
  idEntityDatas: any[] = [];

  amGet: boolean = false;
  amPost: boolean = false;
  amPut: boolean = false;
  amDelete: boolean = false;

  /**
   * constructor
   * @param api
   * @param common
   * @param router
   * @param route
   * @param cdr
   * @param formBuilder
   * @param userService
   * @param questionService
   */
  constructor(
    private api: SettingService,
    private common: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );

    // add validate for controls
    this.form = this.formBuilder.group({
      bankName: [null, [Validators.required]],
      branchName: [null, [Validators.required]],
      bankAccountNumber: [null, [Validators.required]],
      bankAccountName: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      momo: [null, [Validators.required]],
      vnPay: [null, [Validators.required]],
      quizPassPercent: [null, [Validators.required]],
      shareContent: [null, [Validators.required]],
      policyContent: [null, [Validators.required]],
      feeAppPercent: [null, [Validators.required]],
      logo: [null, []],
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

    // load data reference
    this.loadDataReference();
  }

  /**
   * load Data reference
   */
  loadDataReference() {
    // get list user
    this.getListUser();
  }

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
   * get list User
   */
  getListUser() {
    this.subscription.push(
      this.userService.get().subscribe((data) => {
        this.userDatas = data;
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
          bankName: data.bankName,
          branchName: data.branchName,
          bankAccountNumber: data.bankAccountNumber,
          bankAccountName: data.bankAccountName,
          phone: data.phone,
          momo: data.momo,
          vnPay: data.vnPay,
          quizPassPercent: data.quizPassPercent,
          shareContent: data.shareContent,
          policyContent: data.policyContent,
          feeAppPercent: data.feeAppPercent,
          logo: data.logo,
        };

        this.oldLogo = data.logo;
        // hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();
      })
    );
  }

  /**
   * onLogoUploadClick
   */
  onLogoUploadClick() {
    this.subscription.push(
      this.common.uploadImageCore(this.inputLogo).subscribe((data) => {
        if (data) {
          this.input.logo = data['files'][0];
        }
      })
    );
  }

  /**
   * onLogoDeleteClick
   */
  onLogoDeleteClick() {
    const isDelete = confirm('Bạn có muốn xóa hình? ');
    if (isDelete) this.input.logo = '';
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

      if (this.input.logo && this.input.logo != this.oldLogo) {
        this.common.comfirmImages([this.input.logo]).subscribe((dataImage) => {
          this.input.logo = dataImage[0][2];
          // Set public image
          this.subscription.push(
            this.api.update(this.id, this.input).subscribe(() => {
              // hide loading
              this.isLoading$.next(false);
              this.cdr.detectChanges();

              this.common.showSuccess('Update Success!');

              // redirect to list
              this.router.navigate(['/features/settings']);
            })
          );
        });
      } else {
        this.subscription.push(
          this.api.update(this.id, this.input).subscribe(() => {
            // hide loading
            this.isLoading$.next(false);
            this.cdr.detectChanges();

            this.common.showSuccess('Update Success!');

            // redirect to list
            this.router.navigate(['/features/settings']);
          })
        );
      }
    }
  }
}
