import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/api/00auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = [];

  // KeenThemes mock, change it to:
  defaultAuth: any = {
    email: 'admin@gmail.com',
    password: 'admin123123',
  };
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  /**
   * constructor
   * @param fb
   * @param authService
   * @param route
   * @param router
   */
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    // if (this.authService.currentUserValue) {
    //   this.router.navigate(['/']);
    // }
  }

  /**
   * ngOnInit
   */
  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
  }

  /**
   * ngOnDestroy
   */
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  /**
   * initForm
   */
  initForm() {
    this.loginForm = this.fb.group({
      email: [
        this.defaultAuth.email,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  /**
   * onSubmitBtnClick
   */
  onSubmitBtnClick() {
    this.hasError = false;

    this.unsubscribe.push(
      this.authService
        .signin(this.f.email.value, this.f.password.value)
        .pipe(first())
        .subscribe(
          (user: any | undefined) => {
            if (user) {
              // nếu là user quản lý mới được phép đăng nhập vào admin
              if (user.user.role === 'manager') {
                // save data login to local store
                this.authService.setAuthFromLocalStorage(user);

                // redirect to last page login or dashboard
                this.router.navigate([this.returnUrl]);
              } else {
                alert('Bạn không có quyền truy cập!');
              }
            } else {
              this.hasError = true;
            }

            // hide spiner
            this.authService.isLoadingSubject.next(false);
          },
          (error) => {
            // handle error
            if (error.status == 404) {
              alert('Tài khoản hoặc mật khẩu bị sai vui lòng kiểm tra lại!');
            }

            // hide spiner
            this.authService.isLoadingSubject.next(false);
          }
        )
    );
  }

  /**
   * on Google Btn Click
   */
  onGoogleBtnClick() {
    this.authService.getUserByToken().subscribe((data1) => {});
  }

  /**
   * convenience getter for easy access to form fields
   */
  get f() {
    return this.loginForm.controls;
  }
}
