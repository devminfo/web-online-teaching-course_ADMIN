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
import { StoreService } from 'src/app/core/services/features/store.service';
import { AuthService } from 'src/app/core/services/api/00auth.service';

@Component({
  selector: 'app-b9-customers-update',
  templateUrl: './b9-customers-update.component.html',
  styleUrls: ['./b9-customers-update.component.scss'],
})
export class B9CustomersUpdateComponent
  implements OnInit, AfterViewInit, OnDestroy {
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
    idStore: '',
    fullName: '',
    nickName: '',
    password: '',
    phone: '',
    email: '',
    avatar: '',
    role: 'customer',
    gender: 'MALE',
    typeUser: 'CUSTOMER',
    dateOfBirth: 0,
  };

  inputUserInfoOriginal: any = {
    fullName: '',
    phone: '',
    email: '',
    role: 'customer',
    password: '',
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

  // data reference
  storeDatas: any[] = [];
  userDatas: any[] = [];

  //show password 
  showPassword: boolean;

  dateOfBirth: any;

  // binding uploads image or file
  @ViewChild('inputImageAvatar', { static: false })
  inputImageAvatar: ElementRef;

  isCheckUploadAvatar = false;
  arrayAvatar: any = [];
  styleAvatar = 'background-image: url(assets/media/svg/files/blank-image.svg)';

  /**
   * constructor
   * @param userService 
   * @param storeService 
   * @param groupAPIService 
   * @param groupDetailService 
   * @param groupService 
   * @param common 
   * @param router 
   * @param cdr 
   * @param formBuilder 
   * @param route 
   * @param authService 
   */
  constructor(
    private userService: UserService,
    private storeService: StoreService,
    private groupAPIService: GroupAPIService,
    private groupDetailService: GroupDetailService,
    private groupService: GroupService,
    public common: CommonService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );

    // add validate for controls
    this.formUserInfo = this.formBuilder.group({
      fullName: [null, [Validators.required]],
      nickName: [null, [Validators.required]],
      email: [null, [Validators.email]],
      password: [null, []],
      group: [null, []],
      phone: [null, [Validators.required]],
      role: [null, []],
      avatar: [null, [Validators.required]],
      idStore: [null, [Validators.required]],
      gender: [null, []],
      typeUser: [null, []],
      dateOfBirth: [null, []],
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
    // load Data Reference
    this.loadDataReference();

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
  ngAfterViewInit(): void {
    // scroll top screen
    window.scroll({ left: 0, top: 0, behavior: 'smooth' });

    flatpickr('#birthday_datepicker', {
      dateFormat: 'd-m-Y',
      maxDate: 'today',
    });
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
   * loadDataReference
   */
  loadDataReference() {
    // get list store
    this.getListStore();

    // get list user
    this.getListUser();
  }

  /**
   * get list Store
   */
  getListStore() {
    this.subscription.push(
      this.storeService.get().subscribe((data) => {
        this.storeDatas = data;
      })
    );

    // authStore
    const authStore = this.authService.getAuthFromLocalStorage();
    if (authStore?.user.email !== 'admin@gmail.com') {
      this.subscription.push(
        this.storeService.get().subscribe((data) => {
          this.storeDatas = data.filter(
            (item: any) => item._id === authStore?.user.idStore
          );
        })
      );
    }
  }

  /**
   * get list User
   */
  getListUser() {
    this.subscription.push(
      this.userService.get().subscribe((data) => {
        this.userDatas = data.filter(
          (item: any) => item.isDeleted === false
        );
      })
    );

    // authUser
    const authUser = this.authService.getAuthFromLocalStorage();
    if (authUser?.user.email !== 'admin@gmail.com') {
      this.subscription.push(
        this.userService.get().subscribe((data) => {
          this.userDatas = data.filter(
            (item: any) => item.idStore === authUser?.user.idStore && item.isDeleted === false
          );
        })
      );
    }
  }

  /**
   * on Avatar Upload image Click
   */
  onAvatarUploadImageClick() {
    this.subscription.push(
      this.common.uploadImageCore(this.inputImageAvatar).subscribe((data) => {
        if (data) {
          if (data['files'].length > 0) {
            this.inputUserInfo.avatar = data['files'][0];
            this.isCheckUploadAvatar = true;
          }
        }
      })
    );
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
            nickName: data.nickName,
            phone: data.phone,
            email: data.email,
            password: data.password,
            role: data.role,
            avatar: data.avatar,
            idStore: data.idStore,
            gender: data.gender,
            typeUser: data.typeUser,
            dateOfBirth: data.dateOfBirth,
          };

          this.inputUserInfoOriginal = {
            fullName: data.fullName,
            phone: data.phone,
            email: data.email,
            password: data.password,
            role: data.role,
          };
          this.dateOfBirth = this.common.formatUnixTimestampDateToDDMMYYY(data.dateOfBirth);

          if (this.inputUserInfo.avatar != '') {
            this.arrayAvatar.push(this.inputUserInfo.avatar);
            this.styleAvatar = `background-image: url(${this.inputUserInfo.avatar})`;
          }

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

    this.inputUserInfo.dateOfBirth = new Date(
      this.common.coventDateDDMMYYYYToYYYYMMDD(this.dateOfBirth!)
    ).getTime();

    // delete validator phone
    if (this.inputUserInfo.role === 'manager') {
      this.formUserInfo.get('phone')?.setErrors(null);
      this.formUserInfo.get('phone')?.setValidators(null);

      this.inputUserInfo.typeUser = "";
    };

    // check isCheckUploadAvatar
    if (!this.isCheckUploadAvatar) {
      this.formUserInfo.controls['avatar'].removeValidators(Validators.required);
      this.formUserInfo.controls['avatar'].updateValueAndValidity();
    }

    if (!this.formUserInfo.invalid) {
      // show loading
      this.isLoading$.next(true);

      // update born
      const { phone, role, ...rest } = this.inputUserInfo;

      if (!phone || phone === this.inputUserInfoOriginal.phone)
        delete rest.phone;
      if (!this.inputUserInfo.password || this.inputUserInfo.password === this.inputUserInfoOriginal.password)
        delete rest.password;
      if (!this.inputUserInfo.email || this.inputUserInfo.email === this.inputUserInfoOriginal.email)
        delete rest.email;

      // new useritem
      let userItem: any = {
        ...rest,
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
              // call api
              this.subscription.push(
                this.userService.update(this.id, userItem).subscribe(
                  () => {
                    // hide loading
                    this.isLoading$.next(false);
                    this.cdr.detectChanges();

                    this.common.showSuccess('Insert new success!');

                    // redirect to list
                    this.router.navigate(['/features/customers']);
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

      // check phone
      const checkPhone = this.userDatas.filter(
        (data) => data._id != this.id
      );
      const checkPhoneUser = checkPhone.find(
        (data) => data.phone === this.inputUserInfo.phone
      );

      // check email
      const checkEmail = this.userDatas.filter(
        (data) => data._id != this.id
      );
      const checkEmailUser = checkEmail.find(
        (data) => data.phone === this.inputUserInfo.phone
      );

      // check phone user
      if (!checkPhoneUser) {
        if (!checkEmailUser) {
          // Create list image uploads
          let images = [];
          images.push(userItem.avatar);

          // check avatar > 0
          if (userItem.avatar != '') {
            this.common.comfirmImages(images).subscribe((data) => {
              // Set public image
              userItem.avatar = data[0][4];
              // call api
              this.subscription.push(
                this.userService.update(this.id, userItem).subscribe(
                  () => {
                    // hide loading
                    this.isLoading$.next(false);
                    this.cdr.detectChanges();

                    this.common.showSuccess('Insert new success!');

                    // redirect to list
                    this.router.navigate(['/features/customers']);
                  },
                  (error: any) => {
                    this.common.showError(`Insert new failure! ${error.message}`);

                    // hide loading
                    this.isLoading$.next(false);
                    this.cdr.detectChanges();
                  }
                )
              );
            })
          }
        } else {
          this.isLoading$.next(false);

          setTimeout(() => {
            this.common.showWarning('Email đã tồn tại');
          }, 500);
        }
      } else {
        this.isLoading$.next(false);

        setTimeout(() => {
          this.common.showWarning('Phone đã tồn tại');
        }, 500);
      }
    }
  }

  /**
  * on Show Password Click
  */
  onShowPasswordClick() {
    this.showPassword = !this.showPassword;
  }

  /**
   * onSearchChange
   * @param keyword
   */
  onSearchUserChange(keyword: String) {
    if (keyword != '') {
      this.userDatas = this.userDatas.filter(
        (data) =>
          this.common
            .cleanAccents(
              data.fullName
            )
            ?.toLowerCase()
            .indexOf(this.common.cleanAccents(keyword.toLowerCase())) !==
          -1
      );
    }
    else {
      this.getListUser();
    }
  }

  /**
   * onResetPageClick
   */
  onReloadPageClick(id: any) {
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([`/features/customers/update/${id}`]));
  }

  /**
   * onStoreSelectionChangeById
   */
  onStoreSelectionChangeById() {
    this.inputUserInfo.storeCodeClickSend = this.storeDatas.find((item: any) => item._id == this.inputUserInfo.idStore).clickSendCode;
  }
}
