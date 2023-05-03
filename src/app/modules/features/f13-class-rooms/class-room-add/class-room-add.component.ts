import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClassRoomService } from 'src/app/core/services/features/f13-class-room.service';
import flatpickr from 'flatpickr';
import { AuthService } from 'src/app/core/services/api/00auth.service';

@Component({
  selector: 'app-class-room-add',
  templateUrl: './class-room-add.component.html',
  styleUrls: ['./class-room-add.component.scss'],
})
export class ClassRoomAddComponent implements OnInit, AfterViewInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  // binding uploads thumbnail or file
  @ViewChild('inputImage', { static: false })
  inputImage: ElementRef;

  // binding data
  input: any = {
    members: [],
    teacher: '',
    name: '',
    thumbnail: '',
    desc: '',
    startTime: 0,
    endTime: 0,
  };

  classRooms: any[];

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
    private api: ClassRoomService,
    private common: CommonService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );
    // add validate for controls
    this.form = this.formBuilder.group({
      name: [null, [Validators.required]],
      thumbnail: [null, [Validators.required]],
      desc: [null, [Validators.required]],
      startTime: [null, [Validators.required]],
    });
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    flatpickr('#startTime_datepicker', {
      // locale: Vietnamese,
      dateFormat: 'd/m/Y',
      minDate: '12/12/1940',
      maxDate: '12/12/2015',
      defaultDate: '12/12/2000',
    });
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
   * onImageUploadClick
   */
  onImageUploadClick() {
    this.subscription.push(
      this.common.uploadImageCore(this.inputImage).subscribe((data) => {
        if (data) {
          this.input.thumbnail = data['files'][0];
        }
      })
    );
  }

  /**
   * onImageDeleteClick
   */
  onImageDeleteClick() {
    const isDelete = confirm('Bạn có muốn xóa hình? ');
    if (isDelete) this.input.thumbnail = '';
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

      const auth = this.authService.getAuthFromLocalStorage();
      this.input.teacher = auth?.user._id;

      if (this.input.thumbnail) {
        this.common
          .comfirmImages([this.input.thumbnail])
          .subscribe((dataImage) => {
            this.input.thumbnail = dataImage[0][2];

            const [day, month, year] = this.input.startTime.split('/');
            this.input.startTime = new Date(year, +month - 1, day).getTime();

            this.subscription.push(
              this.api.add(this.input).subscribe(() => {
                // hide loading
                this.isLoading$.next(false);
                this.cdr.detectChanges();

                this.common.showSuccess('Insert new success!');

                // redirect to list
                this.router.navigate(['/features/classrooms']);
              })
            );
          });
      } else {
        this.subscription.push(
          this.api.add(this.input).subscribe(() => {
            // hide loading
            this.isLoading$.next(false);
            this.cdr.detectChanges();

            this.common.showSuccess('Insert new success!');

            // redirect to list
            this.router.navigate(['/features/classrooms']);
          })
        );
      }
    }
  }
}
