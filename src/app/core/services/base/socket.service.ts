import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {}

  /**
   * Get socket from server
   */
  getSocketFromServer() {
    return this.socket.fromEvent('p09fivess').pipe(map((data) => data));
  }
}
