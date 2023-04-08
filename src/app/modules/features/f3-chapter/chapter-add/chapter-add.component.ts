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
import { ChapterService } from 'src/app/core/services/features/f3-chapter.service';
import { CourseService } from 'src/app/core/services/features/f2-course.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-chapter-add',
  templateUrl: './chapter-add.component.html',
  styleUrls: ['./chapter-add.component.scss'],
})
export class ChapterAddComponent implements OnInit, AfterViewInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  // binding data
  input: any = {
    title: '',
    position: 0,
  };

  idCourse: any;
  course: any = {};
  chapters: any[];

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
    private api: ChapterService,
    private courseService: CourseService,
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
      position: [null, [Validators.required]],
    });
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    // get id from url
    this.idCourse = this.route.snapshot.paramMap.get('id');
    // load data by param
    if (this.idCourse) {
      this.onLoadCourse(this.idCourse);
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
   * on Load Data Grid
   */
  onLoadCourse(idCourse: string) {
    this.subscription.push(
      this.courseService.find(idCourse).subscribe((data) => {
        this.course = data;
      })
    );
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

    const item = {
      ...this.input,
      idCourse: this.course._id,
      lectures: [],
    };
    this.subscription.push(
      this.api.add(item).subscribe(() => {
        // hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();

        this.common.showSuccess('Insert new success!');

        // redirect to list
        this.router.navigate([`/features/chapters/course/${this.course._id}`]);
      })
    );
  }
}
