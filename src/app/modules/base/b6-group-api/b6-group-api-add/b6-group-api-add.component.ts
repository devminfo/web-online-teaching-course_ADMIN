import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { GroupAPIService } from 'src/app/core/services/base/b6-group-api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-b6-group-api-add',
  templateUrl: './b6-group-api-add.component.html',
  styleUrls: ['./b6-group-api-add.component.scss'],
})
export class B6GroupAPIAddComponent
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
    private api: GroupAPIService,
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
      collectionName: [null, [Validators.required]],
      url: [null, [Validators.required]],
    });
  }

  /**
   * ngOnInit
   */
  ngOnInit() {}

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
   * onAddNewBtnClick
   */
  onAddNewBtnClick() {
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
        this.api.add(this.input).subscribe(() => {
          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();

          this.common.showSuccess('Insert new success!');

          // redirect to list
          this.router.navigate(['/features/groupapis']);
        })
      );
    }
  }
}
