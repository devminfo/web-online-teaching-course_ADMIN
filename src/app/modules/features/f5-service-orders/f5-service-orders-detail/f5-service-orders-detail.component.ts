import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Observable, Observer, Subscription, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { F5ServiceOrdersService } from 'src/app/core/services/features/f5-service-orders.service';

@Component({
  selector: 'app-f5-service-orders-detail',
  templateUrl: './f5-service-orders-detail.component.html',
  styleUrls: ['./f5-service-orders-detail.component.scss'],
})
export class F5ServiceOrdersDetailComponent implements OnInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];
  observable: Observable<any>;
  observer: Observer<any>;
  // subscription
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  
  dataThumbnail:any[]=[]

  //data
  detail: any = {
    idStore: '',
    selectedServices: '',
    idCustomer: '',
    status: '',
    dateTimeCheckIn: '',
    dateTimeCheckOut: '',
    accountName: '',
    serviceFeeTotal: '',
    tipTotal: '',
    promotion: '',
    totalMoney: '',
  };

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
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private serviceOrderServices: F5ServiceOrdersService,
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
  onLoadDataById(id: String,) {
    // show loading
    this.isLoading$.next(true);
    this.subscription.push(
      this.serviceOrderServices.find({
        id:id,
        populate:'selectedServices.idStoreService,idVoucher,idCustomer,idStore'
      }).subscribe((data) => {
        
        // load data to view input
        this.detail = {
          idStore: data.idStore,
          selectedServices: data.selectedServices,
          idCustomer: data.idCustomer,
          status: data.status,
          dateTimeCheckIn: data.dateTimeCheckIn,
          dateTimeCheckOut: data.dateTimeCheckOut,
          accountName: data.accountName,
          serviceFeeTotal: data.serviceFeeTotal,
          tipTotal: data.tipTotal,
          idVoucher:data.idVoucher,
          promotion: data.promotion,
          totalMoney: data.totalMoney,
        };

        //chạy vòng for để push ảnh vào mảng
        for(let i = 0; i < this.detail.selectedServices.length; i++){
          this.dataThumbnail.push(this.detail.selectedServices[i].idStoreService.thumbnail)
        }

        //hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();
      })
    );
  }
}
