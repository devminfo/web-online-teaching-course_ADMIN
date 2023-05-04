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
  selector: 'app-lecture-add',
  templateUrl: './lecture-add.component.html',
  styleUrls: ['./lecture-add.component.scss'],
})
export class LectureAddComponent implements OnInit, AfterViewInit, OnDestroy {
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

  idChapter: any;
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
    private chapterService: ChapterService,
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
    this.idChapter = this.route.snapshot.paramMap.get('id');
    // load data by param
    if (this.idChapter) {
      this.onLoadChapterById(this.idChapter);
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
   * onLoadChapterById
   * @param id
   */
  onLoadChapterById(id: String) {
    // show loading
    this.isLoading$.next(true);

    const populate = `populate=idCourse,lectures`;
    this.subscription.push(
      this.chapterService.find(id, populate).subscribe((data) => {
        this.chapter = {
          _id: data._id,
          idCourse: data.idCourse,
          lectures: data.lectures,
          title: data.title,
          position: data.position,
          updatedAt: data.updatedAt,
        };

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
   * onAddNewBtnClick
   */
  onAddNewBtnClick() {
    // touch all control to show error
    this.form.markAllAsTouched();

    // check form pass all validate
    if (this.form.invalid) return;

    this.input.lesson = this.input.position;
    const item = {
      ...this.input,
      idChapter: this.chapter._id,
    };

    // show loading
    this.isLoading$.next(true);

    if (this.input.url) {
      this.common.comfirmImages([this.input.url]).subscribe((urls) => {
        item.url = urls[0][0];
        this.subscription.push(
          this.api.add(item).subscribe(() => {
            // hide loading
            this.isLoading$.next(false);
            this.cdr.detectChanges();

            this.common.showSuccess('Insert new success!');

            // redirect to list
            this.router.navigate([
              `/features/lectures/chapter/${this.chapter._id}`,
            ]);
          })
        );
      });
    } else {
      this.subscription.push(
        this.api.add(item).subscribe(() => {
          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();

          this.common.showSuccess('Insert new success!');

          // redirect to list
          this.router.navigate([
            `/features/lectures/chapter/${this.chapter._id}`,
          ]);
        })
      );
    }
  }
}
