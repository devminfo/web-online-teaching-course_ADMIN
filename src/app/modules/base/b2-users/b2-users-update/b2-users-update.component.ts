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
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { GroupAPIService } from 'src/app/core/services/base/b6-group-api.service';
import { GroupDetailService } from 'src/app/core/services/base/b7-group-detail.service';
import { GroupService } from 'src/app/core/services/base/b8-group.service';
import flatpickr from 'flatpickr';
import { UserService } from 'src/app/core/services/features/user.service';

@Component({
  selector: 'app-b2-users-update',
  templateUrl: './b2-users-update.component.html',
  styleUrls: ['./b2-users-update.component.scss'],
})
export class B2UsersUpdateComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  id: any;

  // binding uploads image or file
  @ViewChild('inputAvatar', { static: false })
  inputAvatar: ElementRef;

  // Handle tab header
  tabEnum = {
    name: 'name',
    groups: 'groups',
    groupDetails: 'groupDetails',
    groupApiAccesses: 'groupApiAccesses',
    groupApiDenies: 'groupApiDenies',
  };
  tabSelected = this.tabEnum.name;

  //user info
  isManager = false;
  roleEnum = {
    manager: 'manager',
    customer: 'customer',
  };
  formUserInfo: FormGroup;
  inputUserInfo: any = {
    fullName: '',
    phone: '',
    email: '',
    role: 'customer',
  };

  inputUserInfoOriginal: any = {
    fullName: '',
    phone: '',
    email: '',
    role: 'customer',
  };

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

  // groups
  groups: any[] = [];

  /**
   * constructor
   *
   * @param userService
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
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );

    // add validate for controls
    this.formUserInfo = this.formBuilder.group({
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      group: [null, []],
      phone: [null, []],
      role: [null, []],
    });
  }

  /**
   * ****************** Begin for group details pagination ******************
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
   * ****************** Begin for group api pagination ******************
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
   * ****************** Begin for group denies pagination ******************
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
    // get id from url
    this.id = this.route.snapshot.paramMap.get('id');

    // load data by param
    if (this.id) {
      this.onLoadDataById(this.id);
      this.onLoadData();
    }

    flatpickr('#born_datepicker', {
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
   * onLoadDataById
   * @param id
   */
  onLoadDataById(id: string) {
    // show loading
    this.isLoading$.next(true);

    this.subscription.push(
      this.userService
        .find(
          id,
          `populate=groupAPIDenines,groupAPIAccesses,groupDetails.idGroupDetail`
        )
        .subscribe((data) => {
          this.inputUserInfo = {
            fullName: data.fullName,
            phone: data.phone,
            email: data.email,
            role: data.role,
          };

          this.inputUserInfoOriginal = {
            fullName: data.fullName,
            phone: data.phone,
            email: data.email,
            role: data.role,
          };

          if (data.role === this.roleEnum.manager) {
            this.isManager = true;

            const groupDetailsObj = data.groupDetails;
            const groupAPIAccesses = data.groupAPIAccesses;
            const groupAPIDenines = data.groupAPIDenines;

            // load values into inputGroupAPI
            this.inputGroupAPI = {
              groupAPIAccesses: groupAPIAccesses.map(
                (apiAccess: any) => apiAccess._id
              ),
              groupAPIDenines: groupAPIDenines.map(
                (apiDenie: any) => apiDenie._id
              ),
            };

            // load values into inputGroupDetails
            this.inputGroupDetails = groupDetailsObj.map(
              (groupDetail: any) => ({
                idGroupDetail: groupDetail.idGroupDetail
                  ? groupDetail.idGroupDetail._id
                  : '',
                accessMethods: groupDetail.accessMethods,
              })
            );

            // update checked
            if (this.groupApis) {
              this.inputGroupAPI.groupAPIAccesses.forEach(
                (apiAccesses: any) => {
                  const exist = this.groupApis.find(
                    (groupApi: any) => groupApi._id == apiAccesses
                  );
                  if (exist) exist.checked = true;
                }
              );
            }

            if (this.apiDenies) {
              this.inputGroupAPI.groupAPIDenines.forEach((apiDenie: any) => {
                const exist = this.apiDenies.find(
                  (groupApi: any) => groupApi._id == apiDenie
                );

                if (exist) exist.checked = true;
              });
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
            }
          }

          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();
        })
    );
  }

  /**
   * On show add new group
   * @param isShow
   */
  onShowSelectGroups(isShow: boolean) {
    this.isManager = isShow;
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
    const filter = '&isChild=false&sort=position&populate=childs';
    this.subscription.push(
      this.groupDetailService
        .getMenuOfCurrentUser(0, 100, filter)
        .subscribe((response) => {
          const data = response.results;
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
          this.groupDetailPageLength = data.groupDetails;
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
   * onUpdateBtnClick
   */
  onUpdateBtnClick() {
    // touch all control to show error
    this.formUserInfo.markAllAsTouched();
    // on add group
    this.onAddGroupDetails();
    this.onAddGroupApis();
    this.onAddGroupApiDenies();

    if (!this.formUserInfo.invalid) {
      // show loading
      this.isLoading$.next(true);

      // update born
      const { born, phone, email, role, ...rest } = this.inputUserInfo;

      const [day, month, year] = born ? born.split('/') : [0, 0, 0];

      if (!phone || phone === this.inputUserInfoOriginal.phone)
        delete rest.phone;
      if (!email || email === this.inputUserInfoOriginal.email)
        delete rest.email;

      // new useritem
      let userItem: any = {
        ...rest,
        born: born ? new Date(year, +month - 1, day).getTime() : 0,
      };

      // check update manager
      if (this.isManager) {
        const authorizationItem = {
          groupDetails: this.inputGroupDetails,
          groupAPIAccesses: this.inputGroupAPI.groupAPIDenines,
          groupAPIDenines: this.inputGroupAPI.groupAPIDenines,
          role,
        };

        // update roles
        this.subscription.push(
          this.userService.updateRoles(this.id, authorizationItem).subscribe(
            () => {
              // // call api
              this.subscription.push(
                this.userService.update(this.id, userItem).subscribe(
                  () => {
                    // hide loading
                    this.isLoading$.next(false);
                    this.cdr.detectChanges();

                    this.common.showSuccess('Insert new success!');

                    // redirect to list
                    this.router.navigate(['/features/users']);
                  },
                  (error: any) => {
                    this.common.showError(
                      `Insert new failure! ${error.message}`
                    );

                    // hide loading
                    this.isLoading$.next(false);
                    this.cdr.detectChanges();
                  }
                )
              );
            },
            (error: any) => {
              this.common.showError(`Insert new failure! ${error.message}`);

              // hide loading
              this.isLoading$.next(false);
              this.cdr.detectChanges();
            }
          )
        );

        return;
      }

      // // call api
      this.subscription.push(
        this.userService.update(this.id, userItem).subscribe(
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
