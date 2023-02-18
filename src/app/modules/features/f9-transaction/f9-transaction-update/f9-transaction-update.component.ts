import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from 'src/app/core/services/features/f9-transaction.service';
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
  selector: 'app-f9-transaction-update',
  templateUrl: './f9-transaction-update.component.html',
  styleUrls: ['./f9-transaction-update.component.scss'],
})
export class F9TransactionUpdateComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  // binding data
  input = {
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

  id: any;

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

  /**
   * constructor
   * @param api
   * @param common
   * @param router
   * @param route
   * @param cdr
   * @param formBuilder
   * @param userService
   */
  constructor(
    private api: TransactionService,
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
      idUser: [null, [Validators.required]],
      methodTransaction: [null, [Validators.required]],
      statusTransaction: [null, [Validators.required]],
      typeTransaction: [null, [Validators.required]],
      title: [null, [Validators.required]],
      money: [null, [Validators.required]],
      transactionImage: [null, []],
      content: [null, []],
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
          idUser: data.idUser,
          methodTransaction: data.methodTransaction,
          statusTransaction: data.statusTransaction,
          typeTransaction: data.typeTransaction,
          title: data.title,
          money: data.money,
          transactionImage: data.transactionImage,
          content: data.content,
        };
        // hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();
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
    if (!this.form.invalid) {
      // show loading
      this.isLoading$.next(true);

      this.subscription.push(
        this.api.update(this.id, this.input).subscribe(() => {
          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();

          this.common.showSuccess('Update Success!');

          // redirect to list
          this.router.navigate(['/features/transactions']);
        })
      );
    }
  }
}
