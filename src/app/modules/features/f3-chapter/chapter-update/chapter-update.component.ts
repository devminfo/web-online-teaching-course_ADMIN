import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChapterService } from 'src/app/core/services/features/f3-chapter.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-chapter-update',
  templateUrl: './chapter-update.component.html',
  styleUrls: ['./chapter-update.component.scss'],
})
export class ChapterUpdateComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  // binding data
  input: any = {
    title: '',
    position: 0,
  };

  id: any;
  chapter: {
    _id: string;
    idCourse: any;
    lectures: any[];
    title: string;
    position: number;
    updatedAt: string;
  } = {
    _id: '',
    idCourse: {},
    lectures: [],
    title: '',
    position: 0,
    updatedAt: '',
  };

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

  onGoBack() {
    this._location.back();
  }

  /**
   * onLoadDataById
   * @param id
   */
  onLoadDataById(id: String) {
    // show loading
    this.isLoading$.next(true);

    const populate = `populate=idCourse,lectures`;
    this.subscription.push(
      this.api.find(id, populate).subscribe((data) => {
        // load data to view input
        this.input = {
          title: data.title,
          position: data.position,
        };

        this.chapter = {
          _id: data._id,
          idCourse: data.idCourse,
          lectures: data.lectures,
          title: data.title,
          position: data.position,
          updatedAt: data.updatedAt,
        };

        console.log(this.chapter);

        // hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();
      })
    );
  }

  updateDeleteId() {}

  /**
   * onAddNewBtnClick
   */
  onUpdateBtnClick() {
    // touch all control to show error
    this.form.markAllAsTouched();

    // check form pass all validate
    if (this.form.invalid) return;

    // show loading
    this.isLoading$.next(true);

    this.subscription.push(
      this.api.update(this.id, this.input).subscribe(() => {
        // hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();

        this.common.showSuccess('Update Success!');

        // redirect to list
        this.router.navigate([
          `/features/chapters/course/${this.chapter.idCourse?._id}`,
        ]);
      })
    );
  }
}
