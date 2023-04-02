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
import { CourseService } from 'src/app/core/services/features/f2-course.service';

@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.component.html',
  styleUrls: ['./course-add.component.scss'],
})
export class CourseAddComponent implements OnInit, AfterViewInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  // binding uploads image or file
  @ViewChild('inputThumbnail', { static: false })
  inputThumbnail: ElementRef;

  // binding data
  input: any = {
    instructor: '',
    desc: '',
    isPrivate: false,
    price: 0,
    promotionPrice: 0,
    requirements: '',
    tags: '',
    target: '',
    targetDetails: '',
    thumbnail: '',
    title: '',
  };

  courses: any[];

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
    private api: CourseService,
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
      desc: [null, [Validators.required]],
      isPrivate: null,
      price: null,
      promotionPrice: null,
      requirements: null,
      tags: null,
      target: [null, [Validators.required]],
      targetDetails: null,
      thumbnail: [null, [Validators.required]],
      title: [null, [Validators.required]],
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
   * onThumbnailUploadClick
   */
  onThumbnailUploadClick() {
    this.subscription.push(
      this.common.uploadImageCore(this.inputThumbnail).subscribe((data) => {
        if (data) {
          this.input.thumbnail = data['files'][0];
        }
      })
    );
  }

  /**
   * onThumbnailDeleteClick
   */
  onThumbnailDeleteClick() {
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
    if (this.form.invalid) return;

    // show loading
    this.isLoading$.next(true);

    this.input.instructor = '642793fa6340df24f6806213';
    if (this.input.price > 0) this.input.isPrivate = true;

    console.log({ input: this.input });
    console.log({ input: this.form.invalid });
    this.subscription.push(
      this.api.add(this.input).subscribe(() => {
        // hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();

        this.common.showSuccess('Insert new success!');

        // redirect to list
        this.router.navigate(['/features/courses']);
      })
    );
  }
}