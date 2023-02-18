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
  selector: 'app-f12-setting-add',
  templateUrl: './f12-setting-add.component.html',
  styleUrls: ['./f12-setting-add.component.scss'],
})
export class F12SettingAddComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  // binding uploads image or file
  @ViewChild('inputLogo', { static: false })
  inputLogo: ElementRef;

  // binding data
  input: any = {
    logo: '',
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
  };

  // form
  form: FormGroup;

  amGet: boolean = false;
  amPost: boolean = false;
  amPut: boolean = false;
  amDelete: boolean = false;

  // data reference binding
  userDatas: any[] = [];
  idEntityDatas: any[] = [];

  /**
   * constructor
   * @param api
   * @param common
   * @param router
   * @param cdr
   * @param formBuilder
   * @param userService
   */
  constructor(
    private api: SettingService,
    public common: CommonService,
    private router: Router,
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
    });
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
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
   * onAddNewBtnClick
   */
  onAddNewBtnClick() {
    // touch all control to show error
    this.form.markAllAsTouched();

    // check form pass all validate
    if (!this.form.invalid) {
      // show loading
      this.isLoading$.next(true);

      if (this.input.logo)
        this.common.comfirmImages([this.input.logo]).subscribe((dataImage) => {
          this.input.logo = dataImage[0][2];

          this.subscription.push(
            this.api.add(this.input).subscribe(() => {
              // hide loading
              this.isLoading$.next(false);
              this.cdr.detectChanges();

              this.common.showSuccess('Insert new success!');

              // redirect to list
              this.router.navigate(['/features/settings']);
            })
          );
        });
    }
  }
}
