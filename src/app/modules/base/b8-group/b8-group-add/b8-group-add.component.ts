import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { GroupService } from 'src/app/core/services/base/b8-group.service';
import { CommonService } from 'src/app/core/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GroupAPIService } from 'src/app/core/services/base/b6-group-api.service';
import { GroupDetailService } from 'src/app/core/services/base/b7-group-detail.service';

@Component({
  selector: 'app-b8-group-add',
  templateUrl: './b8-group-add.component.html',
  styleUrls: ['./b8-group-add.component.scss'],
})
export class B8GroupAddComponent implements OnInit, AfterViewInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  // Handle tab header
  tabEnum = {
    name: 'name',
    groupDetails: 'groupDetails',
    groupApiAccesses: 'groupApiAccesses',
    groupApiDenies: 'groupApiDenies',
  };
  tabSelected = this.tabEnum.name;

  // Form name
  inputName = { name: '' };
  formName: FormGroup;

  // group apis
  groupApis: any[];
  groupApisTemp: any[];
  inputGroupAPI = {
    groupAPIAccesses: [''],
    groupAPIDenines: [''],
  };

  // group details
  groupDetails: any[];
  groupDetailsTemp: any[];
  inputGroupDetails: {
    idGroupDetail: '';
    accessMethods: ['GET', 'POST', 'PUT', 'DELETE'];
  }[];

  // group denies
  apiDenies: any[];
  apiDeniesTemp: any[];

  /**
   * constructor
   *
   * @param api
   * @param common
   * @param router
   * @param cdr
   * @param formBuilder
   */
  constructor(
    private api: GroupService,
    private groupAPIService: GroupAPIService,
    private groupDetailService: GroupDetailService,
    private common: CommonService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );

    // add validate for form name
    this.formName = this.formBuilder.group({
      name: [null, [Validators.required]],
    });
  }

  /**
   * ****************** Group details ******************
   */
  isGroupDetailSelectedAll = false;
  groupDetailPageLength = 0;

  /**
   * onCheckAllSelected
   */
  onCheckAllGroupDetailSelected() {
    this.isGroupDetailSelectedAll = !this.isGroupDetailSelectedAll;

    // check or uncheck all item
    for (let i = 0; i < this.groupDetails.length; i++) {
      this.groupDetails[i].checked = this.isGroupDetailSelectedAll;

      const groupDetail = this.groupDetails[i];

      const isChecked = this.groupDetails[i].checked;

      // check add access methods
      if (isChecked) {
        groupDetail.accessMethods =
          groupDetail.accessMethods.length > 0
            ? groupDetail.accessMethods
            : ['GET', 'POST', 'PUT', 'DELETE'];
      } else {
        groupDetail.accessMethods = [];
      }
    }
  }

  /**
   *
   * @param id
   */
  onGroupDetailSelected(id: String) {
    const groupDetail = this.groupDetails.find(
      (groupDetail) => groupDetail._id === id
    );

    groupDetail.checked = !groupDetail.checked;
    const isChecked = groupDetail.checked;
    // check add access methods
    if (isChecked) {
      groupDetail.accessMethods =
        groupDetail.accessMethods.length > 0
          ? groupDetail.accessMethods
          : ['GET', 'POST', 'PUT', 'DELETE'];
    } else {
      groupDetail.accessMethods = [];
    }

    if (groupDetail.checked && groupDetail.childs.length > 0) {
      // loop childs and checked
      groupDetail.childs.forEach((child: any) => {
        const groupDetailChild = this.groupDetails.find(
          (groupDetail) => groupDetail._id === child._id
        );

        groupDetailChild.checked = true;

        groupDetailChild.accessMethods =
          groupDetailChild.accessMethods.length > 0
            ? groupDetailChild.accessMethods
            : ['GET', 'POST', 'PUT', 'DELETE'];
      });
    } else {
      // check childs have checked
      const isChildCheckedAll = groupDetail.childs.every(
        (child: any) => child.checked
      );

      // uncheck all childs
      if (isChildCheckedAll) {
        groupDetail.childs.forEach((child: any) => {
          const groupDetailChild = this.groupDetails.find(
            (groupDetail) => groupDetail._id === child._id
          );

          groupDetailChild.checked = false;

          groupDetailChild.accessMethods = [];
        });
      }
    }
  }

  /**
   * getSelection
   * @returns
   */
  getGroupDetailSelection() {
    return this.groupDetails.filter((x) => x.checked);
  }

  /**
   * ****************** Group api ******************
   */
  isApiAccessesSelectedAll = false;
  groupApiPageLength = 0;

  /**
   * onCheckAllSelected
   */
  onCheckAllGroupApiSelected() {
    this.isApiAccessesSelectedAll = !this.isApiAccessesSelectedAll;

    // check or uncheck all item
    for (let i = 0; i < this.groupApis.length; i++) {
      this.groupApis[i].checked = this.isApiAccessesSelectedAll;
    }
  }

  /**
   *
   * @param id
   */
  onGroupApiSelected(id: String) {
    // check or uncheck item with id
    for (let i = 0; i < this.groupApis.length; i++) {
      if (this.groupApis[i]._id === id) {
        this.groupApis[i].checked = !this.groupApis[i].checked;
        break;
      }
    }
  }

  /**
   * getSelection
   * @returns
   */
  getGroupAPiSelection() {
    return this.groupApis.filter((x) => x.checked);
  }

  /**
   * ****************** Group denies ******************
   */
  isApiDeniesSelectAll = false;
  apiDeniesPageLength = 0;

  /**
   * onCheckAllSelected
   */
  onCheckAllApiDeniesSelected() {
    this.isApiDeniesSelectAll = !this.isApiDeniesSelectAll;

    // check or uncheck all item
    for (let i = 0; i < this.apiDenies.length; i++) {
      this.apiDenies[i].checked = this.isApiDeniesSelectAll;
    }
  }

  /**
   *
   * @param id
   */
  onApiDeniesSelected(id: String) {
    // check or uncheck item with id
    for (let i = 0; i < this.apiDenies.length; i++) {
      if (this.apiDenies[i]._id === id) {
        this.apiDenies[i].checked = !this.apiDenies[i].checked;
        break;
      }
    }
  }

  /**
   * getSelection
   * @returns
   */
  getApiDeniesSelection() {
    return this.apiDenies.filter((x) => x.checked);
  }

  // condition filter
  conditonGroupAPiFilter: string = '';
  conditionsGroupAPi: any[] = [];

  /**
   * ngOnInit
   */
  ngOnInit() {
    this.onLoadData();
  }

  /**
   * ng After View Init
   */
  ngAfterViewInit(): void {}

  /**
   * ngOnDestroy
   */
  ngOnDestroy() {
    this.subscription.forEach((item) => {
      item.unsubscribe();
    });
  }

  /**
   * onAccessMethodChange
   */
  onChangeGroupDetailAccessMethod(
    id: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    e: any
  ) {
    const isChecked = e.target.checked;
    // check or uncheck item with id
    for (let i = 0; i < this.groupDetails.length; i++) {
      const groupDetail = this.groupDetails[i];

      // check id matched
      if (groupDetail._id === id) {
        // check checked method
        if (isChecked) groupDetail.accessMethods.push(method);
        else {
          groupDetail.accessMethods = this.groupDetails[i].accessMethods.filter(
            (accessMethod: any) => accessMethod != method
          );
        }

        // update check
        groupDetail.checked = groupDetail.accessMethods.length > 0;

        break;
      }
    }
  }

  /**
   * Load data
   */
  onLoadData() {
    this.loadGroupApis();
    this.loadGroupDenies();
    this.loadGroupDetails();
  }

  /**
   * Load group apis
   */
  loadGroupApis() {
    this.subscription.push(
      this.groupAPIService.get().subscribe((data) => {
        this.groupApis = data;
        this.groupApiPageLength = data.length;

        this.groupApisTemp = this.groupApis;
      })
    );
  }

  /**
   * Load group denies
   */
  loadGroupDenies() {
    this.subscription.push(
      this.groupAPIService.get().subscribe((data) => {
        this.apiDenies = data;
        this.apiDeniesPageLength = data.length;

        this.apiDeniesTemp = this.apiDenies;
      })
    );
  }

  /**
   * Load group details
   */
  loadGroupDetails() {
    const filter = '&sort=position&populate=childs';

    this.subscription.push(
      this.groupDetailService
        .getMenuOfCurrentUser(0, 100, filter)
        .subscribe((response) => {
          const data = this.groupDetailService.handleDataMenus(response);
          this.groupDetails = [];
          // format data source
          for (let i = 0; i < data.length; i++) {
            this.groupDetails.push(data[i]);

            // add if exists data
            if (data[i].childs.length > 0) {
              this.groupDetails.push(...data[i].childs);
            }
          }

          // add accessMethods
          this.groupDetails.forEach((groupDetail: any) => {
            groupDetail['accessMethods'] = [];
          });

          this.groupDetailsTemp = this.groupDetails;
          this.groupDetailPageLength = this.groupDetails.length;
        })
    );
  }

  /**
   * On add GroupDetails
   */
  onAddGroupDetails() {
    const groupDetailsSelected = this.getGroupDetailSelection();

    // set input group details
    this.inputGroupDetails = groupDetailsSelected.map((groupDetail: any) => ({
      idGroupDetail: groupDetail._id,
      accessMethods: groupDetail.accessMethods,
    }));
  }

  /**
   * Add GroupApis
   */
  onAddGroupApis() {
    const apisSelected = this.getGroupAPiSelection();

    // update input group api
    this.inputGroupAPI.groupAPIAccesses = apisSelected.map(
      (api: any) => api._id
    );
  }

  /**
   * Add GroupApis
   */
  onAddGroupApiDenies() {
    const apisSelected = this.getApiDeniesSelection();

    // update input group api
    this.inputGroupAPI.groupAPIDenines = apisSelected.map(
      (api: any) => api._id
    );
  }

  /**
   * Search
   * @param inputSearchType
   * @param keyword
   */
  onSearchChange(
    inputSearchType: 'groupAPIAccesses' | 'groupAPIDenines' | 'groupDetails',
    keyword: any
  ) {
    switch (inputSearchType) {
      case 'groupAPIAccesses':
        this.groupApis = this.groupApisTemp.filter((data) =>
          data.collectionName.includes(keyword)
        );

        this.groupApiPageLength = this.groupApis.length;
        break;

      case 'groupAPIDenines':
        this.apiDenies = this.apiDeniesTemp.filter((data) =>
          data.collectionName.includes(keyword)
        );

        this.groupApiPageLength = this.groupApis.length;
        break;

      case 'groupDetails':
        this.groupDetails = this.groupDetailsTemp.filter((data) =>
          data.collectionName.includes(keyword)
        );

        this.groupApiPageLength = this.groupApis.length;
        break;
    }
  }

  /**
   * Handle change tab
   * @param tab
   */
  onChangeTab(tab: string) {
    // touch all control to show error
    this.formName.markAllAsTouched();

    // add group details
    if (this.tabSelected === this.tabEnum.groupDetails)
      this.onAddGroupDetails();

    // add group api accesses
    if (this.tabSelected === this.tabEnum.groupApiAccesses)
      this.onAddGroupApis();

    if (!this.formName.invalid) this.tabSelected = tab;
  }

  /**
   * onAddNewBtnClick
   */
  onAddNewBtnClick() {
    // on add group api denies
    this.onAddGroupApiDenies();

    // show loading
    this.isLoading$.next(true);

    // create group item
    const groupItem = {
      name: this.inputName.name,
      groupDetails: this.inputGroupDetails,
      groupAPIAccesses: this.inputGroupAPI.groupAPIAccesses,
      groupAPIDenines: this.inputGroupAPI.groupAPIDenines,
    };

    // call api
    this.subscription.push(
      this.api.add(groupItem).subscribe(
        () => {
          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();

          this.common.showSuccess('Insert new success!');

          // redirect to list
          this.router.navigate(['/features/groups']);
        },
        (error: any) => {
          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();

          this.common.showError(`Insert new failure! ${error.message}`);

          // redirect to list
          this.router.navigate(['/features/groups']);
        }
      )
    );
  }
}
