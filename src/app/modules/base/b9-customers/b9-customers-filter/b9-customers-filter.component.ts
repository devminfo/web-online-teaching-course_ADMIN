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
  selector: 'b9-customers-filter',
  templateUrl: './b9-customers-filter.component.html',
})
export class B9CustomersFilterComponent implements OnInit {
  // define host binding
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  // input data source for select
  @Input() permissions: any[] = [];
  @Input() stores: any[] = [];
  @Input() typeUsers: any[] = [];

  // output
  @Output() applyBtnClick = new EventEmitter<any>();

  // binding
  permissionSelect: string = '0';
  storeSelect: string = '0';
  typeUserSelect: string = '0';

  /**
   * constructor
   * @param authService 
   */
  constructor(
    private authService: AuthService
  ) { }

  /**
   *
   */
  ngOnInit(): void { }

  /**
   * onApplyBtnClick
   */
  onApplyBtnClick() {
    if (this.permissionSelect === 'manager') {
      this.typeUserSelect = '0';
    } else if (this.permissionSelect === '0') {
      this.typeUserSelect = '0';
    }

    const param = [this.permissionSelect, this.storeSelect, this.typeUserSelect];
    this.applyBtnClick.emit(param);
  }

  /**
   * onResetFilterClick
   */
  onResetFilterClick() {
    const param = [
      this.permissionSelect = '0',
      this.storeSelect = '0',
      this.typeUserSelect = '0'
    ]
    this.applyBtnClick.emit(param);
  }

  /**
   * getEmailAuth
   * @returns 
   */
  getEmailAuth() {
    const emailAuth = this.authService.getAuthFromLocalStorage();
    return emailAuth?.user.email
  }
}
