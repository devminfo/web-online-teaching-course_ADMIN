import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-f15-store-module-search',
  templateUrl: './f15-store-module-search.component.html',
  styleUrls: ['./f15-store-module-search.component.scss'],
})
export class F15StoreModuleSearchComponent implements OnInit {
  // output
  @Output() searchChange = new EventEmitter<string>();

  keyword: string = '';
  lastKeyword: string = '';
  searching: boolean = false;

  /**
   * Constructor
   * @param cdr 
   */
  constructor(private cdr: ChangeDetectorRef) {}

  /**
   * ng On Init
   */
  ngOnInit(): void {}

  /**
   * search
   * @param keyword
   */
  search(keyword: string) {
    this.keyword = keyword;
    this.searching = true;

    setTimeout(() => {
      this.searching = false;
      this.cdr.detectChanges();

      // call api one second one time
      if (this.lastKeyword != this.keyword) {
        this.lastKeyword = this.keyword;

        // call api search
        this.searchChange.emit(this.keyword);
      }
    }, 1000);
  }

  /**
   * clear Search
   */
  clearSearch() {
    this.keyword = '';
    this.lastKeyword = '';

    // call api search
    this.searchChange.emit(this.keyword);
  }
}
