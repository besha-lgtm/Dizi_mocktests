import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header1',
  standalone: false,
  templateUrl: './header1.component.html',
  styleUrl: './header1.component.css',
})
export class Header1Component {
  @Input() logoText: string = 'JEE';
  // @Input() logoSubtext: string = 'MAINS';
  @Input() examTitle: string = 'JOINT ENTRANCE EXAMINATION';
  @Input() organizingInstitute: string = 'Dizi Edutech';
  @Input() roleTitle: string = 'Organizing Institute';
}
