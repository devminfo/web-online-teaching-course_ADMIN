import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-f7-historyquiz-update',
  templateUrl: './f7-historyquiz-update.component.html',
  styleUrls: ['./f7-historyquiz-update.component.scss'],
})
export class F7HistoryQuizUpdateComponent
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

  id: any;

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
   * @param route
   * @param cdr
   * @param formBuilder
   * @param userService
   * @param certificateService
   */
  constructor(
    private api: HistoryQuizService,
    private common: CommonService,
    private router: Router,
    private route: ActivatedRoute,
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
   * get list User
   */
  getListUser() {
    this.subscription.push(
      this.userService.get().subscribe((data) => {
        this.idUserDatas = data;
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
          idUser: data.idUser,
          idCertificate: data.idCertificate,
          point: data.point,
          totalPoint: data.totalPoint,
          percent: data.percent,
          numberTest: data.numberTest,
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

    delete this.input.status;

    // check form pass all validate
    if (!this.form.invalid) {
      // show loading
      this.isLoading$.next(true);

      this.subscription.push(
        this.api.update(this.id, this.input).subscribe(() => {
          // hide loading
          this.isLoading$.next(false);
          this.cdr.detectChanges();

          this.common.showSuccess('Update Success!');

          // redirect to list
          this.router.navigate(['/features/historyquizzes']);
        })
      );
    }
  }
}
