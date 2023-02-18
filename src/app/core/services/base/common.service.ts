import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConstantsService } from '../../utils/constants.service';

@Injectable()
export class CommonService {
  // Define API
  public BASEURL = 'xxxx';
  
  // Define API
  apiURL = ConstantsService.api.frontEnd;

  public IMAGE_UPLOAD_URL = this.BASEURL + '/uploads';
  public FILE_UPLOAD_URL = this.BASEURL + '/uploads'; 

  constructor(
    public httpClient: HttpClient,
    private router: Router,
  ) {}

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
   * bỏ dấu tiếng việt để search
   */
  public cleanAccents(str: string): string {
    if (str != null || str != undefined) {
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
      str = str.replace(/đ/g, 'd');
      str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
      str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
      str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
      str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
      str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
      str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
      str = str.replace(/Đ/g, 'D');
      // Combining Diacritical Marks
      str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // huyền, sắc, hỏi, ngã, nặng
      str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // mũ â (ê), mũ ă, mũ ơ (ư)
    }
    return str;
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
        return 'Nữ';
      } else {
        return 'Không yêu cầu';
      }
    }
    return 'Không yêu cầu';
  }

  /**
   * onCheckMobile
   * @returns
   */
  public onCheckMobile() {
    if (
      /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
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
   * upload image Core
   */
  public uploadImageCore(files: any): Observable<any> {
    const uploadFileFinish = new Observable((observer) => {
      const formData: FormData = new FormData();
      formData.append('files', files);
      // this.showSpin();

      // post image to server
      this.httpClient
        .post<any>(this.IMAGE_UPLOAD_URL, formData, {})
        .subscribe((data) => {
          observer.next(data);
          // this.hideSpin();
        });
    });

    return uploadFileFinish;
  }

  /**
   * upload Image Cores
   * @param inputFileAvatars
   */
  public uploadImageCores(inputFileAvatars: any): Observable<any> {
    const formData: FormData = new FormData();

    for (let i = 0; i < inputFileAvatars.length; i++) {
      formData.append('files', inputFileAvatars[i]);
    }

    return this.httpClient.post(this.IMAGE_UPLOAD_URL, formData);
  }

  /**
   * upload image Core
   */
  public uploadFileCore(inputFile: any): Observable<any> {
    const files = [];
    const fileUpload = inputFile!.nativeElement;

    for (let index = 0; index < fileUpload.files.length; index++) {
      const file = fileUpload.files[index];
      files.push({ data: file, inProgress: false, progress: 0 });
    }
    const formData: FormData = new FormData();

    if (files.length > 0) {
      formData.append('files', files[0].data);
    } else {
      formData.append('files', '');
    }

    return this.httpClient.post(this.IMAGE_UPLOAD_URL, formData);
  }

  /**
   * ChangeToSlug
   */
  public changeToSlug(slug: string): string {
    //Đổi ký tự có dấu thành không dấu
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');

    slug = slug.toLowerCase();

    //Xóa các ký tự đặt biệt
    slug = slug.replace(
      /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
      '',
    );

    //Đổi khoảng trắng thành ký tự gạch ngang
    slug = slug.replace(/ /gi, '-');

    //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');

    //Xóa các ký tự gạch ngang ở đầu và cuối
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');

    return slug;
  }
 

  /**
   * check file có extension hợp lệ không
   * @description dùng để check valid hợp hệ
   * @ext_defaults (".doc"|".docx"|".xls"|".xlsx"|".pdf"|".jpg"|".png"|".svg"|".jpeg")
   * @param filepath một file path bao gôm filename + file ext. Vd: filename.png
   * @param requireOther tham số này sẽ cho phép mở rộng các file ext khác ngoài các exts mặc định (có thể trùng)
   * @param isClear tham số này sẽ cho phép bỏ qua các ext default chỉ xét requireOther
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

    // lấy theo yêu cầu
    const valids = requireOther;

    // nếu trường hợp clear bị false thì nạp các đuôi extension mặc định vào valids
    // chỉ lấy duy nhất các giá trị không tồn tại giá trị trùng lặp nhau
    if (isClear == false) valids.push(...defaults);

    // check các đuôi valid với url hiện tại
    // tìm sự tồn tại extension valid
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
      text = text.replace(/\//gi, ''); // dấu \/
      text = text.replace(/,/g, ''); // dấu ,
      text = text.replace(/\)/g, ''); //dấu (
      text = text.replace(/\(/g, ''); //dấu )
      text = text.replace(/\./g, ''); // dấu .
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
        navigator.userAgent,
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
}
