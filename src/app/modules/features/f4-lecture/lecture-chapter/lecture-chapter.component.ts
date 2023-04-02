import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { ChapterService } from 'src/app/core/services/features/f3-chapter.service';
import { CommonService } from 'src/app/core/services/common.service';
import { LectureService } from 'src/app/core/services/features/f4-lecture.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lecture-chapter',
  templateUrl: './lecture-chapter.component.html',
  styleUrls: ['./lecture-chapter.component.scss'],
})
export class LectureChapterComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];

  observable: Observable<any>;
  observer: Observer<any>;
  call: number = 0;

  // data source for grid
  dataSources: any[] = [];
  chapter: any = {};

  // delete id
  deleteId: String;

  // delete id
  idChapter: any;
  isSelectAll = false;

  /**
   * onCheckAllSelected
   */
  onCheckAllSelected() {
    this.isSelectAll = !this.isSelectAll;

    // check or uncheck all item
    for (let i = 0; i < this.dataSources.length; i++) {
      this.dataSources[i].checked = this.isSelectAll;
    }
  }

  /**
   *
   * @param id
   */
  onItemSelected(id: String) {
    // check or uncheck item with id
    for (let i = 0; i < this.dataSources.length; i++) {
      if (this.dataSources[i].id === id) {
        this.dataSources[i].checked = !this.dataSources[i].checked;
        break;
      }
    }
  }

  /**
   * getSelection
   * @returns
   */
  getSelection() {
    return this.dataSources.filter((x) => x.checked);
  }

  /**
   * ************************************ constructor ************************************
   * ************************************ constructor ************************************
   * ************************************ constructor ************************************
   * @param api
   * @param dialog
   */
  constructor(
    private commonService: CommonService,
    private chapterService: ChapterService,
    private route: ActivatedRoute,
    private api: LectureService
  ) {
    // xử lý bất đồng bộ
    this.observable = Observable.create((observer: any) => {
      this.observer = observer;
    });
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    // get id from url
    this.idChapter = this.route.snapshot.paramMap.get('id');
    // load data by param
    if (this.idChapter) {
      this.onLoadChapter(this.idChapter);
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
   * updateDeleteId
   * @param id
   */
  updateDeleteId(id: String) {
    this.deleteId = id;
  }

  /**
   * on Load Data Grid
   */
  onLoadChapter(idChapter: string) {
    const populate = `populate=idCourse,lectures`;
    this.subscription.push(
      this.chapterService.find(idChapter, populate).subscribe((data) => {
        console.log({ data });
        this.chapter = data;
        this.dataSources = data.lectures;
        console.log({ chapter: this.chapter });
      })
    );
  }

  /**
   * onDeleteBtnClick
   */
  onDeleteBtnClick() {
    this.subscription.push(
      this.api.delete(this.deleteId).subscribe(() => {
        this.commonService.showSuccess('Delete Success!');
        // load new data
        this.onLoadChapter(this.idChapter);
      })
    );
  }

  /**
   * onDeleteManyBtnClick
   */
  onDeleteManyBtnClick() {
    // get list id select
    const listIdSelect = this.getSelection()
      .map((item) => item.id)
      .join(',');

    // delete many by list id select
    this.subscription.push(
      this.api.deleteManyByIds(listIdSelect).subscribe(() => {
        this.commonService.showSuccess('Delete Success!');
        // load new data
        this.onLoadChapter(this.idChapter);
      })
    );
  }
}
