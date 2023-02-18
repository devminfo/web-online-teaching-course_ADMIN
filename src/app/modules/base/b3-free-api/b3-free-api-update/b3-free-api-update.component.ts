import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FreeAPIService } from 'src/app/core/services/base/b3-free-api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-b3-free-api-update',
  templateUrl: './b3-free-api-update.component.html',
  styleUrls: ['./b3-free-api-update.component.scss'],
})
export class B3FreeAPIUpdateComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  // binding data
  input = {
    collectionName: '',
    url: '',
    accessMethods: [''],
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
    private api: FreeAPIService,
    private common: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );
    // add validate for controls
    this.form = this.formBuilder.group({
      collectionName: [null, [Validators.required]],
      url: [null, [Validators.required]],
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
        // load data to view input
        this.input = {
          collectionName: data.collectionName,
          url: data.url,
          accessMethods: data.accessMethods,
        };

        // loading method access
        if (this.input.accessMethods.includes('GET')) this.amGet = true;
        if (this.input.accessMethods.includes('POST')) this.amPost = true;
        if (this.input.accessMethods.includes('PUT')) this.amPut = true;
        if (this.input.accessMethods.includes('DELETE')) this.amDelete = true;

        // hide loading
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
          this.router.navigate(['/features/freeapis']);
        })
      );
    }
  }
}
