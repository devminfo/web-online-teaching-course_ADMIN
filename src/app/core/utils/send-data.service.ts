import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SendDataService {
  private sendData = new BehaviorSubject<any>(undefined);
  private sendDataHeader = new BehaviorSubject<any>(undefined);
  private sendDataCart = new BehaviorSubject<boolean>(false);
  private sendSpinning = new BehaviorSubject<boolean>(false);
  private dataRecruitment = new BehaviorSubject<any>(undefined);
  private isValidSoLuongGioHang = new BehaviorSubject<any>(undefined);
  private sendCheckActiveCategory = new BehaviorSubject<boolean>(false);

  constructor() { }


  public sentCheckValidSoLuongGioHang(data: any) {
    this.isValidSoLuongGioHang.next(true);
  }

  public getCheckValidSoLuongGioHang() {
    return this.isValidSoLuongGioHang.asObservable();
  }

  /**
   * Send data recruit ment
   * @param data
   */
  public sendDataRecruitment(data: any) {
    this.dataRecruitment.next(data);
  }

  /**
   * get Data Recruitment
   */
  public getDataRecruitment() {
    return this.dataRecruitment.asObservable();
  }

  /**
   * set Data Send
   * @param data
   */
  public setDataSend(data: any) {
    this.sendData.next(data);
  }

  /**
   * receivedDataSend
   */
  public receivedDataSend(): Observable<any> {
    return this.sendData.asObservable();
  }

  /**
   * completeSendData
   */
  public completeSendData() {
    this.sendData.complete();
  }

  /**
   *setDataSendCart
   * @param data
   */
  public setDataSendCart(data: boolean) {
    this.sendDataCart.next(data);
  }

  /**
   * receivedDataSendCart
   */
  public receivedDataSendCart(): Observable<boolean> {
    return this.sendDataCart.asObservable();
  }

  /**
   * completeSendDataCart
   */
  public completeSendDataCart() {
    this.sendDataCart.complete();
  }

  /**
   *setDataSendCart
   * @param data
   */
  public setDataSpinning(data: boolean) {
    this.sendSpinning.next(data);
  }

  /**
   * receivedDataSendCart
   */
  public receivedDataSpinning(): Observable<boolean> {
    return this.sendSpinning.asObservable();
  }

  /**
   * completeSendDataSpinning
   */
  public completeSendDataSpinning() {
    this.sendSpinning.complete();
  }

  /**
   * set Data Send
   * @param data
   */
  public setDataSendHeader(data: any) {
    this.sendDataHeader.next(data);
  }

  /**
   * receivedDataSend
   */
  public receivedDataSendHeader(): Observable<any> {
    return this.sendDataHeader.asObservable();
  }

  /**
   * completeSendData
   */
  public completeSendDataHeader() {
    this.sendDataHeader.complete();
  }

  /**
  *setDataSendCart
  * @param data
  */
  public setDataSendActiveCategory(data: boolean) {
    this.sendCheckActiveCategory.next(data);
  }

  /**
   * receivedDataSendCart
   */
  public receivedDataSendActiveCategory(): Observable<boolean> {
    return this.sendCheckActiveCategory.asObservable();
  }

  /**
   * completeSendDataCart
   */
  public completeSendActiveCategory() {
    this.sendCheckActiveCategory.complete();
  }
}
