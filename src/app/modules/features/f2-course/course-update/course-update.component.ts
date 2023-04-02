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
import { CourseService } from 'src/app/core/services/features/f2-course.service';

@Component({
  selector: 'app-course-update',
  templateUrl: './course-update.component.html',
  styleUrls: ['./course-update.component.scss'],
})
export class CourseUpdateComponent implements OnInit, AfterViewInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  // binding uploads thumbnail or file
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

  courseDetail: any = {
    classesJoined: [],
    createdAt: '',
    isPrivate: false,
    totalChapter: 0,
    totalDislikes: 0,
    totalLectures: 0,
    totalLikes: 0,
    totalTime: 0,
    totalViews: 0,
    updatedAt: '',
    usersJoined: [],
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
    private api: CourseService,
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
      desc: [null, [Validators.required]],
      isPrivate: [null, []],
      price: [null, []],
      promotionPrice: [null, []],
      requirements: [null, []],
      tags: [null, []],
      target: [null, [Validators.required]],
      targetDetails: [null, []],
      thumbnail: [null, []],
      title: [null, [Validators.required]],
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
          instructor: data.instructor,
          desc: data.desc,
          price: data.price,
          promotionPrice: data.promotionPrice,
          requirements: data.requirements,
          tags: data.tags,
          target: data.target,
          targetDetails: data.targetDetails,
          thumbnail: data.thumbnail,
          title: data.title,
        };

        this.courseDetail = {
          classesJoined: data.classesJoined,
          createdAt: data.createdAt,
          isPrivate: data.isPrivate,
          totalChapter: data.totalChapter,
          totalDislikes: data.totalDislikes,
          totalLectures: data.totalLectures,
          totalLikes: data.totalLikes,
          totalTime: data.totalTime,
          totalViews: data.totalViews,
          updatedAt: data.updatedAt,
          usersJoined: data.usersJoined,
        };

        this.thumbnailOld = data.thumbnail;

        // hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();
      })
    );
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
   * onUpdateBtnClick
   */
  onUpdateBtnClick() {
    // touch all control to show error
    if (this.input.price > 0) this.input.isPrivate = true;
    this.form.markAllAsTouched();
    console.log({ form: this.form });
    // check form pass all validate
    if (this.form.invalid) return;

    // show loading
    this.isLoading$.next(true);

    // confirm use course
    if (this.input.thumbnail !== this.thumbnailOld && this.input.thumbnail) {
      this.common
        .comfirmImages([this.input.thumbnail])
        .subscribe((dataImage) => {
          this.input.thumbnail = dataImage[0][2];
          this.subscription.push(
            this.api.update(this.id, this.input).subscribe(() => {
              // hide loading
              this.isLoading$.next(false);
              this.cdr.detectChanges();

              this.common.showSuccess('Update Success!');

              // redirect to list
              this.router.navigate(['/features/courses']);
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
          this.router.navigate(['/features/courses']);
        })
      );
    }
  }
}
