import flatpickr from 'flatpickr';
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
import { ConversationService } from 'src/app/core/services/features/f9-conversation.service';

@Component({
  selector: 'app-conversation-update',
  templateUrl: './conversation-update.component.html',
  styleUrls: ['./conversation-update.component.scss'],
})
export class ConversationUpdateComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  // binding uploads avatar or file
  @ViewChild('inputImage', { static: false })
  inputImage: ElementRef;

  // binding data
  input: any = {
    chatName: '',
    avatar: '',
  };

  avatarOld: string;

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
    private api: ConversationService,
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
      chatName: [null, [Validators.required]],
      avatar: [null, [Validators.required]],
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
          chatName: data.chatName,
          avatar: data.avatar,
        };
        this.avatarOld = data.avatar;

        // hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();
      })
    );
  }

  /**
   * onImageUploadClick
   */
  onImageUploadClick() {
    this.subscription.push(
      this.common.uploadImageCore(this.inputImage).subscribe((data) => {
        if (data) {
          this.input.avatar = data['files'][0];
        }
      })
    );
  }

  /**
   * onImageDeleteClick
   */
  onImageDeleteClick() {
    const isDelete = confirm('Bạn có muốn xóa hình? ');
    if (isDelete) this.input.avatar = '';
  }

  /**
   * onUpdateBtnClick
   */
  onUpdateBtnClick() {
    // touch all control to show error
    this.form.markAllAsTouched();

    // check form pass all validate
    if (this.form.invalid) return;

    // show loading
    this.isLoading$.next(true);

    // confirm use conversations
    if (this.input.avatar !== this.avatarOld && this.input.avatar) {
      this.common.comfirmImages([this.input.avatar]).subscribe((dataImage) => {
        this.input.avatar = dataImage[0][2];
        this.subscription.push(
          this.api.update(this.id, this.input).subscribe(() => {
            // hide loading
            this.isLoading$.next(false);
            this.cdr.detectChanges();

            this.common.showSuccess('Update Success!');

            // redirect to list
            this.router.navigate(['/features/conversations']);
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
          this.router.navigate(['/features/conversations']);
        })
      );
    }
  }
}
