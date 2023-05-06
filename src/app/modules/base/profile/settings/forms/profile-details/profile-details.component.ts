import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/features/user.service';
import { CommonService } from 'src/app/core/services/common.service';
import flatpickr from 'flatpickr';
import { Vietnamese } from 'flatpickr/dist/l10n/vn';
import { Router } from '@angular/router';

@Component({
  selector: 'profile-details',
  templateUrl: './profile-details.component.html',
})
export class ProfileDetailsComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  // binding uploads image or file
  @ViewChild('inputAvatar', { static: false })
  inputAvatar: ElementRef;

  private unsubscribe: Subscription[] = [];

  // subscription
  subscription: Subscription[] = [];

  userDetail: any = {
    phone: '',
    dateOfBirth: '',
    avatar: '',
  };

  // binding data
  input: any = {
    fullName: '',
    phone: '',
    dateOfBirth: '',
    avatar: '',
    gender: '',
  };

  //form
  form: FormGroup;

  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private commonService: CommonService
  ) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));

    // add validate for controls
    this.form = this.formBuilder.group({
      fullName: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      dateOfBirth: [null, [Validators.required]],
      avatar: [null, []],
    });

    this.unsubscribe.push(loadingSubscr);
  }

  ngOnInit(): void {
    flatpickr('#dateOfBirth_datepicker', {
      // locale: Vietnamese,
      dateFormat: 'd/m/Y',
      minDate: '12/12/1940',
      maxDate: '12/12/2015',
      defaultDate: '12/12/2000',
    });

    this.onLoadData();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  /**
   * Load data
   */
  onLoadData() {
    this.getProfile();
  }

  /**
   * Get profile
   */
  getProfile() {
    this.subscription.push(
      this.userService
        .getMe({ populate: 'groups', fields: 'groups.name' })
        .subscribe((data) => {
          this.input = {
            fullName: data.fullName,
            phone: data.phone,
            dateOfBirth: new Date(data.dateOfBirth).toLocaleDateString('vi-VN'),
            avatar: data.avatar,
            gender: data.gender,
          };
          this.userDetail = {
            phone: data.phone,
            dateOfBirth: new Date(data.dateOfBirth).toLocaleDateString('vi-VN'),
            avatar: data.avatar,
          };
        })
    );
  }

  /**
   * onAvatarUploadClick
   */
  onAvatarUploadClick() {
    this.subscription.push(
      this.commonService.uploadImageCore(this.inputAvatar).subscribe((data) => {
        if (data) {
          console.log({ data });
          this.input.avatar = data['files'][0];
        }
      })
    );
  }

  /**
   * onAvatarDeleteClick
   */
  onAvatarDeleteClick() {
    const isDelete = confirm('Bạn có muốn xóa hình? ');
    if (isDelete) this.input.avatar = '';
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

      const dataUpdate: any = {
        avatar: this.input.avatar,
        fullName: this.input.fullName,
        gender: this.input.gender.toUpperCase(),
      };

      const oldDateOfBirth = this.userDetail.dateOfBirth;
      const updateDateOfBirth = this.input.dateOfBirth;

      // check dateOfBirth change
      if (oldDateOfBirth !== updateDateOfBirth) {
        const [day, month, year] = this.input.dateOfBirth.split('/');
        dataUpdate.dateOfBirth = new Date(year, +month - 1, day).getTime();
        this.userDetail.dateOfBirth = new Date(
          dataUpdate.dateOfBirth
        ).toLocaleDateString('vi-VN');
        this.input.dateOfBirth = new Date(
          dataUpdate.dateOfBirth
        ).toLocaleDateString('vi-VN');
      }

      // check phone change
      if (this.userDetail.phone != this.input.phone) {
        dataUpdate.phone = this.input.phone;
        this.userDetail.phone = dataUpdate.phone;
        this.input.phone = dataUpdate.phone;
      }

      // Create list image uploads
      if (this.input.avatar && this.userDetail.avatar != this.input.avatar) {
        this.commonService
          .comfirmImages([this.input.avatar])
          .subscribe((dataImage) => {
            dataUpdate['avatar'] = dataImage[0][4];
            console.log(dataImage);

            this.subscription.push(
              this.userService.updateMe(dataUpdate).subscribe(
                () => {
                  this.commonService.showSuccess('Update Success!');

                  // hide loading
                  this.isLoading$.next(false);
                  this.cdr.detectChanges();

                  // Reload component
                  this.router
                    .navigateByUrl('/profile', {
                      skipLocationChange: true,
                    })
                    .then(() => {
                      this.router.navigate([`/profile`]);
                    });

                  window.location.reload();
                },
                (error) => {
                  this.commonService.showError(
                    `Update failure! ${error.message}`
                  );
                  // hide loading
                  this.isLoading$.next(false);
                  this.cdr.detectChanges();
                }
              )
            );
          });

        return;
      }

      this.subscription.push(
        this.userService.updateMe(dataUpdate).subscribe(
          () => {
            this.commonService.showSuccess('Update Success!');

            // hide loading
            this.isLoading$.next(false);
            this.cdr.detectChanges();

            // Reload component
            window.location.reload();
          },
          (error) => {
            this.commonService.showError(`Update failure! ${error.message}`);
            // hide loading
            this.isLoading$.next(false);
            this.cdr.detectChanges();
          }
        )
      );
    }
  }
}
