import { Component } from '@angular/core';
import { IOService } from '../service/io.service';

@Component({
  selector: 'app-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.css']
})
export class KeyComponent {
  message;

  constructor(private ioService: IOService) {
  }

  sendMessage() {
    this.ioService.sendMessage(this.message);
    this.message = '';
  }
}
