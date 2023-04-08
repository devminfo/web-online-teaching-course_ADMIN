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
import { LectureService } from 'src/app/core/services/features/f4-lecture.service';
import { ChapterService } from 'src/app/core/services/features/f3-chapter.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-lecture-update',
  templateUrl: './lecture-update.component.html',
  styleUrls: ['./lecture-update.component.scss'],
})
export class LectureUpdateComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  // binding uploads image or file
  @ViewChild('inputVideo', { static: false })
  inputVideo: ElementRef;

  // binding data
  input: any = {
    type: 'VIDEO',
    title: '',
    url: '',
    position: 0,
    lesson: 0,
    totalTimes: 0,
  };
  urlOld: string;

  id: any;
  chapter: any = {};

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
    private api: LectureService,
    private common: CommonService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _location: Location
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );
    // add validate for controls
    this.form = this.formBuilder.group({
      title: [null, [Validators.required]],
      url: [null, [Validators.required]],
      position: [null, [Validators.required]],
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
      this.onLoadLectureById(this.id);
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

  onGoBack() {
    this._location.back();
  }

  /**
   * onLoadLectureById
   * @param id
   */
  onLoadLectureById(id: String) {
    // show loading
    this.isLoading$.next(true);

    const populate = `populate=idChapter.idCourse`;
    this.subscription.push(
      this.api.find(id, populate).subscribe((data) => {
        this.input = {
          type: data.type,
          title: data.title,
          url: data.url,
          position: data.position,
          lesson: data.lesson,
          totalTimes: data.totalTimes,
        };
        this.urlOld = data.url;
        this.chapter = data.idChapter;

        // hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();
      })
    );
  }

  /**
   * onVideoUploadClick
   */
  onVideoUploadClick() {
    this.subscription.push(
      this.common.uploadVideoCore(this.inputVideo).subscribe((data) => {
        if (data) {
          this.input.url = data['files'][0];
        }
      })
    );
  }

  /**
   * onVideoDeleteClick
   */
  onVideoDeleteClick() {
    const isDelete = confirm('Bạn có muốn xóa video? ');
    if (isDelete) this.input.url = '';
  }

  /**
   * onUpdateBtnClick
   */
  onUpdateBtnClick() {
    // touch all control to show error
    if (this.input.price > 0) this.input.isPrivate = true;
    this.form.markAllAsTouched();

    // check form pass all validate
    if (this.form.invalid) return;

    // show loading
    this.isLoading$.next(true);

    // confirm use course
    if (this.input.url !== this.urlOld && this.input.url) {
      this.common.comfirmImages([this.input.url]).subscribe((urls) => {
        this.input.url = urls[0][0];
        this.subscription.push(
          this.api.update(this.id, this.input).subscribe(() => {
            // hide loading
            this.isLoading$.next(false);
            this.cdr.detectChanges();

            this.common.showSuccess('Update Success!');

            // redirect to list
            this.router.navigate([
              `/features/lectures/chapter/${this.chapter._id}`,
            ]);
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
          this.router.navigate([
            `/features/lectures/chapter/${this.chapter._id}`,
          ]);
        })
      );
    }
  }
}
