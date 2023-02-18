import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CronJobService } from 'src/app/core/services/common/c8-cron-job.service';
import { UserService } from 'src/app/core/services/features/user.service';
@Component({
  selector: 'c8-cron-job-filter',
  templateUrl: './c8-cron-job-filter.component.html',
})
export class C8CronJobFilterComponent implements OnInit {
  // subscription
  subscription: Subscription[] = []; // define host binding
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true'; // input data source for select
  @Input() cronjobs: any[] = [];
  @Output() applyBtnClick = new EventEmitter<{
    status: string,
    idEntity: string
  }>();

  // data reference
  cronJobDatas: any[] = [];
  userDatas: any[] = [];

  statusSelect: string = '0';

  cronJobSelect: string = '0';

  // statusDatas
  statusDatas: any[] = [
    { value: 'WAITING', name: 'WAITING' },
    { value: 'FINISH', name: 'FINISH' },
    { value: 'DELETED', name: 'DELETED' },
  ];

  /**
   * constructor
   * @param cronJobService 
   * @param userService 
   */
  constructor(
    private cronJobService: CronJobService,
    private userService: UserService
  ) { }

  /**
   *ngOnInit
   */
  ngOnInit(): void {
    // get list cron job
    this.getListCronJob();

    // get list user
    this.getListUser();
  }

  /**
   * getListUser
   */
  getListCronJob() {
    this.subscription.push(
      this.cronJobService.get().subscribe((data) => {
        this.cronJobDatas = [...new Set(<string[]>data.map((cronjob: any) => cronjob.idEntity))];
      })
    );
  }

  /**
   * getListUser
   */
  getListUser() {
    this.subscription.push(
      this.userService.get().subscribe((data) => {
        this.userDatas = data;
      })
    );
  }

  /**
  * getUserById
  * @param id
  */
  getUserById(id: string) {
    const result = this.userDatas.filter((item) => item._id == id);

    // check exists
    if (result.length > 0) {
      return result[0].fullName;
    }
    return '';
  }

  /**
   * onApplyBtnClick
   */
  onApplyBtnClick() {
    this.applyBtnClick.emit({
      status: this.statusSelect,
      idEntity: this.cronJobSelect
    });
  }
}
