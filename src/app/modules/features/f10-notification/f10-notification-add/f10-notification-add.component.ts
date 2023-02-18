import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/core/services/features/f10-notification.service';
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
  selector: 'app-f10-notification-add',
  templateUrl: './f10-notification-add.component.html',
  styleUrls: ['./f10-notification-add.component.scss'],
})
export class F10NotificationAddComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  // binding data
  input: any = {
    sendingRange: 'all',
    idUsers: '',
    typeNotification: '',
    title: '',
    idEntity: '',
    summary: '',
    content: '',
    reads: '',
    thumbnail: '',
  };

  // form
  form: FormGroup;

  amGet: boolean = false;
  amPost: boolean = false;
  amPut: boolean = false;
  amDelete: boolean = false;

  // data reference binding
  userDatas: any[] = [];
  idEntityDatas: any[] = [];

  // sending range
  sendingRangeDatas: any[] = [
    { value: 'all', viewValue: 'Tất cả' },
  ];

  // typeNotifications
  typeNotificationDatas: any[] = [
    { value: 'question ask', viewValue: 'Question' },
    { value: 'transaction', viewValue: 'Transaction' },
    { value: 'question answer', viewValue: 'User Answer' },
    { value: 'customer answer', viewValue: 'Customer Answer' },
    { value: 'sharing video', viewValue: 'Sharing Video' },
    { value: 'option', viewValue: 'Quan điểm' },
    { value: 'servey', viewValue: 'Khảo Sát' },
    { value: 'dating', viewValue: 'Hẹn hò' },
  ];

  // binding uploads image or file
  @ViewChild('inputImageThumbnail', { static: false })
  inputImageThumbnail: ElementRef;

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
    private api: NotificationService,
    public common: CommonService,
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
      sendingRange: [null, [Validators.required]],
      typeNotification: [null, [Validators.required]],
      title: [null, []],
      idEntity: [null, [Validators.required]],
      thumbnail: [null, []],
      summary: [null, []],
      content: [null, []],
      reads: [null, []],
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
        this.idEntityDatas = data;
      })
    );
  }

  /**
   * on Thumbnail Upload image Click
   */
  onThumbnaiUploadImageClick() {
    this.subscription.push(
      this.common
        .uploadImageCore(this.inputImageThumbnail)
        .subscribe((data) => {
          if (data) {
            this.input.thumbnail = data['files'][0];
          }
        })
    );
  }

  /**
   * On thumbnail delete click
   */
  onThumbnailDeleteClick() {
      this.input.thumbnail = '';
  }

  /**
   * onAddNewBtnClick
   */
  onAddNewBtnClick() {
    // touch all control to show error
    this.form.markAllAsTouched();

    this.input.idUsers = this.userDatas.map((item: any)=> item._id);
    this.input.reads = this.input.idUsers;

    // check form pass all validate
    if (!this.form.invalid) {
      // show loading
      this.isLoading$.next(true);

      // Create list image uploads
      let images = [];
      images.push(this.input.thumbnail);

      // check thumbnail > 0
      if (this.input.thumbnail.length > 0) {
        this.common.comfirmImages(images).subscribe((data) => {
          // Set public image
          this.input.thumbnail = data[0][4];
          this.subscription.push(
            this.api.add(this.input).subscribe(() => {
              // hide loading
              this.isLoading$.next(false);
              this.cdr.detectChanges();

              this.common.showSuccess('Insert new success!');

              // redirect to list
              this.router.navigate(['/features/notifications']);
            })
          );
        });
      } else {
        this.subscription.push(
          this.api.add(this.input).subscribe(() => {
            // hide loading
            this.isLoading$.next(false);
            this.cdr.detectChanges();

            this.common.showSuccess('Insert new success!');

            // redirect to list
            this.router.navigate(['/features/notifications']);
          })
        );
      }
    }
  }
}
