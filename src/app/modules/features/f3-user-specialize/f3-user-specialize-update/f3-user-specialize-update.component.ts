import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserSpecializeService } from 'src/app/core/services/features/f3-user-specialize.service';
import { SubSpecializeService } from 'src/app/core/services/features/f2-sub-specialize.service';
import { UserService } from 'src/app/core/services/features/user.service';
declare var $:any;
@Component({
  selector: 'app-f3-user-specialize-update',
  templateUrl: './f3-user-specialize-update.component.html',
  styleUrls: ['./f3-user-specialize-update.component.scss'],
})
export class F3UserSpecializeUpdateComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  subSpecializes: any[];
  users: any[];

  // binding data
  input = {
    idUser: '',
    idSubSpecializes: [],
    helpYou: '',
    suggestedTopic: '',
  };

  specializes: any[];

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
    private api: UserSpecializeService,
    private subSpecializeService: SubSpecializeService,
    private userService: UserService,
    private common: CommonService,
    private router: Router,
    private route: ActivatedRoute,
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
      $('.js-example-basic-single').select2();
    },500)

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
          idUser: data.idUser,
          helpYou: data.helpYou,
          suggestedTopic: data.suggestedTopic,
          idSubSpecializes: data.idSubSpecializes,
        };

        // hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();
      })
    );
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
   * onUpdateBtnClick
   */
  onUpdateBtnClick() {
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

          this.common.showSuccess('Update Success!');

          // redirect to list
          this.router.navigate(['/features/userspecializes']);
        })
      );
    }
  }
}
