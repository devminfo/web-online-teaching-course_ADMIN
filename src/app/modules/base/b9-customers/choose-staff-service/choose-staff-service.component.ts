import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { GroupSService } from 'src/app/core/services/features/f13-group-services.service';
import { StoreSService } from 'src/app/core/services/features/f14-store-services.service';
import { StoreService } from 'src/app/core/services/features/store.service';
import { UserService } from 'src/app/core/services/features/user.service';

@Component({
  selector: 'app-choose-staff-service',
  templateUrl: './choose-staff-service.component.html',
  styleUrls: ['./choose-staff-service.component.scss'],
})
export class ChooseStaffServiceComponent implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  dataSources: any[] = [];
  isSelectAll = false;
  idStaffArrayModules: any[] = [];

  conditionFilter: string = '';
  form: FormGroup;
  id: any;
  pageIndex = 1;
  pageLength = 0;
  pageSize = 100;
  conditions: any[] = [];
  stores: string[];
  storeServices: string[];
  groupServices: string[];

  input: any = {
    staffServices: [],
  };

  /**
   * Constructor
   * @param api
   * @param storeModule
   * @param common
   * @param route
   * @param router
   * @param cdr
   * @param formBuilder
   */
  constructor(
    private api: UserService,
    private storesService: StoreSService,
    private common: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private groupSService: GroupSService,
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );

    // add validate for controls
    this.form = this.formBuilder.group({
      staffServices: [null],
    });
  }

  ngOnInit(): void {
    // get id from url
    this.id = this.route.snapshot.paramMap.get('id');

    this.onLoadDataGrid();

    // on Load All Stores
    this.onLoadAllStores();

    // on Load All Group Services
    this.onLoadAllStoreServices();

    // on Load All Group Services
    this.onLoadAllGroupServices();
  }

  /**
   * ng On Destroy
   */
  ngOnDestroy() {
    this.subscription.forEach((item) => {
      item.unsubscribe();
    });
  }

  /**
  * On load all stores
  */
  onLoadAllStores() {
    this.subscription.push(
      this.storeService.get().subscribe((data: any) => {
        this.stores = data;
      })
    );
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
  * On load all stores
  */
  onLoadAllStoreServices() {
    this.subscription.push(
      this.storesService.get().subscribe((data: any) => {
        this.storeServices = data;
      })
    );
  }

  /**
   * onCheckAllSelected
   */
  onCheckAllSelected() {
    this.isSelectAll = !this.isSelectAll;

    // check or uncheck all item
    for (let i = 0; i < this.dataSources.length; i++) {
      this.dataSources[i].checked = this.isSelectAll;
    }
  }

  /**
   *onItemSelected
   * @param id
   */
  onItemSelected(id: String) {
    // check or uncheck item with id
    for (let i = 0; i < this.dataSources.length; i++) {
      if (this.dataSources[i]._id === id) {
        this.dataSources[i].checked = !this.dataSources[i].checked;
        break;
      }
    }
  }

  /**
   * getSelection
   * @returns
   */
  getSelection() {
    return this.dataSources.filter((x) => x.checked) || 0;
  }

  /**
   * add New Condition To List
   * @param condition
   */
  addNewConditionToList(condition: any, isLoadData = true) {
    // check exists
    let flg = false;
    let i;

    // check condition exists
    for (i = 0; i < this.conditions.length; i++) {
      if (this.conditions[i].key == condition.key) {
        flg = true;
        break;
      }
    }

    // remove old key
    if (flg) {
      this.conditions.splice(i, 1);
    }

    // insert new seach condition if !=0
    if (condition.value != '0') {
      this.conditions.splice(0, 0, condition);
    }

    // render new condition filter
    this.createConditionFilter();

    // load grid with new condition
    if (isLoadData) this.onLoadDataGrid();
  }

  /**
   * create Condition Filter
   */
  createConditionFilter() {
    this.conditionFilter = '';
    this.conditions.forEach((item) => {
      if (this.conditionFilter == '') {
        this.conditionFilter = item.key + '=' + item.value + '';
      } else {
        this.conditionFilter += '&' + item.key + '=' + item.value + '';
      }
    });

    if (this.conditionFilter != '') {
      this.conditionFilter = '&' + this.conditionFilter;
    }
  }

  /**
   * on Load Data By Id
   * @param id
   */
  onLoadDataById(id: String) {
    // show loading
    this.isLoading$.next(true);

    this.subscription.push(
      this.api.find(id).subscribe((data) => {
        // load data to view input
        this.input = {
          staffServices: data.staffServices,
        };

        for (let data of this.dataSources) {
          for (let idStaff of this.input.staffServices) {
            if (data._id === idStaff) {
              data.checked = true;
            }
          }
        }

        // hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();
      })
    );
  }

  /**
   * on Add New Btn Click
   */
  onAddNewBtnClick() {
    // touch all control to show error
    this.form.markAllAsTouched();

    // get list id select
    const listIdSelect = this.getSelection()
      .map((item) => item._id)
      .join(',');

    // check form pass all validate
    if (!this.form.invalid) {
      // show loading
      this.isLoading$.next(true);

      for (let id of listIdSelect.split(',')) {
        this.idStaffArrayModules.push(id);
        this.input.staffServices = this.idStaffArrayModules;
      }

      this.subscription.push(
        this.api.update(this.id, this.input).subscribe(() => {
          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();

          this.common.showSuccess('Update success!');

          // redirect to list
          this.router.navigate(['/features/customers']);
        })
      );
    }
  }

  /**
   * on Load Data Grid
   */
  onLoadDataGrid() {
    this.subscription.push(
      this.storesService
        .paginate({
          page: this.pageIndex,
          limit: this.pageSize,
          filter: this.conditionFilter,
          fields: '',
          populate: 'idGroupService'
        })
        .subscribe((data) => {
          this.dataSources = data.results;
          this.pageLength = data.totalResults;

          // load data by param
          if (this.id) {
            this.onLoadDataById(this.id);
          }
        })
    );
  }

  /**
   * on apply btn click
   * @param event
   */
  onApplyBtnClick(event: any) {
    const condition = { key: 'idStore', value: event[0] };

    // add new condition to list
    this.addNewConditionToList(condition, false);

    const condition1 = { key: 'idGroupService', value: event[1] };

    // add new condition to list
    this.addNewConditionToList(condition1);
  }

  /**
   * onSearchChange
   * @param keyword
   */
  onSearchChange(keyword: any) {
    if (keyword != '') {
      this.dataSources = this.common.onSearchKeyWordReturnArray(
        this.storeServices,
        ['title'],
        keyword,
      );
      this.pageLength = this.dataSources.length;
    } else {
      this.onLoadDataGrid();
    }
    this.onLoadDataById(this.id);
  }
}
