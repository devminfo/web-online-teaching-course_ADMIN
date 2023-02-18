import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { GroupSService } from 'src/app/core/services/features/f13-group-services.service';

@Component({
  selector: 'choose-staff-service-filter',
  templateUrl: './choose-staff-service-filter.component.html',
})
export class ChooseStaffServiceFilterComponent implements OnInit {
  subscription: Subscription[] = [];
  // define host binding
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  // input data source for select
  @Input() stores: any[] = [];
  @Input() storeServices: any[] = [];
  @Input() groupServices: any[] = [];

  // output
  @Output() applyBtnClick = new EventEmitter<any>();

  // binding
  storeSelect: string = '0';
  groupServiceSelect: string = '0';

  /**
   * constructor
   */
  constructor(
    private groupSService: GroupSService,
  ) { }

  /**
   *
   */
  ngOnInit(): void {
    // on Load All Group Services
    this.onLoadAllGroupServices();
  }

  /**
 * On load all stores
 */
  onLoadAllGroupServices() {
    this.subscription.push(
      this.groupSService.get().subscribe((data: any) => {
        this.groupServices = data;
      })
    );
  }

  /**
   * getStatusDisplayTitle
   * @param id
   */
  getStatusDisplayTitle(id: string) {
    const result = this.groupServices.filter((item) => item._id == id);

    // check exists
    if (result.length > 0) {
      return result[0]?.title;
    }
    return '';
  }

  /**
   * onApplyBtnClick
   */
  onApplyBtnClick() {
    const param = [this.storeSelect, this.groupServiceSelect];
    this.applyBtnClick.emit(param);
  }

  /**
   * onResetFilterClick
   */
  onResetFilterClick() {
    const param = [
      this.storeSelect = '0',
      this.groupServiceSelect = '0'
    ]
    this.applyBtnClick.emit(param);
  }
}
