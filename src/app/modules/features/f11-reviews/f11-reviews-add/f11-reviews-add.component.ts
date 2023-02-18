import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
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
  selector: 'app-f11-reviews-add',
  templateUrl: './f11-reviews-add.component.html',
  styleUrls: ['./f11-reviews-add.component.scss'],
})
export class F11ReviewsAddComponent implements OnInit, AfterViewInit, OnDestroy {
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
    { value: 'untrue', viewValue: 'Sai sự thật' },
  ];

  // myControl, filteredOptions Search Content
  myControl = new FormControl();
  filteredOptions: Observable<any>;

  /**
   * constructor
   * @param api
   * @param common
   * @param router
   * @param cdr
   * @param formBuilder
   * @param userService
   * @param questionService
   */
  constructor(
    private api: ReviewsService,
    private common: CommonService,
    private router: Router,
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
      idQuestion: [
        null, 
        [
        Validators.required
        ]
      ],
      idAuthor: [
        null, 
        [
        Validators.required
        ]
      ],
      idAnswerer: [
        null, 
        [
        Validators.required
        ]
      ],
      reputation: [
        null,
        [
          Validators.required, 
          Validators.min(1), 
          Validators.max(10)
        ],
      ],
      isSatisfied: [
        null, 
        [
        Validators.required
        ]
      ],
      rating: [
        null, 
        [

        ]
      ],
      content: [
        null, 
        [
        Validators.required
        ]
      ],
      isAgreePay: [
        null, 
        [
        Validators.required
        ]
      ],
      complain: [
        null, 
        [

        ]
      ],
      status: [
        null, 
        [

        ]
      ],
    });
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
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
  ngAfterViewInit(): void {
  }

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
   * onAddNewBtnClick
   */
  onAddNewBtnClick() {
    // touch all control to show error
    this.form.markAllAsTouched();

    // check form pass all validate
    if (!this.form.invalid) {
      // show loading
      this.isLoading$.next(true);

      this.subscription.push(
        this.api.add(this.input).subscribe(() => {
          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();
          this.common.showSuccess('Insert new success!');

          // redirect to list
          this.router.navigate(['/features/f11-reviews']);
        })
      );
    }
  }
}
