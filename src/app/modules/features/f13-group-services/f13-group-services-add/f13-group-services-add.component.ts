import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { GroupSService } from 'src/app/core/services/features/f13-group-services.service';
import { StoresService } from 'src/app/core/services/features/stores.service';
declare var $: any;

@Component({
  selector: 'app-f13-group-services-add',
  templateUrl: './f13-group-services-add.component.html',
  styleUrls: ['./f13-group-services-add.component.scss'],
})
export class F13GroupServicesAddComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  storeData: any[];

  // binding data
  input = {
    idStore: '',
    title: '',
    position: '',
    isShow: true,
  };

  //form
  form: FormGroup;

  /**
   * constructor
   * @param api
   * @param storeService
   * @param common
   * @param router
   * @param cdr
   * @param formBuilder
   */
  constructor(
    private api: GroupSService,
    private storeService: StoresService,
    private common: CommonService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );

    // add validate for controls
    this.form = this.formBuilder.group({
      idStore: [null, [Validators.required]],
      title: [null, [Validators.required]],
      position: [null, [Validators.required]],
      isShow: [null, []],
    });
  }

  /**
   * ng On Init
   */
  ngOnInit(): void {
    // load data stores
    this.getStores();
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
   * get Stores
   */
  getStores() {
    this.storeService.get().subscribe((data) => {
      this.storeData = data;
    });
  }

  /**
   * on Add New Btn Click
   */
  onAddNewBtnClick() {
    // touch all control to show error
    this.form.markAllAsTouched();

    // check form pass all validate
    if (!this.form.invalid) {
      // show loading
      this.isLoading$.next(true);

      this.subscription.push(
        this.api.add(this.input).subscribe((data) => {
          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();

          this.common.showSuccess('Insert new success!');

          // redirect to list
          this.router.navigate(['/features/groupservices']);
        })
      );
    }
  }
}
