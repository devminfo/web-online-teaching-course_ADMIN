import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { UserService } from 'src/app/core/services/features/user.service';

@Component({
  selector: 'profile-sign-in-method',
  templateUrl: './sign-in-method.component.html',
})
export class SignInMethodComponent implements OnInit, OnDestroy {
  showChangeEmailForm: boolean = false;
  showChangePasswordForm: boolean = false;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  private unsubscribe: Subscription[] = [];

  // subscription
  subscription: Subscription[] = [];

  emailUsing = '';

  // binding data
  inputEmail = {
    email: '',
  };

  //form
  formEmail: FormGroup;

  // binding data
  inputPassword = {
    password: '',
    newPassword: '',
    passwordConfirm: '',
  };

  passwordConfirm: '';

  //form
  formPassword: FormGroup;

  /**
   * constructor
   *
   * @param cdr
   * @param formBuilder
   * @param userService
   * @param commonService
   */
  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private commonService: CommonService
  ) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));

    // add validate for controls
    this.formEmail = this.formBuilder.group({
      email: [null, [Validators.required]],
    });

    // add validate for controls
    this.formPassword = this.formBuilder.group({
      password: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      passwordConfirm: [null, [Validators.required]],
    });

    this.unsubscribe.push(loadingSubscr);
  }

  ngOnInit(): void {
    this.onLoadMe();
  }

  /**
   * Get profile
   */
  onLoadMe() {
    this.subscription.push(
      this.userService
        .getMe({ populate: '', fields: 'email' })
        .subscribe((data) => {
          this.inputEmail.email = data.email;
          this.emailUsing = data.email;
        })
    );
  }

  /**
   * Toggle email form
   *
   * @param show
   */
  toggleEmailForm(show: boolean) {
    this.showChangeEmailForm = show;
  }

  /**
   * Update email
   */
  saveEmail() {
    // touch all control to show error
    this.formEmail.markAllAsTouched();

    // check form pass all validate
    if (!this.formEmail.invalid) {
      // show loading
      this.isLoading$.next(true);

      this.subscription.push(
        this.userService.updateMe(this.inputEmail).subscribe(
          () => {
            this.commonService.showSuccess('Update Success!');
            this.emailUsing = this.inputEmail.email;

            // hide loading
            this.isLoading$.next(false);
            this.cdr.detectChanges();
            window.location.reload();
          },
          (error) => {
            this.commonService.showError(`Update Failure!, ${error.message}`);

            // hide loading
            this.isLoading$.next(false);
            this.cdr.detectChanges();
          }
        )
      );
    }
  }

  /**
   * Toggle pasword form
   * @param show
   */
  togglePasswordForm(show: boolean) {
    this.showChangePasswordForm = show;
  }

  /**
   * Save password
   */
  savePassword() {
    this.isLoading$.next(true);

    // check form pass all validate
    if (!this.formEmail.invalid) {
      // show loading
      this.isLoading$.next(true);

      this.subscription.push(
        this.userService
          .updatePassword({
            password: this.inputPassword.password,
            newPassword: this.inputPassword.newPassword,
          })
          .subscribe(
            () => {
              this.commonService.showSuccess('Update Success!');

              // hide loading
              this.isLoading$.next(false);
              this.cdr.detectChanges();
            },
            (error) => {
              this.commonService.showError(`Update Failure!, ${error.message}`);

              // hide loading
              this.isLoading$.next(false);
              this.cdr.detectChanges();
            }
          )
      );
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
