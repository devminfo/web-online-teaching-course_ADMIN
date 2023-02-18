import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreModuleService } from 'src/app/core/services/features/f15-store-module.service';
import { StoresService } from 'src/app/core/services/features/stores.service';

@Component({
  selector: 'app-choose-store-module',
  templateUrl: './choose-store-module.component.html',
  styleUrls: ['./choose-store-module.component.scss'],
})
export class ChooseStoreModuleComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  dataSources: any[] = [];
  isSelectAll = false;
  idStoreArrayModules: any[] = [];

  conditionFilter: string = 'sort=-createdAt';
  form: FormGroup;
  id: any;
  pageIndex = 1;
  pageLength = 0;
  pageSize = 100;

  input: any = {
    idStoreModules: [],
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
    private api: StoresService,
    private storeModule: StoreModuleService,
    private common: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );

    // add validate for controls
    this.form = this.formBuilder.group({
      idStoreModules: [null],
    });
  }

  ngOnInit(): void {
    //load data store module
    this.onLoadDataGrid();

    // get id from url
    this.id = this.route.snapshot.paramMap.get('id');
  }

  /**
   * ng After View Init
   */
  ngAfterViewInit(): void {
    // scroll top screen
    window.scroll({ left: 0, top: 0, behavior: 'smooth' });
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
   * on Load Data Grid
   */
  onLoadDataGrid() {
    this.subscription.push(
      this.storeModule
        .paginate({
          page: this.pageIndex,
          limit: this.pageSize,
          filter: this.conditionFilter,
          fields: '',
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
          idStoreModules: data.idStoreModules,
        };

        // check select to view input
        for (let data of this.dataSources) {
          for (let idStore of this.input.idStoreModules) {
            if (data._id === idStore) {
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
        this.idStoreArrayModules.push(id);
        this.input.idStoreModules = this.idStoreArrayModules;
      }

      this.subscription.push(
        this.api.update(this.id, this.input).subscribe((data) => {
          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();

          this.common.showSuccess('Update success!');

          // redirect to list
          this.router.navigate(['/features/stores']);
        })
      );
    }
  }

  /**
   * onSearchChange
   * @param keyword
   */
  onSearchChange(keyword: String) {
    let filterStr = '';
    if (keyword) filterStr = `filter={"$or":[{"title":"${keyword}"}]}`;
    this.conditionFilter = `sort=-createdAt&${filterStr}`;

    this.onLoadDataGrid();

    this.onLoadDataById(this.id);
  }
}
