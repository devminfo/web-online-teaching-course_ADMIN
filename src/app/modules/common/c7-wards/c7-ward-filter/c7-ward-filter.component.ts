import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ProvinceService } from 'src/app/core/services/common/c5-province.service';
import { DistrictService } from 'src/app/core/services/common/c6-district.service';
@Component({
  selector: 'c7-ward-filter',
  templateUrl: './c7-ward-filter.component.html',
})
export class C7WardFilterComponent implements OnInit {
  // subscription
  subscription: Subscription[] = []; // define host binding
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true'; // input data source for select
  @Input() provinces: any[] = [];
  @Input() districts: any[] = [];
  @Input() villages: any[] = []; // output
  @Output() applyBtnClick = new EventEmitter<any>(); // binding
  provinceSelect: string = '0';
  districtSelect: string = '0';

  idDistrictFilter: any;

  /**
   * constructor
   * @param provinceService
   * @param districtService
   */
  constructor(
    private provinceService: ProvinceService,
    private districtService: DistrictService
  ) {}
  /**
   *
   */
  ngOnInit(): void {
    // get list province
    this.getListProvince();
  }
  /**
   * getListProvince
   */
  getListProvince() {
    this.subscription.push(
      this.provinceService.get().subscribe((data) => {
        this.provinces = data;
      })
    );
  }
  /**
   * Get District By provice
   * @param idProvince
   */
  getDistrictByIdProvince(idProvince: string) {
    this.subscription.push(
      this.districtService
        .paginate({
          page: 1,
          limit: 100,
          filter: '&idProvince=' + idProvince,
          fields: '',
          populate: '',
        })
        .subscribe((data) => {
          if (data) {
            this.districts = data.results;

            this.districtSelect = '0';
          }
        })
    );
  }

  /**
   * onProvinceChange
   * @param event
   */
  onProvinceChange(event: any) {
    this.provinceSelect = event.target.value;
    if (event.target.value !== '0')
      this.getDistrictByIdProvince(event.target.value);
  }

  /**
   * onDistrictChange
   * @param event
   */
  onDistrictChange(event: any) {
    this.districtSelect = event.target.value;
  }

  /**
   * onApplyBtnClick
   */
  onApplyBtnClick() {
    this.applyBtnClick.emit({
      idProvince: this.provinceSelect,
      idDistrict: this.districtSelect,
    });
  }
}
