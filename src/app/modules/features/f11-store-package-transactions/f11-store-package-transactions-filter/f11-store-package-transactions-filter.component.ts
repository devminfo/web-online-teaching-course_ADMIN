import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AuthService } from 'src/app/core/services/api/00auth.service';

@Component({
  selector: 'app-f11-store-package-transactions-filter',
  templateUrl: './f11-store-package-transactions-filter.component.html',
  styleUrls: ['./f11-store-package-transactions-filter.component.scss']
})
export class F11StorePackageTransactionsFilterComponent implements OnInit {

  // define host binding
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  // input data source for select
  @Input() dataStore : any[] = [];
  @Input() dataAssetPackage : any[] = [];
  @Input() dataMethod : any[] = [];
  @Input() dataStatus : any[] = [];
  // output
  @Output() applyBtnClick = new EventEmitter<any>();

  // binding
  storeSelect: string = '0';
  assetPackageSelect: string = '0';
  methodSelect: string = '0';
  statusSelects: string = '0';

  
  /**
   * constructor
   */
  constructor(
    private authService: AuthService
  ) {}

  /**
   *ngOnInit
   */
  ngOnInit(): void {}

  /**
   * onApplyBtnClick
   */
  onApplyBtnClick() {
    
    this.applyBtnClick.emit({
      idStore:this.storeSelect,
      idAssetPackage:this.assetPackageSelect,
      transactionMethod:this.methodSelect,
      transactionStatus:this.statusSelects
    });
  }

  /**
   * getEmailAuth
   * @returns 
   */
  getEmailAuth(){
    const emailAuth = this.authService.getAuthFromLocalStorage();
    return emailAuth?.user.email
  }
}
