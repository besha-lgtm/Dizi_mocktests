import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header1',
  standalone: false,
  templateUrl: './header1.component.html',
  styleUrl: './header1.component.css',
})
export class Header1Component {
  @Input() logoText: string = 'JEE';
  @Input() logoSubtext: string = 'MAINS';
  @Input() examTitle: string = 'JOINT ENTRANCE EXAMINATION (MAINS) 2026';
  @Input() examSubtitle: string = 'संयुक्त प्रवेश परीक्षा (मुख्य) २०२६';
  @Input() organizingInstitute: string = 'Indian Institute of Technology Roorkee';
  @Input() roleTitle: string = 'Organizing Institute';
}
