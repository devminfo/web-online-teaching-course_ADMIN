import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from 'src/app/core/services/base/b8-group.service';
import { CommonService } from 'src/app/core/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GroupAPIService } from 'src/app/core/services/base/b6-group-api.service';
import { GroupDetailService } from 'src/app/core/services/base/b7-group-detail.service';

@Component({
  selector: 'app-b8-group-add',
  templateUrl: './b8-group-update.component.html',
  styleUrls: ['./b8-group-update.component.scss'],
})
export class B8GroupUpdateComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  id: any;

  // Handle tab header
  tabEnum = {
    name: 'name',
    groupDetails: 'groupDetails',
    groupApiAccesses: 'groupApiAccesses',
    groupApiDenies: 'groupApiDenies',
    users: 'users',
    addUsers: 'addUsers',
  };
  tabSelected = this.tabEnum.name;

  // Form name
  inputName = { name: '' };
  formName: FormGroup;

  // Init data source temp for search
  groupApisTemp: any[] = [];
  groupDetailsTemp: any[] = [];
  apiDeniesTemp: any[] = [];

  // group apis
  groupApis: any[];
  inputTypeSelectGroupApi: 'groupAPIDenines' | 'groupAPIAccesses';
  inputGroupAPI = {
    groupAPIAccesses: [''],
    groupAPIDenines: [''],
  };

  // group details
  groupDetails: any[] = [];
  inputGroupDetails: {
    idGroupDetail: '';
    accessMethods: ['GET', 'POST', 'PUT', 'DELETE'];
  }[] = [];

  // group denies
  apiDenies: any[] = [];

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
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
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

    this.isGroupDetailSelectedAll = this.groupDetails.every(
      (groupDetail) => groupDetail.checked
    );
  }

  /**
   * getSelection
   * @returns
   */
  getGroupDetailSelection() {
    return this.groupDetails.filter((x) => x.checked);
  }

  /**
   * ****************** Group api pagination ******************
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
    const api = this.groupApis.find((api) => api._id == id);
    api.checked = !api.checked;
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
    const api = this.apiDenies.find((api) => api._id == id);
    api.checked = !api.checked;
  }

  /**
   * getSelection
   * @returns
   */
  getApiDeniesSelection() {
    return this.apiDenies.filter((x) => x.checked);
  }

  // condition fillter
  conditonGroupAPiFilter: string = '';
  conditionsGroupAPi: any[] = [];

  /**
   * ngOnInit
   */
  ngOnInit() {
    // get id from url
    this.id = this.route.snapshot.paramMap.get('id');

    // load data by param
    if (this.id) {
      this.onLoadDataById(this.id);
      this.onLoadData();
    }
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
    console.log(id, isChecked);

    // check or uncheck item with id
    for (let i = 0; i < this.groupDetails.length; i++) {
      const groupDetail = this.groupDetails[i];

      // check id matched
      if (groupDetail._id === id) {
        // check checked method
        if (isChecked) {
          groupDetail.accessMethods.push(method);
        } else {
          groupDetail.accessMethods = this.groupDetails[i].accessMethods.filter(
            (accessMethod: any) => accessMethod != method
          );
        }

        // update check
        groupDetail.checked = groupDetail.accessMethods.length > 0;

        // check or uncheck for all child of item
        this.groupDetails[i].childs.forEach((item: any) => {
          // check checked method
          if (isChecked) {
            item.accessMethods.push(method);
          } else {
            item.accessMethods = item.accessMethods.filter(
              (accessMethod: any) => accessMethod != method
            );
          }

          // update check
          item.checked = item.accessMethods.length > 0;
        });
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
   * onLoadDataById
   * @param id
   */
  onLoadDataById(id: string) {
    // show loading
    this.isLoading$.next(true);

    this.subscription.push(
      this.api.find(id).subscribe((data) => {
        const groupDetailsObj = data.groupDetails;

        const groupAPIAccesses = data.groupAPIAccesses;
        const groupAPIDenines = data.groupAPIDenines;

        this.inputName.name = data.name;

        // load values into inputGroupAPI
        this.inputGroupAPI = {
          groupAPIAccesses: groupAPIAccesses.map(
            (apiAccess: any) => apiAccess._id
          ),
          groupAPIDenines: groupAPIDenines.map((apiDenie: any) => apiDenie._id),
        };

        // load values into inputGroupDetails
        this.inputGroupDetails = groupDetailsObj.map((groupDetail: any) => ({
          idGroupDetail: groupDetail.idGroupDetail
            ? groupDetail.idGroupDetail._id
            : '',
          accessMethods: groupDetail.accessMethods,
        }));

        // update checked
        if (this.groupApis) {
          this.inputGroupAPI.groupAPIAccesses.forEach((apiAccesses: any) => {
            const exist = this.groupApis.find(
              (groupApi: any) => groupApi._id == apiAccesses
            );
            if (exist) exist.checked = true;
          });

          // check selected all
          this.isApiAccessesSelectedAll = this.groupApis.every(
            (api) => api.checked
          );
        }

        if (this.apiDenies) {
          this.inputGroupAPI.groupAPIDenines.forEach((apiDenie: any) => {
            const exist = this.apiDenies.find(
              (groupApi: any) => groupApi._id == apiDenie
            );

            if (exist) exist.checked = true;
          });

          // check selected all
          this.isApiDeniesSelectAll = this.apiDenies.every(
            (api) => api.checked
          );
        }

        // update checked and access methods
        if (this.groupDetails) {
          this.inputGroupDetails.forEach((input: any) => {
            const exist = this.groupDetails.find(
              (gDetail: any) => gDetail._id == input.idGroupDetail
            );
            if (exist) {
              exist.checked = true;
              exist.accessMethods = input.accessMethods;
            }
          });

          // check selected all
          this.isGroupDetailSelectedAll = this.groupDetails.every(
            (groupDetail) => groupDetail.checked
          );
        }

        // hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();
      })
    );
  }

  /**
   * Load group apis
   */
  loadGroupApis() {
    const filter = '';
    this.subscription.push(
      this.groupAPIService.get().subscribe((data) => {
        this.groupApis = data;
        this.groupApiPageLength = data.length;

        const { groupAPIAccesses } = this.inputGroupAPI;
        // update checked
        if (groupAPIAccesses.length > 0) {
          groupAPIAccesses.forEach((apiAccesses: any) => {
            const exist = this.groupApis.find(
              (api: any) => api._id == apiAccesses
            );
            if (exist) exist.checked = true;
          });
        }

        // check selected all
        this.isApiAccessesSelectedAll = this.groupApis.every(
          (api) => api.checked
        );
        this.groupApisTemp = this.groupApis;
      })
    );
  }

  /**
   * Load group apis
   */
  loadGroupDenies() {
    const filter = '';
    this.subscription.push(
      this.groupAPIService.get().subscribe((data) => {
        this.apiDenies = data;
        this.apiDeniesPageLength = data.length;

        const { groupAPIDenines } = this.inputGroupAPI;
        // update checked
        if (groupAPIDenines) {
          groupAPIDenines.forEach((apiDenie: any) => {
            const exist = this.apiDenies.find(
              (groupApi: any) => groupApi._id == apiDenie
            );
            if (exist) exist.checked = true;
          });
        }

        // check selected all
        this.isApiDeniesSelectAll = this.apiDenies.every((api) => api.checked);
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

          // update checked and access methods
          if (this.inputGroupDetails) {
            this.inputGroupDetails.forEach((input: any) => {
              const exist = this.groupDetails.find(
                (gDetail: any) => gDetail._id == input.idGroupDetail
              );

              if (exist) {
                exist.checked = true;
                exist.accessMethods = input.accessMethods;
              }
            });
          }
          // check selected all
          this.isGroupDetailSelectedAll = this.groupDetails.every(
            (groupDetail) => groupDetail.checked
          );

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
    inputSearchType:
      | 'groupAPIAccesses'
      | 'groupAPIDenines'
      | 'groupDetails'
      | 'users',
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

        this.apiDeniesPageLength = this.apiDenies.length;
        break;

      case 'groupDetails':
        this.groupDetails = this.groupDetailsTemp.filter((data) =>
          data.collectionName.includes(keyword)
        );

        this.groupDetailPageLength = this.groupDetails.length;
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
   * onUpdateBtnClick
   */
  onUpdateBtnClick() {
    // on add groups
    this.onAddGroupApis();
    this.onAddGroupDetails();
    this.onAddGroupApiDenies();

    if (!this.formName.invalid) {
      // show loading
      this.isLoading$.next(true);

      // create group item
      const groupItem = {
        name: this.inputName.name,
        groupDetails: this.inputGroupDetails,
        groupAPIAccesses: this.inputGroupAPI.groupAPIAccesses,
        groupAPIDenines: this.inputGroupAPI.groupAPIDenines,
      };

      this.api.update(this.id, groupItem).subscribe(
        () => {
          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();

          this.common.showSuccess('Updated success!');

          // redirect to list
          this.router.navigate(['/features/groups']);
        },
        (error: any) => {
          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();

          this.common.showError(`Updated failure! ${error.message}`);

          // redirect to list
          this.router.navigate([`/features/groups/${this.id}`]);
        }
      );
    }
  }
}
