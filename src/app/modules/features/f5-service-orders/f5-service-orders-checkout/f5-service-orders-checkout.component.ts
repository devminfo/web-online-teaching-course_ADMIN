import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Observable, Observer, Subscription, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { F5ServiceOrdersService } from 'src/app/core/services/features/f5-service-orders.service';
import { F7VouchersService } from 'src/app/core/services/features/f7-vouchers.service';

@Component({
  selector: 'app-f5-service-orders-checkout',
  templateUrl: './f5-service-orders-checkout.component.html',
  styleUrls: ['./f5-service-orders-checkout.component.scss'],
})
export class F5ServiceOrdersCheckoutComponent implements OnInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];
  observable: Observable<any>;
  observer: Observer<any>;

  // subscription
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  isCheckUploadImg: boolean = false;
  dataVoucher: any[] = [];
  tipTotal: number = 0;
  priceTotal: number = 0;
  idStore: any = '';
  //data
  checkout: any = {
    fullName: '',
    dateOfBirth: 0,
    email: '',
    phone: '',
    idStore: '',
    selectedServices: '',
    idCustomer: '',
    status: '',
    dateTimeCheckIn: '',
    dateTimeCheckOut: 0,
    serviceFeeTotal: 0,
    tipTotal: 0,
    promotion: 0,
    totalMoney: 0,
    voucher: 0,
    idVoucher: '',
    tip: 0,
    price: 0,
    transaction: {
      idUser: '',
      idServiceOrder: '',
      idStore: '',
      type: 'PAYMENT',
      method: 'TRANSFER',
      status: 'SUCCESS',
      title: '',
      totalMoney: 0,
      unitMoney: ' ',
    },
  };

  dataThumbnail: any[] = [];
  // binding uploads image or file
  @ViewChild('inputThumbnail', { static: false })
  inputThumbnail: ElementRef;
  //form
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
    public common: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private serviceOrderServices: F5ServiceOrdersService,
    private voucherService: F7VouchersService
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );
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
      this.serviceOrderServices
        .find({
          id: id,
          populate: 'idCustomer,selectedServices.idStaff.staffServices',
        })
        .subscribe((data) => {
          // load data to view input
          this.checkout = {
            idStore: data.idStore,
            selectedServices: data.selectedServices,
            idCustomer: data.idCustomer,
            status: data.status,
            dateTimeCheckIn: data.dateTimeCheckIn,
            dateTimeCheckOut: data.dateTimeCheckOut,
            serviceFeeTotal: data.serviceFeeTotal,
            tipTotal: data.tipTotal,
            promotion: data.promotion,
            totalMoney: data.totalMoney,
            voucher: data.voucher,
          };

          this.subscription.push(
            this.voucherService
              .getValidVoucher(this.checkout.idStore)
              .subscribe((data) => {
                this.dataVoucher = data.results;
              })
          );

          //push thumbnail to array
          for (let i = 0; i < this.checkout.selectedServices.length; i++) {
            for (
              let j = 0;
              j <
              this.checkout.selectedServices[i]?.idStaff?.staffServices.length;
              j++
            ) {
              this.dataThumbnail.push(
                this.checkout.selectedServices[i]?.idStaff?.staffServices[j]
                  ?.thumbnail
              );
            }
          }

          //hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();
        })
    );
  }

  /**
   * ngOnChangeTip
   */
  ngOnChangeTip() {
    let totalTip = 0;

    // get totalTip
    for (let i = 0; i < this.checkout.selectedServices.length; i++) {
      totalTip += this.checkout.selectedServices[i]?.tip;
    }
    this.checkout.tipTotal = totalTip;
    this.calculatorTotal();
  }

  /**
   * ngOnChangePrice
   */
  onChangePrice() {
    let totalPrice = 0;

    //get total Price
    for (let i = 0; i < this.checkout.selectedServices.length; i++) {
      totalPrice += this.checkout.selectedServices[i]?.price;
    }

    this.checkout.serviceFeeTotal = totalPrice;
    this.calculatorTotal();
  }

  /**
   * ngOnChangePrice
   */
  onChangeTipTotal() {
    let tip = 0;

    //divide tip total
    tip = this.checkout.tipTotal / this.checkout.selectedServices.length;

    //assign tip
    for (let i = 0; i < this.checkout.selectedServices.length; i++) {
      this.checkout.selectedServices[i].tip = tip;
    }

    this.calculatorTotal();
  }
  /**
   * calculatorTotal
   */
  calculatorTotal() {
    this.checkout.totalMoney =
      this.checkout.serviceFeeTotal +
      this.checkout.tipTotal -
      this.checkout.voucher;
  }
  /**
   * onSelectedVoucher
   * @param e
   */
  onSelectedVoucher(e: any) {
    const voucher = e.target.value.split(',');

    //get price discount
    if (voucher[1] == 'MONEY') {
      this.checkout.voucher = Number(voucher[0]);
      this.checkout.idVoucher = voucher[2];
    } else {
      //get percent discount
      this.checkout.voucher =
        (voucher[0] * this.checkout.serviceFeeTotal) / 100;
      this.checkout.idVoucher = voucher[2];
    }

    this.calculatorTotal();
  }
  /**
   * onUpdateBtnClick
   */
  onUpdateBtnClick() {
    // show loading
    this.isLoading$.next(true);

    if (this.checkout.totalMoney < 0) {
      this.common.showError('The total money must be greater');
      return;
    }

    //delete dateTimeCheckIn
    delete this.checkout.dateTimeCheckIn;

    this.checkout.status = 'ORDER';

    this.checkout.idCustomer = this.checkout.idCustomer._id;
    this.checkout.transaction = {
      idUser: this.checkout.idCustomer,
      idServiceOrder: this.id,
      idStore: this.checkout.idStore,
      type: 'PAYMENT',
      method: 'TRANSFER',
      status: 'SUCCESS',
      title: 'Payment service order:' + this.id,
      totalMoney: this.checkout.totalMoney,
      unitMoney: 'VND',
    };

    //get time local
    const newDate = new Date().toLocaleString('en-US');
    this.checkout.dateTimeCheckOut = new Date(newDate).getTime();

    //delete detail idStaff
    this.checkout.selectedServices.forEach((i: any) => {
      i.idStaff = i?.idStaff?._id;
      delete i?._id;
    });
    this.subscription.push(
      this.serviceOrderServices
        .checkout(this.id, this.checkout)
        .subscribe(() => {
          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();
          this.common.showSuccess('Checkout Success!');

          // redirect to list
          this.router.navigate(['/features/servicesorders']);
        })
    );
  }
}
