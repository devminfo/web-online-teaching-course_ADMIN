import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConstantsService } from '../utils/constants.service';

@Injectable()
export class CommonService {
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  private url = '';
  private getAllWhatUrl = '';
  public lang: string = 'vn';
  // Define API
  public BASEURL = ConstantsService.api.frontEnd;


  avatarDefault =
    'https://p23dpfood.izisoft.io/static/upload/image/1664871777744_e1006cc0e6309f6828c52f998_1b26103ef823d9bc9.png';
  public uploadImageDefault = './assets/media/svg/files/image.svg';
  public imageDefault = './assets/media/svg/files/image-white.svg';

  /**
   * constructor
   * @param toastrService
   * @param spinner
   * @param http
   */
  constructor(
    public toastrService: ToastrService,
    public spinner: NgxSpinnerService,
    private http: HttpClient
  ) { }

  public showError(mess: string) {
    this.toastrService.error('Pinks Ways!', mess, {
      timeOut: 2000,
      progressBar: true,
    });
  }

  public showSuccess(mess: string) {
    this.toastrService.info('Pinks Ways!', mess + '!', {
      timeOut: 2000,
      progressBar: true,
    });
  }


  public showWarning(mess: string) {
    this.toastrService.warning('Pinks Ways!', mess + '!', {
      timeOut: 2000,
      progressBar: true,
    });
  }
  differenceBetweenDates(date1: Date, date2: Date) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // a and b are javascript Date objects
    function dateDiffInDays(a: Date, b: Date) {
      // Discard the time and time-zone information.
      const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
      const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
      return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }
    return dateDiffInDays(date1, date2);
  }
  /**
   * HttpClient API get() method => Fetch tinhTp
   * @param link
   * @returns
   */
  getAccessMethods(link: any): Observable<any> {
    // {{url}}/v1/
    const url =
      this.BASEURL + `/group-details/access-methods-user?link=${link}`;
    return this.http.get<any>(url).pipe(retry(1), catchError(this.handleError));
  }

  /**
   * coventDateDDMMYYYYToYYYYMMDD
   * @param date
   * @returns
   */
  public coventDateDDMMYYYYToYYYYMMDD(date: string) {
    const tempDate = date.split('-');
    return `${tempDate[2]}-${tempDate[1]}-${tempDate[0]}`;
  }

  public formatUnixTimestampToDDMMYYY(date: number) {
    const dateTemp = new Date(date);
    const day = dateTemp.getDate();
    const month = dateTemp.getMonth() + 1;
    const year = dateTemp.getFullYear();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  }

  public formatUnixTimestampToHHIISS(date: number) {
    let hours, minutes;
    const dateTemp = new Date(date);
    hours = dateTemp.getHours();
    minutes = dateTemp.getMinutes();
    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
    function padTo2Digits(num: any) {
      return num.toString().padStart(2, '0');
    }
  }

  public convertDateDDMMYYYYToYYYYMMDDHHMMSS(date: string) {
    const dateTime = new Date(date);
    let day = dateTime.getDate();
    let month = dateTime.getMonth() + 1;
    let year = dateTime.getFullYear();
    return `${year}-${month}-${day} 00:00:00`;
  }

  /**
   * formatUnixTimestamp
   * @param date
   * @returns
   */
  public formatUnixTimestampDateToDDMMYYY(date: number) {
    const dateTemp = new Date(date);

    const day = dateTemp.getDate();

    const month = dateTemp.getMonth() + 1;

    const year = dateTemp.getFullYear();

    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month
      }-${year}`;
  }

  /**
   * b??? d???u ti???ng vi???t ????? search
   */
  public cleanAccents(str: string): string {
    if (!str) return str

    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, 'a');
    str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, 'e');
    str = str.replace(/??|??|???|???|??/g, 'i');
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, 'o');
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, 'u');
    str = str.replace(/???|??|???|???|???/g, 'y');
    str = str.replace(/??/g, 'd');
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, 'A');
    str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, 'E');
    str = str.replace(/??|??|???|???|??/g, 'I');
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, 'O');
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, 'U');
    str = str.replace(/???|??|???|???|???/g, 'Y');
    str = str.replace(/??/g, 'D');
    // Combining Diacritical Marks
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // huy???n, s???c, h???i, ng??, n???ng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // m?? ?? (??), m?? ??, m?? ?? (??)

    return str;
  }

  /**
   * stripHtml
   * @param html
   * @returns
   */
  public stripHtml(html: any) {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  /**
   * format Html Tag
   * @param content
   */
  public formatHtmlTag(content: string) {
    let result: string | null;
    const dummyElem = document.createElement('DIV');
    dummyElem.innerHTML = content;
    document.body.appendChild(dummyElem);
    result = dummyElem.textContent;
    document.body.removeChild(dummyElem);
    return result;
  }

  public formatPrice(price: string) {
    return parseFloat(price.replace(/,/g, ''))
      .toFixed(0)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  public formatPriceDots(price: string) {
    let temp = price;
    if (typeof price != 'string') temp = price + '';
    return parseFloat(temp.replace(/,/g, ''))
      .toFixed(0)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  /**
   * onChangeTextSex
   * @param str
   * @returns
   */
  public onChangeTextSex(str: string): string {
    if (str != null || str != undefined) {
      if (str == '1') {
        return 'Nam';
      } else if (str == '2') {
        return 'N???';
      } else {
        return 'Kh??ng y??u c???u';
      }
    }
    return 'Kh??ng y??u c???u';
  }

  /**
   * onCheckMobile
   * @returns
   */
  public onCheckMobile() {
    if (
      /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      return true;
    }
    return false;
  }

  /**
   * numberOnly
   * @param event
   */
  numberOnlyInput(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  /**
   * HttpClient API post() method => Create any
   * @param any
   * @returns
   */
  comfirmImages(data: any): Observable<any> {
    return this.http
      .post<any>(
        this.BASEURL + '/uploads/local-tmp',
        JSON.stringify({ files: data }),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * upload image Core
   */
  public uploadImageCore(inputFileAvatar: any): Observable<any> {
    const uploadFileFinish = new Observable((observer) => {
      let files: any[] = [];
      const formData = new FormData();
      const fileUpload = inputFileAvatar.nativeElement;
      // Create file
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        files.push({ data: file, inProgress: false, progress: 0 });
      }

      // Upload file
      files.forEach((file) => {
        formData.append('files', file.data);
      });

      // Post image to server
      this.http
        .post<any>(this.BASEURL + '/uploads', formData, {})
        .subscribe((data) => {
          observer.next(data);
          // this.spinner.hide();
        });
    });

    return uploadFileFinish;
  }

  /**
 * onSearchKeyWordReturnArray
 * @param data
 * @param texts
 * @param keyword
 * @returns
 */
  public onSearchKeyWordReturnArray(
    data: any,
    texts: string[],
    keyword: string
  ) {
    let dataReturn: any = [];
    //check texts not empty
    if (texts.length > 0) {
      let tempData: any = [];
      for (let itemText of texts) {
        let arrayTemp: any[] = [];
        //check text child
        if (itemText.includes('.')) {
          const textSplit = itemText.split('.');
          if (textSplit.length > 0 && textSplit.length == 2) {
            arrayTemp = data.filter(
              (value: any) =>
                this.cleanAccents(
                  value?.[textSplit[textSplit.length - 2]]?.[
                  textSplit[textSplit.length - 1]
                  ]
                )
                  ?.toLowerCase()
                  .indexOf(this.cleanAccents(keyword?.toLowerCase())) !== -1
            );
          }

          else if (textSplit.length > 0 && textSplit.length == 3) {
            arrayTemp = data.filter(
              (value: any) =>
                this.cleanAccents(
                  value?.[textSplit[textSplit.length - 3]]?.[
                  textSplit[textSplit.length - 2]
                  ]?.[textSplit[textSplit.length - 1]]
                )
                  ?.toLowerCase()
                  .indexOf(this.cleanAccents(keyword?.toLowerCase())) !== -1
            );
          }
        } else {
          arrayTemp = data.filter(
            (value: any) =>
              this.cleanAccents(value?.[itemText])
                ?.toLowerCase()
                .indexOf(this.cleanAccents(keyword?.toLowerCase())) !== -1
          );
        }

        //check not empty and concat data
        if (arrayTemp.length > 0) tempData = tempData.concat(arrayTemp);
      }

      //set and remove value duplicate
      if (tempData.length > 0) {
        dataReturn = Array.from(new Set(tempData));
      }
    }

    return dataReturn;
  }

  /**
   * ChangeToSlug
   */
  public changeToSlug(slug: string): string {
    //?????i k?? t??? c?? d???u th??nh kh??ng d???u
    slug = slug.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/gi, 'a');
    slug = slug.replace(/??|??|???|???|???|??|???|???|???|???|???/gi, 'e');
    slug = slug.replace(/i|??|??|???|??|???/gi, 'i');
    slug = slug.replace(/??|??|???|??|???|??|???|???|???|???|???|??|???|???|???|???|???/gi, 'o');
    slug = slug.replace(/??|??|???|??|???|??|???|???|???|???|???/gi, 'u');
    slug = slug.replace(/??|???|???|???|???/gi, 'y');
    slug = slug.replace(/??/gi, 'd');

    slug = slug.toLowerCase();

    //X??a c??c k?? t??? ?????t bi???t
    slug = slug.replace(
      /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
      ''
    );

    //?????i kho???ng tr???ng th??nh k?? t??? g???ch ngang
    slug = slug.replace(/ /gi, '-');

    //?????i nhi???u k?? t??? g???ch ngang li??n ti???p th??nh 1 k?? t??? g???ch ngang
    //Ph??ng tr?????ng h???p ng?????i nh???p v??o qu?? nhi???u k?? t??? tr???ng
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');

    //X??a c??c k?? t??? g???ch ngang ??? ?????u v?? cu???i
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');

    return slug;
  }

  /**
   * check file c?? extension h???p l??? kh??ng
   * @description d??ng ????? check valid h???p h???
   * @ext_defaults (".doc"|".docx"|".xls"|".xlsx"|".pdf"|".jpg"|".png"|".svg"|".jpeg")
   * @param filepath m???t file path bao g??m filename + file ext. Vd: filename.png
   * @param requireOther tham s??? n??y s??? cho ph??p m??? r???ng c??c file ext kh??c ngo??i c??c exts m???c ?????nh (c?? th??? tr??ng)
   * @param isClear tham s??? n??y s??? cho ph??p b??? qua c??c ext default ch??? x??t requireOther
   */
  isFileValid(filepath: string, requireOther: string[] = [], isClear = false) {
    const defaults = [
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
      '.pdf',
      '.jpg',
      '.png',
      '.svg',
      '.jpeg',
      '',
    ];

    // l???y theo y??u c???u
    const valids = requireOther;

    // n???u tr?????ng h???p clear b??? false th?? n???p c??c ??u??i extension m???c ?????nh v??o valids
    // ch??? l???y duy nh???t c??c gi?? tr??? kh??ng t???n t???i gi?? tr??? tr??ng l???p nhau
    if (isClear == false) valids.push(...defaults);

    // check c??c ??u??i valid v???i url hi???n t???i
    // t??m s??? t???n t???i extension valid
    for (const i of valids) {
      const dk1 =
        filepath != undefined && filepath != null && filepath.length > 0;
      const dk2 = dk1 && filepath.slice(filepath.length - i.length) === i;
      if (dk2) return true;
    }
    return false;
  }

  fileTypes: string[] = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint',
    'application/vnd.ms-excel',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
    'application/vnd.ms-word.document.macroEnabled.12',
    'application/vnd.ms-word.template.macroEnabled.12',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
    'application/vnd.ms-excel.sheet.macroEnabled.12',
    'application/vnd.ms-excel.template.macroEnabled.12',
    'application/vnd.ms-excel.addin.macroEnabled.12',
    'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
    'application/vnd.openxmlformats-officedocument.presentationml.template',
    'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
    'application/vnd.ms-powerpoint.addin.macroEnabled.12',
    'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
    'application/vnd.ms-powerpoint.template.macroEnabled.12',
    'application/vnd.ms-powerpoint.slideshow.macroEnabled.12',
    'application/vnd.ms-access',
  ];

  imageTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/svg+xml',
    'image/tiff',
  ];

  /**
   * onReplaceSlug
   * @param text
   */
  onReplaceMarkSlug(text: string) {
    if (text != undefined || text != null) {
      text = text.replace(/\//gi, ''); // d???u \/
      text = text.replace(/,/g, ''); // d???u ,
      text = text.replace(/\)/g, ''); //d???u (
      text = text.replace(/\(/g, ''); //d???u )
      text = text.replace(/\./g, ''); // d???u .
    }
    return text;
  }

  /**
   * is mobile
   * @returns
   */
  isMobile() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * onCutNameFile
   * @param text
   * @returns
   */
  public onCutUrlNameFile(text: string) {
    let temp = '';
    if (text) {
      const item = text.split('/');
      temp = item[item.length - 1];
    }
    return temp;
  }

  /**
   * Error handling
   * @param error
   * @returns
   */
  handleError(error: any) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    // log error when call api
    console.log(
      'ERROR: API: ',
      error.url,
      ' Status:',
      error?.status,
      error?.error?.errors[0]
    );

    return throwError(error);
  }
}
