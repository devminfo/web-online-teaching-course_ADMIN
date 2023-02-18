import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserSpecializeService } from 'src/app/core/services/features/f3-user-specialize.service';
import { UserService } from 'src/app/core/services/features/user.service';
import { SubSpecializeService } from 'src/app/core/services/features/f2-sub-specialize.service';
declare var $:any;
@Component({
  selector: 'app-f3-user-specialize-add',
  templateUrl: './f3-user-specialize-add.component.html',
  styleUrls: ['./f3-user-specialize-add.component.scss'],
})
export class F3UserSpecializeAddComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  subSpecializes: any[];
  users: any[];
  specializes: any[];

  // binding data
  input = {
    idUser: '',
    idSubSpecializes: [],
    helpYou: '',
    suggestedTopic: '',
  };

  //form
  form: FormGroup;

  amGet: boolean = false;
  amPost: boolean = false;
  amPut: boolean = false;
  amDelete: boolean = false;

  /**
   * Constructor
   *
   * @param api
   * @param common
   * @param router
   * @param cdr
   * @param formBuilder
   */
  constructor(
    private api: UserSpecializeService,
    private userService: UserService,
    private subSpecializeService: SubSpecializeService,
    private common: CommonService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );

    // Get specializes
    this.getAllSubSpecializes();

    // Get all users
    this.getAllUsers();

    // add validate for controls
    this.form = this.formBuilder.group({
      idUser: [null, [Validators.required]],
      helpYou: [null, []],
      suggestedTopic: [null, []],
      idSubSpecializes: [null, [Validators.required]],
    });
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    setTimeout(() =>{
      $('.js-example-basic-single').select2({
        closeOnSelect: false,
      });
    },500)
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
   * Get all users
   */
  getAllUsers() {
    this.subscription.push(
      this.userService.get().subscribe((data) => {
        this.users = data;
      })
    );
  }

  /**
   * Get all specializes
   */
  getAllSubSpecializes() {
    this.subscription.push(
      this.subSpecializeService.get().subscribe((data) => {
        this.subSpecializes = data;
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
        this.api.add(this.input).subscribe(() => {
          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();

          this.common.showSuccess('Insert new success!');

          // redirect to list
          this.router.navigate(['/features/userspecializes']);
        })
      );
    }
  }
}
