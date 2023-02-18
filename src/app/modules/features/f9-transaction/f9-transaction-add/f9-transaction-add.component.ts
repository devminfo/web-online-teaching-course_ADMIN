import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { TransactionService } from 'src/app/core/services/features/f9-transaction.service';
import { CommonService } from 'src/app/core/services/common.service';
import { UserService } from 'src/app/core/services/features/user.service';
@Component({
  selector: 'app-f9-transaction-add',
  templateUrl: './f9-transaction-add.component.html',
  styleUrls: ['./f9-transaction-add.component.scss'],
})
export class F9TransactionAddComponent
  implements OnInit, AfterViewInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  // binding data
  input: any = {
    idUser: '',
    methodTransaction: '',
    statusTransaction: '',
    typeTransaction: '',
    title: '',
    money: '',
    transactionImage: '',
    content: '',
  };

  //form
  form: FormGroup;

  amGet: boolean = false;
  amPost: boolean = false;
  amPut: boolean = false;
  amDelete: boolean = false;

  // data reference binding
  userDatas: any[] = [];

  // methodTransaction
  methodTransactions: any[] = [
    { value: 'transfers', viewValue: 'Chuyển khoản' },
    { value: 'momo', viewValue: 'MoMo' },
    { value: 'viettel pay', viewValue: 'Viettel Pay' },
  ];

  // statusTransaction
  statusTransactions: any[] = [
    { value: 'waiting', viewValue: 'Chờ duyệt' },
    { value: 'success', viewValue: 'Thành công' },
    { value: 'failure', viewValue: 'Thất bại' },
  ];

  // typeTransaction
  typeTransactions: any[] = [
    { value: 'withdraw', viewValue: 'Nạp tiền' },
    { value: 'recharge', viewValue: 'Rút tiền' },
  ];

  // myControl, filteredOptions Search User
  myControl = new FormControl();
  filteredOptions: Observable<any>;

  // binding uploads image or file


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
    private api: TransactionService,
    private common: CommonService,
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
      idUser: [
        null,
        [
          Validators.required
        ]
      ],
      methodTransaction: [
        null,
        [
          Validators.required
        ]
      ],
      statusTransaction: [
        null,
        [
          Validators.required
        ]
      ],
      typeTransaction: [
        null,
        [
          Validators.required
        ]
      ],
      title: [
        null,
        [
          Validators.required
        ]
      ],
      money: [
        null,
        [
          Validators.required
        ]
      ],
      transactionImage: [
        null,
        [

        ]
      ],
      content: [
        null,
        [

        ]
      ],
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
   * onAddNewBtnClick
   */
  onAddNewBtnClick() {
    // touch all control to show error
    this.form.markAllAsTouched();

    // check form pass all validate
    if (!this.form.invalid) {
      // show loading
      this.isLoading$.next(true);

      this.subscription.push(
        this.api.add(this.input).subscribe(() => {
          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();

          this.common.showSuccess('Insert new success!');

          // redirect to list
          this.router.navigate(['/features/f9-transaction']);
        })
      );
    }
  }
}
