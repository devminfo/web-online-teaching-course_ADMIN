import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
@Component({
  selector: 'app-f5-service-orders-search',
  templateUrl: './f5-service-orders-search.component.html',
  styleUrls: ['./f5-service-orders-search.component.scss']
})
export class F5ServiceOrdersSearchComponent implements OnInit {
  // output
  @Output() searchChange = new EventEmitter<string>();

  // binding
  specializeSelect: string = '0';
  keyword: string = '';
  lastKeyword: string = '';
  searching: boolean = false;

  /**
   * constructor
   */
  
  constructor(private cdr: ChangeDetectorRef) {}

  /**
   *
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
   * clearSearch
   */
   clearSearch() {
    this.keyword = '';
    this.lastKeyword = '';
    // call api search
    this.searchChange.emit(this.keyword);
  } 
}
