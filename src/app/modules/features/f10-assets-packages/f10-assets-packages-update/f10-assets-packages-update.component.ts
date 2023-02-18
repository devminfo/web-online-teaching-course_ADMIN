import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/api/00auth.service';
import { F10AssetsPackagesService } from 'src/app/core/services/features/f10-assets-packages.service';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-f10-assets-packages-update',
  templateUrl: './f10-assets-packages-update.component.html',
  styleUrls: ['./f10-assets-packages-update.component.scss'],
})
export class F10AssetsPackagesUpdateComponent implements OnInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  idOwner: any;

  // update data
  update: any = {
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
  id: any;
  amGet: boolean = false;
  amPost: boolean = false;
  amPut: boolean = false;
  amDelete: boolean = false;

  /**
   * constructor
   * @param api
   * @param dialog
   */
  constructor(
    public common: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private assetsPackagesService: F10AssetsPackagesService
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
  ngOnInit() {
    // get id from url
    this.id = this.route.snapshot.paramMap.get('id');

    // load data by param
    if (this.id) {
      this.onLoadDataById(this.id);
    }
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
   * changeIsCheckedSMS
   * @param checked
   */
  changeIsCheckedSMS(checked: string) {
    this.update.type = checked;
    this.update.unitType = 'sms';
  }

  /**
   * changeIsCheckedVoice
   * @param checked
   */
  changeIsCheckedVoice(checked: string) {
    this.update.type = checked;
    this.update.unitType = 'minutes';
  }

  /**
   * changeIsCheckedMMS
   * @param checked
   */
  changeIsCheckedMMS(checked: string) {
    this.update.type = checked;
    this.update.unitType = 'sms';
  }

  /**
   * onLoadDataById
   * @param id
   */
  onLoadDataById(id: String) {
    
    // show loading
    this.isLoading$.next(true);
    this.subscription.push(
      this.assetsPackagesService.find(id).subscribe((data) => {

        // load data to view input
        this.update = {
          title: data.title,
          unitType: data.unitType,
          idOwner: data.idOwner,
          quantity: data.quantity,
          originalPrice: data.originalPrice,
          price: data.price,
          type: data.type,
          thumbnail: data.thumbnail,
        };

        //hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();
      })
    );
  }

  /**
   * onUpdateBtnClick
   */
  onUpdateBtnClick() {
    // touch all control to show error
    this.form.markAllAsTouched();

    if (!this.form.invalid) {

      //get id owner
      this.getIdOwner();
      this.update.idOwner = this.idOwner;

      // show loading
      this.isLoading$.next(true);

      this.subscription.push(
        this.assetsPackagesService
          .update(this.id, this.update)
          .subscribe(() => {

            // hide loading
            this.isLoading$.next(false);
            this.cdr.detectChanges();
            this.common.showSuccess('Update Success!');

            // redirect to list
            this.router.navigate(['/features/assetspackages']);
          })
      );
    }
  }

  /**
   * getIdOwner
   */
  getIdOwner() {
    const id = this.authService.getAuthFromLocalStorage();
    this.idOwner = id?.user._id;
  }
}
