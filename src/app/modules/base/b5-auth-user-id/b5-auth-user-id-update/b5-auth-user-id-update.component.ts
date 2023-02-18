import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthUserIdAPIService } from 'src/app/core/services/base/b5-auth-user-id.service';
import { CommonService } from 'src/app/core/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GroupDetailService } from 'src/app/core/services/base/b7-group-detail.service';

@Component({
  selector: 'auth-user-id-update',
  templateUrl: './b5-auth-user-id-update.component.html',
  styleUrls: ['./b5-auth-user-id-update.component.scss'],
})
export class B5AuthUserIdUpdateComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  listReferIds: string[];
  referId: string;

  // binding data
  input = {
    collectionName: '',
    url: '',
    accessMethods: [''],
    referId: '',
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
    private api: AuthUserIdAPIService,
    private common: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private groupDetailService: GroupDetailService,
    private formBuilder: FormBuilder
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );

    // add validate for controls
    this.form = this.formBuilder.group({
      collectionName: [null, [Validators.required]],
      url: [null, [Validators.required]],
      referId: [null, [Validators.required]],
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
  onAccessMethodChange() {
    this.input.accessMethods = [];

    // add GET method
    if (this.amGet) this.input.accessMethods.push('GET');

    // add POST method
    if (this.amPost) this.input.accessMethods.push('POST');

    // add PUT method
    if (this.amPut) this.input.accessMethods.push('PUT');

    // add DELETE method
    if (this.amDelete) this.input.accessMethods.push('DELETE');
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
        // save referIds

        // load data to view input
        this.input = {
          collectionName: data.collectionName,
          url: data.url,
          accessMethods: data.accessMethods,
          referId: data.referId,
        };

        // loading method access
        if (this.input.accessMethods.includes('GET')) this.amGet = true;
        if (this.input.accessMethods.includes('POST')) this.amPost = true;
        if (this.input.accessMethods.includes('PUT')) this.amPut = true;
        if (this.input.accessMethods.includes('DELETE')) this.amDelete = true;

        // set refer ids
        this.updateListReferIds(data.collectionName);

        // hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();
      })
    );
  }

  updateListReferIds(collectionName: string) {
    this.subscription.push(
      this.groupDetailService
        .getCollectionKey(collectionName)
        .subscribe((data) => {
          // save referIds
          this.listReferIds = data;
        })
    );
  }

  /**
   * onUpdateBtnClick
   */
  onUpdateBtnClick() {
    // touch all control to show error
    this.form.markAllAsTouched();

    // check form pass all validate
    if (!this.form.invalid) {
      // check access methods
      if (
        this.input.accessMethods.length === 0 ||
        this.input.accessMethods[0] == ''
      ) {
        this.common.showError('Vui lòng nhập Access Methods');
        return;
      }

      // show loading
      this.isLoading$.next(true);

      this.subscription.push(
        this.api.update(this.id, this.input).subscribe(() => {
          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();

          this.common.showSuccess('Update Success!');

          // redirect to list
          this.router.navigate(['/features/authuserids']);
        })
      );
    }
  }
}
