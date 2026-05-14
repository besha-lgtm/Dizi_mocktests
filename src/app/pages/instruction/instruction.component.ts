import { Component, EventEmitter, Output } from '@angular/core';

interface PaletteItem {
  symbol: string | number;
  meaning: string;
}

interface InstructionSection {
  title: string;
  type: 'numbered' | 'lettered'; // 'numbered' for ol, 'lettered' for a, b, c
  items: string[];
}

interface InstructionData {
  pageTitle: string;
  sections: InstructionSection[];
  paletteItems: PaletteItem[];
  languageOptions: { value: string; label: string; disabled: boolean }[];
  disclaimerText: string;
  readyButtonText: string;
}

@Component({
  selector: 'app-instruction',
  standalone: false,
  templateUrl: './instruction.component.html',
  styleUrl: './instruction.component.css',
})
export class Instruction {
  @Output() ready = new EventEmitter<void>();

  hasAcceptedInstructions = false;
  hasTouchedInstructions = false;
  selectedLanguage = 'english';

  // Profile data
  profileName = 'Name';
  
  // Button/Label text
  readyButtonLabel = 'I am ready to begin';

  // Dynamic instruction data - Easy to update from backend
  instructionData: InstructionData = {
    pageTitle: 'INSTRUCTIONS TO CANDIDATES',
    sections: [
      {
        title: 'GENERAL INSTRUCTIONS',
        type: 'numbered',
        items: [
          'Total duration of the paper is <strong>3 hours (180 minutes)</strong>.',
          'The on-screen computer clock will be set at the server. The countdown timer in the top right corner will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end automatically. Only the answers that you have <strong>saved</strong> will be recorded.',
          'The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols:',
          'You can click on the <strong>&gt;</strong> arrow on the left of the palette to collapse it, maximising the question window. Click <strong>&lt;</strong> to restore it.',
          'You can click on the profile image in the top-right corner to change the language (English or Hindi) of the entire question paper during the exam.',
        ],
      },
      {
        title: 'NAVIGATING TO A QUESTION',
        type: 'lettered',
        items: [
          'Click on the question number in the Question Palette to go directly to that question. Note: this does <strong>NOT save</strong> the answer to the current question.',
          'Click on <strong>Save & Next</strong> to save the answer and proceed to the next question.',
          'Click on <strong>Mark for Review & Next</strong> to save, flag for review, and proceed.',
        ],
      },
      {
        title: 'ANSWERING A QUESTION',
        type: 'numbered',
        items: [
          '<strong>MCQ (Single Correct)</strong>: Click the option button. Use <strong>Clear Response</strong> to deselect. Click <strong>Save & Next</strong> to save.',
          '<strong>MSQ (Multiple Correct)</strong>: Click one or more option checkboxes. Use <strong>Clear Response</strong> to deselect all. Click <strong>Save & Next</strong> to save.',
          '<strong>Numerical Value</strong>: Use the on-screen virtual numeric keypad to enter the answer. Use <strong>Clear Response</strong> to clear. Click <strong>Save & Next</strong> to save.',
        ],
      },
    ],
    paletteItems: [
      {
        symbol: '1',
        meaning: 'You have <strong>not visited</strong> this question yet.',
      },
      {
        symbol: '2',
        meaning: 'You have <strong>not answered</strong> this question.',
      },
      {
        symbol: '3',
        meaning: 'You have <strong>answered</strong> this question.',
      },
      {
        symbol: '4',
        meaning: 'You have <strong>not answered</strong> this question but <strong>marked it for review</strong>.',
      },
      {
        symbol: '5',
        meaning: 'You have <strong>answered</strong> this question and <strong>marked it for review</strong> (will be evaluated).',
      },
    ],
    languageOptions: [
      { value: 'english', label: 'English', disabled: false },
      { value: 'hindi', label: 'हिन्दी', disabled: true },
    ],
    disclaimerText:
      'I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing any prohibited gadget. I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test.',
    readyButtonText: 'I am ready to begin',
  };

  // Palette status types
  paletteStatusTypes = [
    { class: 'unvisited', label: 'Not Visited' },
    { class: 'not-answered', label: 'Not Answered' },
    { class: 'answered', label: 'Answered' },
    { class: 'marked-review', label: 'Marked for Review' },
    { class: 'answered-marked-review', label: 'Answered & Marked for Review' },
  ];

  onInstructionCheck(event: Event): void {
    const checkbox = event.target as HTMLInputElement;

    this.hasAcceptedInstructions = checkbox.checked;
    this.hasTouchedInstructions = true;
  }

  onLanguageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedLanguage = select.value;
    // Trigger any language change logic here
  }

  shouldShowPaletteTable(section: InstructionSection, index: number): boolean {
    return section.title === 'GENERAL INSTRUCTIONS' && index === 2;
  }

  /**
   * Convert index to letter (0 = 'a', 1 = 'b', etc.)
   * Used in templates for lettered lists
   */
  getLetterFromIndex(index: number): string {
    return String.fromCharCode(97 + index);
  }

  onReadyToBegin(): void {
    if (this.hasAcceptedInstructions) {
      this.ready.emit();
    }
  }
}
