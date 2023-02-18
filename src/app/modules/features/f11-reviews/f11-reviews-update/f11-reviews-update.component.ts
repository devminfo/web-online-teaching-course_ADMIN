import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewsService } from 'src/app/core/services/features/f11-reviews.service';
import { QuestionService } from 'src/app/core/services/features/f8-question.service';
import { UserService } from 'src/app/core/services/features/user.service';
import { CommonService } from 'src/app/core/services/common.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-f11-reviews-update',
  templateUrl: './f11-reviews-update.component.html',
  styleUrls: ['./f11-reviews-update.component.scss'],
})
export class F11ReviewsUpdateComponent
  implements OnInit, AfterViewInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  // binding data
  input: any = {
    idQuestion: '',
    idAuthor: '',
    idAnswerer: '',
    reputation: '',
    isSatisfied: '',
    rating: '',
    content: '',
    isAgreePay: '',
    complain: '',
    status: '',
  };

  //form
  form: FormGroup;

  id: any;

  amGet: boolean = false;
  amPost: boolean = false;
  amPut: boolean = false;
  amDelete: boolean = false;

  // data reference binding
  userDatas: any[] = [];
  idQuestionDatas: any[] = [];

  // statusReviews
  statusReviews: any[] = [
    { value: 'checking', viewValue: 'Đang xem xét' },
    { value: 'true', viewValue: 'Đúng sự thật' },
    { value: 'false', viewValue: 'Sai sự thật' },
  ];

  // myControl, filteredOptions Search Content
  myControl = new FormControl();
  filteredOptions: Observable<any>;

  /**
   * constructor
   * @param api
   * @param common
   * @param router
   * @param route
   * @param cdr
   * @param formBuilder
   * @param userService
   * @param questionService
   */
  constructor(
    private api: ReviewsService,
    private common: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private questionService: QuestionService
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );

    // add validate for controls
    this.form = this.formBuilder.group({
      idQuestion: [null, [Validators.required]],
      idAuthor: [null, [Validators.required]],
      idAnswerer: [null, [Validators.required]],
      reputation: [
        null,
        [Validators.required, Validators.min(1), Validators.max(10)],
      ],
      isSatisfied: [null, []],
      rating: [null, []],
      content: [null, [Validators.required]],
      isAgreePay: [null, []],
      complain: [null, []],
      status: [null, []],
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

    // load data reference
    this.loadDataReference();
  }

  /**
   * load Data reference
   */
  loadDataReference() {
    // get list user
    this.getListUser();

    // get list question
    this.getListQuestion();
  }

  /**
   * ng After View Init
   */
  ngAfterViewInit(): void { }

  /**
   * ngOnDestroy
   */
  ngOnDestroy() {
    this.subscription.forEach((item) => {
      item.unsubscribe();
    });
  }

  /**
   * get list User
   */
  getListUser() {
    this.subscription.push(
      this.userService.get().subscribe((data) => {
        this.userDatas = data;
      })
    );
  }

  /**
   * get list Question
   */
  getListQuestion() {
    this.subscription.push(
      this.questionService.get().subscribe((data) => {
        this.idQuestionDatas = data;
      })
    );
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
          idQuestion: data.idQuestion,
          idAuthor: data.idAuthor,
          idAnswerer: data.idAnswerer,
          reputation: data.reputation,
          isSatisfied: data.isSatisfied,
          rating: data.rating,
          content: data.content,
          isAgreePay: data.isAgreePay,
          complain: data.complain,
          status: data.status,
        };
        // hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();
      })
    );
  }

  /**
   * onUpdateBtnClick
   */
  onUpdateBtnClick() {
    // touch all control to show error
    this.form.markAllAsTouched();

    // check form pass all validate
    if (!this.form.invalid) {
      if (this.input.status != this.input.status) {
        // show loading
        this.isLoading$.next(true);

        this.subscription.push(
          this.api.update(this.id, this.input).subscribe(() => {
            // hide loading
            this.isLoading$.next(false);
            this.cdr.detectChanges();

            this.common.showSuccess('Update Success!');

            // redirect to list
            this.router.navigate(['/features/reviews']);
          })
        );
      }
    }
    if ((this.input.status = 'true')) {
      this.subscription.push(
        this.api.updateStatus(this.id).subscribe(() => {
          // // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();

          this.common.showSuccess('Update Status Success!');

          // redirect to list
          this.router.navigate(['/features/reviews']);
        })
      );
    }
  }
}
