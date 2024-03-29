import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { GroupAPIService } from 'src/app/core/services/base/b6-group-api.service';
import { GroupDetailService } from 'src/app/core/services/base/b7-group-detail.service';
import { GroupService } from 'src/app/core/services/base/b8-group.service';
import flatpickr from 'flatpickr';
import { UserService } from 'src/app/core/services/features/user.service';
declare var $: any;

@Component({
  selector: 'app-b2-users-add',
  templateUrl: './b2-users-add.component.html',
  styleUrls: ['./b2-users-add.component.scss'],
})
export class B2UsersAddComponent implements OnInit, AfterViewInit, OnDestroy {
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

  //user info
  isAddManager = false;
  roleEnum = {
    manager: 'manager',
    customer: 'customer',
  };
  formUserInfo: FormGroup;
  inputUserInfo: any = {
    fullName: '',
    phone: '',
    email: '',
    password: '',
    gender: 'female',
    role: 'customer',
    groups: [],
    dateOfBirth: 0,
  };

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
  }[] = [];

  // group denies
  apiDenies: any[];
  apiDeniesTemp: any[];

  // groups
  groups: any[] = [];

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
    private userService: UserService,
    private groupAPIService: GroupAPIService,
    private groupDetailService: GroupDetailService,
    private groupService: GroupService,
    private common: CommonService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );

    // add validate for controls
    this.formUserInfo = this.formBuilder.group({
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      groups: [null, []],
      phone: [null, []],
      dateOfBirth: [null, []],
      role: [null, []],
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
            : ['GET'];
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
          : ['GET'];
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
            : ['GET'];
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

  // condition fillter
  conditonGroupAPiFilter: string = '';
  conditionsGroupAPi: any[] = [];

  /**
   * ngOnInit
   */
  ngOnInit() {
    this.onLoadData();

    flatpickr('#dateOfBirth_datepicker', {
      // locale: Vietnamese,
      dateFormat: 'd/m/Y',
      minDate: '12/12/1940',
      maxDate: '12/12/2015',
      defaultDate: '12/12/2000',
    });
  }

  /**
   * ng After View Init
   */
  ngAfterViewInit(): void {
    // scroll top screen
    window.scroll({ left: 0, top: 0, behavior: 'smooth' });
    $('.selectgroups').select2();
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
   * On show add new group
   * @param isShow
   */
  onShowSelectGroups(isShow: boolean) {
    this.isAddManager = isShow;
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
    this.loadGroups();
  }

  // List groups
  loadGroups() {
    this.subscription.push(
      this.groupService.get().subscribe((data) => {
        this.groups = data;
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

        this.apiDeniesTemp = this.apiDenies;
      })
    );
  }

  /**
   * Load group details
   */
  loadGroupDetails() {
    const filter = '&isChild=false&sort=position&populate=childs';

    this.subscription.push(
      this.groupDetailService
        .getMenuOfCurrentUser(0, 100, filter)
        .subscribe((response) => {
          const data = response.results;
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
    this.formUserInfo.markAllAsTouched();

    // add group details
    if (this.tabSelected === this.tabEnum.groupDetails)
      this.onAddGroupDetails();

    // add group api accesses
    if (this.tabSelected === this.tabEnum.groupApiAccesses)
      this.onAddGroupApis();

    if (!this.formUserInfo.invalid) this.tabSelected = tab;
  }

  /**
   * onAddNewBtnClick
   */
  onAddNewBtnClick() {
    // touch all control to show error
    this.formUserInfo.markAllAsTouched();
    // on add group
    this.onAddGroupDetails();
    this.onAddGroupApis();
    this.onAddGroupApiDenies();

    if (!this.formUserInfo.invalid) {
      // show loading
      this.isLoading$.next(true);

      if (!this.inputUserInfo['phone']) delete this.inputUserInfo.phone;

      // update dateOfBirth
      const { dateOfBirth, role, ...rest } = this.inputUserInfo;
      const [day, month, year] = dateOfBirth
        ? dateOfBirth.split('/')
        : [0, 0, 0];

      // new useritem
      let userItem: any = {
        ...rest,
        dateOfBirth: dateOfBirth
          ? new Date(year, +month - 1, day).getTime()
          : 0,
      };

      // check add manager
      // if (this.isAddManager) {
      //   const authorizationItem = {
      //     groupDetails: this.inputGroupDetails,
      //     groupAPIAccesses: this.inputGroupAPI.groupAPIDenines,
      //     groupAPIDenines: this.inputGroupAPI.groupAPIDenines,
      //   };

      //   userItem = {
      //     ...userItem,
      //     ...authorizationItem,
      //   };
      // }

      // // call api
      this.subscription.push(
        this.userService.add(userItem).subscribe(
          () => {
            // hide loading
            this.isLoading$.next(false);
            this.cdr.detectChanges();

            this.common.showSuccess('Insert new success!');

            // redirect to list
            this.router.navigate(['/features/users']);
          },
          (error: any) => {
            this.common.showError(`Insert new failure! ${error.message}`);

            // hide loading
            this.isLoading$.next(false);
            this.cdr.detectChanges();
          }
        )
      );
    }
  }
}
