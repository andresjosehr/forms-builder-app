import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Pusher from 'pusher-js';


@Injectable({
  providedIn: 'root'
})
export class WebsocketsService {
    pusher: any;
    channel: any;
    constructor(private http: HttpClient) {
      this.pusher = new Pusher("0ba295ddc055db41abfd", {
        cluster: "us2",
      });
      this.channel = this.pusher.subscribe('home');
    }
}
