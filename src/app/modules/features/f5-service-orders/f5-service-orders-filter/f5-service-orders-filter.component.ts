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
  selector: 'app-f5-service-orders-filter',
  templateUrl: './f5-service-orders-filter.component.html',
  styleUrls: ['./f5-service-orders-filter.component.scss'],
})
export class F5ServiceOrdersFilterComponent implements OnInit {
  // define host binding
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  // input data source for select
  @Input() dataStore: any[] = [];
  @Input() dataStatus: any[] = [];
  // output
  @Output() applyBtnClick = new EventEmitter<any>();

  // binding
  storeSelect: string = '0';
  statusSelect: string = '0';

  /**
   * constructor
   */
  constructor(private authService: AuthService) {}

  /**
   *ngOnInit
   */
  ngOnInit(): void {}

  /**
   * onApplyBtnClick
   */
  onApplyBtnClick() {
    this.applyBtnClick.emit({
      idStore: this.storeSelect,
      status: this.statusSelect,
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
