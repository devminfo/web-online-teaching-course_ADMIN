import flatpickr from 'flatpickr';
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
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClassRoomService } from 'src/app/core/services/features/f13-class-room.service';

@Component({
  selector: 'app-class-room-update',
  templateUrl: './class-room-update.component.html',
  styleUrls: ['./class-room-update.component.scss'],
})
export class ClassRoomUpdateComponent
  implements OnInit, AfterViewInit, OnDestroy
{
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
  };

  thumbnailOld: string;

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
    private api: ClassRoomService,
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
    // get id from url
    this.id = this.route.snapshot.paramMap.get('id');

    // load data by param
    if (this.id) {
      this.onLoadDataById(this.id);
    }

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
          teacher: data.teacher,
          name: data.name,
          thumbnail: data.thumbnail,
          desc: data.desc,
          startTime: new Date(data.startTime).toLocaleDateString('vi-VN'),
        };
        this.thumbnailOld = data.thumbnail;

        // hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();
      })
    );
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
   * onUpdateBtnClick
   */
  onUpdateBtnClick() {
    // touch all control to show error
    this.form.markAllAsTouched();

    // check form pass all validate
    if (this.form.invalid) return;

    // show loading
    this.isLoading$.next(true);

    const [day, month, year] = this.input.startTime.split('/');
    this.input.startTime = new Date(year, +month - 1, day).getTime();

    // confirm use classRoom
    if (this.input.thumbnail !== this.thumbnailOld && this.input.thumbnail) {
      this.common
        .comfirmImages([this.input.thumbnail])
        .subscribe((dataImage) => {
          console.log({ dataImage });
          this.input.thumbnail = dataImage[0][2];
          this.subscription.push(
            this.api.update(this.id, this.input).subscribe(() => {
              // hide loading
              this.isLoading$.next(false);
              this.cdr.detectChanges();

              this.common.showSuccess('Update Success!');

              // redirect to list
              this.router.navigate(['/features/classrooms']);
            })
          );
        });
    } else {
      this.subscription.push(
        this.api.update(this.id, this.input).subscribe(() => {
          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();

          this.common.showSuccess('Update Success!');

          // redirect to list
          this.router.navigate(['/features/classrooms']);
        })
      );
    }
  }
}
