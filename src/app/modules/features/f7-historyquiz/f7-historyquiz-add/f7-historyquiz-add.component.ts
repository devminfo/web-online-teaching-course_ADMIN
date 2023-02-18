import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HistoryQuizService } from 'src/app/core/services/features/f7-historyquiz.service';
import { CertificateService } from 'src/app/core/services/features/f5-certificate.service';
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
  selector: 'app-f7-historyquiz-add',
  templateUrl: './f7-historyquiz-add.component.html',
  styleUrls: ['./f7-historyquiz-add.component.scss'],
})
export class F7HistoryQuizAddComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  // binding data
  input: any = {
    idUser: '',
    idCertificate: '',
    point: '',
    totalPoint: '',
    percent: '',
    numberTest: 0,
  };

  //form
  form: FormGroup;

  amGet: boolean = false;
  amPost: boolean = false;
  amPut: boolean = false;
  amDelete: boolean = false;

  // data reference binding
  idUserDatas: any[] = [];
  idCertificateDatas: any[] = [];

  // myControl, filteredOptions Search fullName
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
   * @param certificateService
   */
  constructor(
    private api: HistoryQuizService,
    private common: CommonService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private certificateService: CertificateService
  ) {
    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );

    // add validate for controls
    this.form = this.formBuilder.group({
      idUser: [
        null, 
        [
          Validators.required
        ]
      ],
      idCertificate: [
        null, 
        [

        ]
      ],
      point: [
        null, 
        [
          Validators.required
        ]
      ],
      totalPoint: [
        null, 
        [
          Validators.required
        ]
      ],
      percent: [
        null, 
        [
          Validators.required
        ]
      ],
      numberTest: [
        null, 
        [
          Validators.required
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

    // get list certificate
    this.getListCertificate();
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
   * filter user
   * @param val
   */
  filter(val: string): Observable<any> {
    return this.userService.get().pipe(
      map((idUserDatas) =>
        idUserDatas.filter((option: { fullName: string }) => {
          return option.fullName.toLowerCase().indexOf(val.toLowerCase()) === 0;
        })
      )
    );
  }

  /**
   * get list User
   */
  getListUser() {
    this.subscription.push(
      this.userService.get().subscribe((data) => {
        this.idUserDatas = data;

        // filter user
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          switchMap((val) => {
            return this.filter(val || '');
          })
        );
      })
    );
  }

  /**
   * get list certificate
   */
  getListCertificate() {
    this.subscription.push(
      this.certificateService.get().subscribe((data) => {
        this.idCertificateDatas = data;
      })
    );
  }

  /**
   * get content display User Search by id
   * @param _id
   */
  getDisplayUserSearchById(_id: any) {
    if (!_id) return '';

    let index = this.idUserDatas.findIndex((user) => user._id === _id);
    return this.idUserDatas[index].fullName;
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
        this.api.add(this.input).subscribe((data) => {
          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();
          this.common.showSuccess('Insert new success!');

          // redirect to list
          this.router.navigate(['/features/historyquizzes']);
        })
      );
    }
  }
}
