import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, BehaviorSubject } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { GroupSService } from 'src/app/core/services/features/f13-group-services.service';
import { StoresService } from 'src/app/core/services/features/stores.service';

@Component({
  selector: 'app-f13-group-services-update',
  templateUrl: './f13-group-services-update.component.html',
  styleUrls: ['./f13-group-services-update.component.scss']
})
export class F13GroupServicesUpdateComponent implements OnInit, AfterViewInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  storeData: any[];
  id: any;

  // binding data
  input = {
    idStore: '',
    title: '',
    position: 0,
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
   * @param route 
   * @param cdr 
   * @param formBuilder 
   */
  constructor(private api: GroupSService,
    private storeService: StoresService,
    private common: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder) {
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
   * ngOnInit
   */
  ngOnInit(): void {

    // get id from url
    this.id = this.route.snapshot.paramMap.get('id');

    // load data by param
    if (this.id) {
      this.onLoadDataById(this.id);
    }

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
   * ngOnDestroy
   */
  ngOnDestroy() {
    this.subscription.forEach((item) => {
      item.unsubscribe();
    });
  }

  /**
   * getStores
   */
  getStores() {
    this.storeService.get().subscribe(data => {
      this.storeData = data;
    })
  }

  /**
   * onLoadDataById
   * @param id
   */
  onLoadDataById(id: String) {
    // show loading
    this.isLoading$.next(true);

    this.subscription.push(
      this.api.find(id).subscribe((data) => {

        // load data to view input
        this.input = {
          idStore: data.idStore,
          title: data.title,
          position: data.position,
          isShow: data.isShow,
        };

        // hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();
      })
    );
  }

  /**
 * onAddNewBtnClick
 */
  onAddNewBtnClick() {
    // touch all control to show error
    this.form.markAllAsTouched();

    // check form pass all validate
    if (!this.form.invalid) {
      // show loading
      this.isLoading$.next(true);

      this.subscription.push(
        this.api.update(this.id, this.input).subscribe(() => {

          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();

          this.common.showSuccess('Update success!');

          // redirect to list
          this.router.navigate(['/features/groupservices']);

        })
      );
    }
  }

}
