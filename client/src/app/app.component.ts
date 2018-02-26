import { Component } from '@angular/core';
import { IOService } from './service/io.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [IOService]
})
export class AppComponent {
  title = 'swittr';
}
