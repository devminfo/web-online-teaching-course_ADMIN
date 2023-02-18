import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, Observer, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { AuthService } from 'src/app/core/services/api/00auth.service';
import { F10AssetsPackagesService } from 'src/app/core/services/features/f10-assets-packages.service';

@Component({
  selector: 'app-f10-assets-packages-add',
  templateUrl: './f10-assets-packages-add.component.html',
  styleUrls: ['./f10-assets-packages-add.component.scss'],
})
export class F10AssetsPackagesAddComponent implements OnInit, OnDestroy {

  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  //data
  call: number = 0;
  observer: Observer<any>;
  pageIndex = 1;
  pageLength = 0;
  pageSize = 5;
  conditionFilter: string = '';
  idOwner: any;

  // binding data
  input: any = {
    unitType: 'sms',
    title: '',
    idOwner: '',
    quantity: '',
    originalPrice: '',
    price: '',
    type: 'SMS',
    thumbnail: '',
  };

  //form
  form: FormGroup;
  amGet: boolean = false;
  amPost: boolean = false;
  amPut: boolean = false;
  amDelete: boolean = false;

  /**
   * constructor
   *
   * @param api
   * @param common
   * @param router
   * @param cdr
   * @param subSpecializeService
   * @param formBuilder
   */
  constructor(
    private common: CommonService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private assetsPackage: F10AssetsPackagesService
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );

    // add validate for controls
    this.form = this.formBuilder.group({
      title: [null, [Validators.required]],
      quantity: [null, [Validators.required, Validators.min(0)]],
      originalPrice: [null, [Validators.required, Validators.min(0)]],
      price: [null, [Validators.required, Validators.min(0)]],
      type: [null],
      unitType: [null],
      idOwner: [null],
      thumbnail: [null],
    });
  }

  /**
   * ngOnInit
   */
  ngOnInit() {}

  /**
   * ngOnDestroy
   */
  ngOnDestroy() {
    this.subscription.forEach((item) => {
      item.unsubscribe();
    });
  }

  /**
   * changeIsCheckedSMS
   * @param checked
   */
  changeIsCheckedSMS(checked: string) {
    this.input.type = checked;
    this.input.unitType = 'sms';
  }

  /**
   * changeIsCheckedVoice
   * @param checked
   */
  changeIsCheckedVoice(checked: string) {
    this.input.type = checked;
    this.input.unitType = 'minutes';
  }

  /**
   * changeIsCheckedMMS
   * @param checked
   */
  changeIsCheckedMMS(checked: string) {
    this.input.type = checked;
    this.input.unitType = 'sms';
  }

  /**
   * onAddNewBtnClick
   */
  onAddNewBtnClick() {

    // check form pass all validate
    if (!this.form.invalid) {

      // show loading
      this.isLoading$.next(true);

      //get Id Owner
      this.getIdOwner();
      this.input.idOwner = this.idOwner;

      //thumbnail
      this.input.thumbnail = '0';
      this.subscription.push(
        this.assetsPackage.add(this.input).subscribe(() => {

          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();
          this.common.showSuccess('Insert new success!');

          // redirect to list
          this.router.navigate(['/features/assetspackages']);
        })
      );
    }
  }

  /**
   * getIdOwner
   * @returns
   */
  getIdOwner() {
    const id = this.authService.getAuthFromLocalStorage();
    this.idOwner = id?.user._id;
  }
}
