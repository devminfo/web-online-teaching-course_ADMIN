import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { BehaviorSubject, Observable, Observer, Subscription } from 'rxjs';
import { CourseService } from 'src/app/core/services/features/f2-course.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChapterService } from 'src/app/core/services/features/f3-chapter.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
})
export class CourseDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  // binding data
  data: any = {};
  chapters: any = [];

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
    private chapterService: ChapterService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private commonService: CommonService
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );
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
      this.onLoadChapterByIdCourse(this.id);
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
        this.data = data;
        // hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();
      })
    );
  }

  updateDeleteId() {}

  /**
   *
   */
  onLoadChapterByIdCourse(idCourse: string) {
    this.isLoading$.next(true);

    const filter = `idCourse=${idCourse}&populate=lectures&sort=position`;
    this.subscription.push(
      this.chapterService.get(filter).subscribe((data) => {
        // load data to view input
        this.chapters = data;
        // hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();
      })
    );
  }

  /**
   * onDeleteBtnClick
   */
  onDeleteBtnClick() {
    this.subscription.push(
      this.api.delete(this.id).subscribe(() => {
        this.commonService.showSuccess('Delete Success!');

        // redirect to list
        this.router.navigate(['/features/courses']);
      })
    );
  }
}
