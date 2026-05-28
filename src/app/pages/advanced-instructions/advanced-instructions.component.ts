import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

interface PaletteItem {
  symbol: string | number;
  meaning: string;
}

interface InstructionSection {
  title: string;
  type: 'numbered' | 'lettered';
  items: string[];
}

interface InstructionData {
  pageTitle: string;
  sections: InstructionSection[];
  paletteItems: PaletteItem[];
  languageOptions: {
    value: string;
    label: string;
    disabled: boolean;
  }[];
  disclaimerText: string;
  readyButtonText: string;
}

@Component({
  selector: 'app-advanced-instructions',
  standalone: false,
  templateUrl: './advanced-instructions.component.html',
  styleUrls: ['./advanced-instructions.component.css']
})

export class AdvancedInstructionsComponent {

  @Output() ready =
  new EventEmitter<void>();

  hasAcceptedInstructions = false;

  hasTouchedInstructions = false;

  selectedLanguage = 'english';

  profileName = 'John Smith';

  readyButtonLabel =
  'I am ready to begin';

  constructor(
    private router: Router
  ) {}

  instructionData: InstructionData = {

    pageTitle:
    'JEE ADVANCED — INSTRUCTIONS TO CANDIDATES',

    sections: [

      {
        title: 'GENERAL INSTRUCTIONS',

        type: 'numbered',

        items: [

          'Total duration of the paper is <strong>3 hours (180 minutes)</strong>.',

          'The on-screen computer clock will display the remaining examination time. The examination will automatically end once the timer reaches zero.',

          'The Question Palette displayed on the right side of the screen will indicate the current status of each question using different symbols.',

          'JEE Advanced examination may contain multiple question types including <strong>Single Correct MCQ, Multiple Correct MCQ, Numerical Value Questions, Paragraph Based Questions</strong> and <strong>Matrix Match Questions</strong>.',

          'Some sections may contain <strong>partial marking</strong>, <strong>negative marking</strong>, or <strong>zero negative marking</strong>. Candidates are advised to carefully read the instructions displayed for each section.',

          'You can click on the <strong>&gt;</strong> arrow beside the Question Palette to collapse it and maximise the question window. Click <strong>&lt;</strong> to restore it.',

          'You can change the language of the question paper using the language selector available at the top-right corner of the examination screen.'

        ]
      },

      {
        title: 'NAVIGATING TO A QUESTION',

        type: 'lettered',

        items: [

          'Click on a question number in the Question Palette to directly navigate to that question. This action does <strong>NOT save</strong> your current answer.',

          'Click on <strong>Save & Next</strong> to save the current response and move to the next question.',

          'Click on <strong>Mark for Review & Next</strong> to mark the question for review and move to the next question.',

          'Questions marked for review after answering will still be considered for evaluation.'

        ]
      },

      {
        title: 'ANSWERING A QUESTION',

        type: 'numbered',

        items: [

          '<strong>MCQ (Single Correct)</strong>: Select only one correct option. Use <strong>Clear Response</strong> to deselect your answer.',

          '<strong>MSQ (Multiple Correct)</strong>: Select one or more correct options. Partial marking may be applicable in some sections.',

          '<strong>Numerical Value Questions</strong>: Enter the numerical value using the on-screen virtual keypad.',

          '<strong>Paragraph Based Questions</strong>: Carefully read the paragraph before answering the related questions.',

          '<strong>Matrix Match Questions</strong>: Match the correct entries carefully according to the given instructions.',

          'Always click <strong>Save & Next</strong> after answering each question to ensure responses are recorded.'

        ]
      },

      {
        title: 'IMPORTANT EXAM RULES',

        type: 'numbered',

        items: [

          'No calculators, smart watches, electronic gadgets, Bluetooth devices, or study material are permitted inside the examination hall.',

          'Any unfair means or malpractice may lead to immediate disqualification from the examination.',

          'Rough work must only be done on the sheets provided by the examination authority.',

          'Candidates are advised to manage time efficiently as difficulty level and marking schemes may vary across sections.'

        ]
      }

    ],

    paletteItems: [

      {
        symbol: '1',
        meaning:
        'You have <strong>not visited</strong> this question yet.'
      },

      {
        symbol: '2',
        meaning:
        'You have <strong>not answered</strong> this question.'
      },

      {
        symbol: '3',
        meaning:
        'You have <strong>answered</strong> this question.'
      },

      {
        symbol: '4',
        meaning:
        'You have <strong>not answered</strong> this question but marked it for review.'
      },

      {
        symbol: '5',
        meaning:
        'You have <strong>answered</strong> this question and marked it for review.'
      }

    ],

    languageOptions: [

      {
        value: 'english',
        label: 'English',
        disabled: false
      },

      {
        value: 'hindi',
        label: 'हिन्दी',
        disabled: false
      }

    ],

    disclaimerText:
    'I have read and understood all the instructions carefully. I declare that I am not carrying any prohibited electronic devices or unfair materials. I understand that violation of examination rules may lead to cancellation of candidature.',

    readyButtonText:
    'I am ready to begin'

  };

  paletteStatusTypes = [

    {
      class: 'unvisited',
      label: 'Not Visited'
    },

    {
      class: 'not-answered',
      label: 'Not Answered'
    },

    {
      class: 'answered',
      label: 'Answered'
    },

    {
      class: 'marked-review',
      label: 'Marked for Review'
    },

    {
      class: 'answered-marked-review',
      label: 'Answered & Marked for Review'
    }

  ];

  onInstructionCheck(event: Event): void {

    const checkbox =
    event.target as HTMLInputElement;

    this.hasAcceptedInstructions =
    checkbox.checked;

    this.hasTouchedInstructions = true;

  }

  onLanguageChange(event: Event): void {

    const select =
    event.target as HTMLSelectElement;

    this.selectedLanguage =
    select.value;

  }

  shouldShowPaletteTable(
    section: InstructionSection,
    index: number
  ): boolean {

    return (
      section.title === 'GENERAL INSTRUCTIONS'
      && index === 2
    );

  }

  getLetterFromIndex(index: number): string {

    return String.fromCharCode(
      97 + index
    );

  }

  onReadyToBegin(): void {

  if(this.hasAcceptedInstructions){

    this.ready.emit();

  }

}

}