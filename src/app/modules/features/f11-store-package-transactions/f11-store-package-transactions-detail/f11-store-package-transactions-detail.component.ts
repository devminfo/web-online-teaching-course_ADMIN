import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { Observable, Observer, Subscription, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { F1StoresService } from 'src/app/core/services/features/f1-stores.service';
import { F10AssetsPackagesService } from 'src/app/core/services/features/f10-assets-packages.service';
import { F11StorePackageTransactionsService } from 'src/app/core/services/features/f11-store-package-transactions.service';

@Component({
  selector: 'app-f11-store-package-transactions-detail',
  templateUrl: './f11-store-package-transactions-detail.component.html',
  styleUrls: ['./f11-store-package-transactions-detail.component.scss'],
})
export class F11StorePackageTransactionsDetailComponent
  implements OnInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];
  observable: Observable<any>;
  observer: Observer<any>;
  // subscription
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  
  dataAssetPackage: any[] = [];
  dataStore: any[] = [];

  //data
  detail: any = {
    transactionMoney: 0,
    transactionContent: '',
    transactionImage: '',
    bankBranch: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    transactionStatus: '',
    transactionMethod: '',
    transactionType: '',
    unitType: '',
    originalPrice: 0,
    price: 0,
    quantity: 0,
    title: '',
    idAssetPackage: '',
    idStore: '',
    type: '',
  };

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
    private storesService: F1StoresService,
    private assetPackageService: F10AssetsPackagesService,
    private storePackageTransactionService: F11StorePackageTransactionsService
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    //loadDataReference
    this.loadDataReference();

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
      this.storePackageTransactionService.find(id).subscribe((data) => {

        // load data to view input
        this.detail = {
          transactionMoney: data.transactionMoney,
          transactionContent: data.transactionContent,
          transactionImage: data.transactionImage,
          bankBranch: data.bankBranch,
          bankName: data.bankName,
          accountNumber: data.accountNumber,
          accountName: data.accountName,
          transactionStatus: data.transactionStatus,
          transactionMethod: data.transactionMethod,
          transactionType: data.transactionType,
          unitType: data.unitType,
          originalPrice: data.originalPrice,
          price: data.price,
          quantity: data.quantity,
          title: data.title,
          idAssetPackage: data.idAssetPackage,
          idStore: data.idStore,
          type: data.type,
        };
        //hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();
      })
    );
  }

  /**
   * load Data Reference
   */
  loadDataReference() {
    this.getAssetPackage();
    this.getStore();
  }

  /**
   * getStore
   */
  getStore() {
    this.subscription.push(
      this.storesService.get().subscribe((data) => {
        this.dataStore = data;
      })
    );
  }

  /**
   *getBackAccountByIdStore
   * @param id
   * @returns
   */
  getBackAccountByIdStore(id: any) {
    const result = this.dataStore.filter((item) => item._id == id);

    // check exists
    if (result.length > 0) {
      return result[0].name;
    }
    return '';
  }

  /**
   * getAssetPackage
   */
  getAssetPackage() {
    this.subscription.push(
      this.assetPackageService.get().subscribe((data) => {
        this.dataAssetPackage = data;
      })
    );
  }

  /**
   *getBackAccountByIdStore
   * @param id
   * @returns
   */
  getBackAccountByIdAssetPackage(id: any) {
    const result = this.dataAssetPackage.filter((item) => item._id == id);
    // check exists
    if (result.length > 0) {
      return result[0].title;
    }
    return '';
  }
}
