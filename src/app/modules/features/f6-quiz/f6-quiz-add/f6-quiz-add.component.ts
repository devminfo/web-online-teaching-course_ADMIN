import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  Input,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from 'src/app/core/services/features/f6-quiz.service';
import { CommonService } from 'src/app/core/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CertificateService } from 'src/app/core/services/features/f5-certificate.service';

@Component({
  selector: 'app-f6-quiz-add',
  templateUrl: './f6-quiz-add.component.html',
  styleUrls: ['./f6-quiz-add.component.scss'],
})
export class F6QuizAddComponent implements OnInit, AfterViewInit, OnDestroy {
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  idCertificate: string;
  isTabQuestion: boolean = true;
  numberAnswers: number = 1;
  certificates: any[];

  // type questions
  typeQuestions: { key: string; value: string }[] = [
    { key: 'text', value: 'TEXT' },
    { key: 'image', value: 'IMAGE' },
    { key: 'video', value: 'VIDEO' },
    { key: 'audio', value: 'AUDIO' },
  ];

  // type answers
  typeAnswers: { key: string; value: string }[] = [
    { key: 'text', value: 'TEXT' },
    { key: 'image', value: 'IMAGE' },
  ];

  // binding data
  input = {
    idCertificate: '',
    typeQuestion: 'text',
    textQuestion: '',
    videoQuestion: '',
    audioQuestion: '',
    imageQuestion: '',
  };

  // binding data
  answerInputs: {
    typeAnswer: 'text' | 'image';
    text: string;
    image: string;
    isTrue: boolean;
  }[] = [
    { typeAnswer: 'text', text: '', image: '', isTrue: true },
    { typeAnswer: 'text', text: '', image: '', isTrue: false },
    { typeAnswer: 'text', text: '', image: '', isTrue: false },
    { typeAnswer: 'text', text: '', image: '', isTrue: false },
  ];

  // binding uploads image or file
  @ViewChild('inputImageQuestion', { static: false })
  inputImageQuestion: ElementRef;

  // binding uploads image or file
  @ViewChild('inputImageAnswer', { static: false })
  inputImageAnswer: ElementRef;
  //form
  form: FormGroup;

  amGet: boolean = false;
  amPost: boolean = false;
  amPut: boolean = false;
  amDelete: boolean = false;

  /**
   * Contructor
   * @param api
   * @param certificateService
   * @param common
   * @param route
   * @param router
   * @param cdr
   * @param formBuilder
   */
  constructor(
    private api: QuizService,
    private certificateService: CertificateService,
    private common: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );

    // get all certificates
    this.getAllCertificates();

    // add validate for controls
    this.form = this.formBuilder.group({
      idCertificate: [null, [Validators.required]],
      typeQuestion: [null, [Validators.required]],
      textQuestion: [null, []],
      videoQuestion: [null, []],
      audioQuestion: [null, []],
      imageQuestion: [null, []],
    });
  }

  onChangeTab(isTabQuestion: boolean) {
    this.isTabQuestion = isTabQuestion;
  }

  /**
   * ngOnInit
   */
  ngOnInit() {}

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
   * Get all certificates
   */
  getAllCertificates() {
    this.subscription.push(
      this.certificateService.get().subscribe((data) => {
        this.certificates = data;
      })
    );
  }

  /**
   * on change image answer
   * @param index
   * @param event
   */
  /**
   * on Banner Upload image Click
   */
  onImageAnswerUploadImageClick(index: number) {
    this.subscription.push(
      this.common.uploadImageCore(this.inputImageAnswer).subscribe((data) => {
        if (data) {
          this.answerInputs[index].image = data['files'][0];
        }
      })
    );
  }

  /**
   * On change image
   */
  onImageQuestionUploadImageClick() {
    this.subscription.push(
      this.common.uploadImageCore(this.inputImageQuestion).subscribe((data) => {
        if (data) {
          this.input.imageQuestion = data['files'][0];
        }
      })
    );
  }

  /**
   * onImageQuestionUploadImageDeleteClick
   */
  onImageQuestionUploadImageDeleteClick() {
    const isDelete = confirm('Bạn có muốn xóa hình? ');
    if (isDelete) this.input.imageQuestion = '';
  }

  /**
   * On change type answer
   * @param index
   * @param event
   */
  onChangeTypeAnswer(index: number, event: any) {
    const type = event.target.value;
    const currentAnswer = this.answerInputs[index];

    currentAnswer.typeAnswer = type;

    if (type === 'text') currentAnswer.image = '';

    if (type === 'image') currentAnswer.text = '';
  }

  /**
   * On input text answer
   * @param index
   * @param event
   */
  onInputTextAnswer(index: number, event: any) {
    const textAnswer = event.target.value;

    this.answerInputs[index].text = textAnswer;
  }

  /**
   * on change is true
   * @param index
   * @param event
   */
  onChangeIsTrue(index: number, event: any) {
    const isTrue = event.target.checked;

    this.answerInputs[index].isTrue = isTrue;
  }

  /**
   * Add one more answer
   */
  addOneMoreAnswer() {
    this.answerInputs.push({
      typeAnswer: 'text',
      text: '',
      image: '',
      isTrue: false,
    });
  }

  /**
   * Remove one more answer
   */
  removeItemAnswer(index: number) {
    this.answerInputs.splice(index, 1);
  }

  /**
   * onNextAnswerTabBtnClick
   */
  onNextAnswerTabBtnClick() {
    // touch all control to show error
    this.form.markAllAsTouched();
    if (!this.form.invalid) this.isTabQuestion = false;
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

      // Create list image uploads
      let images = [];
      images.push(this.input.imageQuestion);

      if (this.input.imageQuestion)
        this.common
          .comfirmImages([this.input.imageQuestion])
          .subscribe((dataImage) => {
            this.input.imageQuestion = dataImage[0][4];
          });

      // Create item
      const data = {
        ...this.input,
        answers: this.answerInputs.filter((answerInput) => {
          // check answer input not empty
          if (answerInput.typeAnswer === 'text' && !!answerInput.text)
            return true;

          // check answer input not empty
          if (answerInput.typeAnswer === 'image' && !!answerInput.image)
            return true;

          return false;
        }),
      };

      // Save database
      this.subscription.push(
        this.api.add(data).subscribe(() => {
          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();

          this.common.showSuccess('Insert new success!');

          // redirect to list
          this.router.navigate(['/features/quizzes']);
        })
      );
    }
  }
}
