import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Option {
  value: string;
  text: string;
}

type QuestionStatus =
  | 'answered'
  | 'notAnswered'
  | 'notVisited'
  | 'markedForReview'
  | 'answeredAndMarked';

interface Question {
  id: number;
  type: string;
  question: string;
  mathContent?: string;
  options: Option[];
  selectedOption: string | null;
  status: QuestionStatus;
  markedForReview: boolean;
}

interface Section {
  id: string;
  label: string;
  questions: Question[];
}

interface Candidate {
  name: string;
}

@Component({
  selector: 'app-mock-question',
  standalone: false,
  templateUrl: './mock-question.component.html',
  styleUrls: ['./mock-question.component.css'],
})
export class MockQuestion implements OnInit {
  candidate: Candidate = {
    name: 'John Smith',
  };

sections: Section[] = [
  // ===================== MATHEMATICS =====================
  {
    id: 'math',
    label: 'Mathematics',
    questions: [
      {
        id: 1,
        type: 'MCQ',
        question: 'The area inside ellipse x² + 4y² = 4 and outside bounded region is:',
        options: [
          { value: 'A', text: '2(π − 1)' },
          { value: 'B', text: '(π/2) − 1' },
          { value: 'C', text: '3(π − 1)' },
          { value: 'D', text: '2π − 1' },
        ],
        selectedOption: null,
        status: 'notVisited',
        markedForReview: false,
      },

      {
        id: 2,
        type: 'MCQ',
        question: 'If a₂a₃a₄ = 64 in GP, then a₃+a₅+a₇ equals:',
        options: [
          { value: 'A', text: '3256' },
          { value: 'B', text: '3252' },
          { value: 'C', text: '3244' },
          { value: 'D', text: '3248' },
        ],
        selectedOption: null,
        status: 'notVisited',
        markedForReview: false,
      },

     {
  id: 3,
  type: 'MCQ',
  question:
    'The number of relations defined on the set {a, b, c, d} which are both reflexive and symmetric is:',
  options: [
    { value: 'A', text: '256' },
    { value: 'B', text: '16' },
    { value: 'C', text: '1024' },
    { value: 'D', text: '64' },
  ],
  selectedOption: null,
  status: 'notVisited',
  markedForReview: false,
},

      {
  id: 4,
  type: 'MCQ',
  question:
    'Let z₁ and z₂ be roots of equation z² − (4+2i)z + (5+10i) = 0. Then |z₁|² + |z₂|² equals:',
  options: [
    { value: 'A', text: '20' },
    { value: 'B', text: '24' },
    { value: 'C', text: '28' },
    { value: 'D', text: '32' },
  ],
  selectedOption: null,
  status: 'notVisited',
  markedForReview: false,
},


      {
  id: 5,
  type: 'MCQ',
  question:
    'Let a = i − 2j + 2k and b = 8i + 7j − 3k. If a × c = b and c · (i + j + k) = 4, then |a + c|² is equal to:',
  options: [
    { value: 'A', text: '33' },
    { value: 'B', text: '30' },
    { value: 'C', text: '35' },
    { value: 'D', text: '27' },
  ],
  selectedOption: null,
  status: 'notVisited',
  markedForReview: false,
},

      {
        id: 6,
        type: 'MCQ',
        question: 'Projection length of vector on 6i+2j+3k is:',
        options: [
          { value: 'A', text: '15/7' },
          { value: 'B', text: '4' },
          { value: 'C', text: '18/7' },
          { value: 'D', text: '3' },
        ],
        selectedOption: null,
        status: 'notVisited',
        markedForReview: false,
      },

      {
        id: 7,
        type: 'MCQ',
        question: 'Value of cosec10° − 3sec10° is:',
        options: [
          { value: 'A', text: '4' },
          { value: 'B', text: '2' },
          { value: 'C', text: '8' },
          { value: 'D', text: '6' },
        ],
        selectedOption: null,
        status: 'notVisited',
        markedForReview: false,
      },

      {
        id: 8,
        type: 'MCQ',
        question: 'Sum of all roots of equation (x−1)²−5|x−1|+6=0 is:',
        options: [
          { value: 'A', text: '4' },
          { value: 'B', text: '3' },
          { value: 'C', text: '1' },
          { value: 'D', text: '5' },
        ],
        selectedOption: null,
        status: 'notVisited',
        markedForReview: false,
      },

      {
        id: 9,
        type: 'MCQ',
        question: 'Equation of chord bisected at (1,2) is:',
        options: [
          { value: 'A', text: '5x−y−3=0' },
          { value: 'B', text: '4x−5y+6=0' },
          { value: 'C', text: 'x−2y+3=0' },
          { value: 'D', text: '5x−4y+3=0' },
        ],
        selectedOption: null,
        status: 'notVisited',
        markedForReview: false,
      },

      {
  id: 10,
  type: 'MCQ',
  question:
    'If the line xcosθ + ysinθ = p touches the parabola y² = 4ax, then the value of p in terms of a and θ is:',
  options: [
    { value: 'A', text: 'a secθ tanθ' },
    { value: 'B', text: 'a cosθ' },
    { value: 'C', text: 'a secθ' },
    { value: 'D', text: 'a cscθ' },
  ],
  selectedOption: null,
  status: 'notVisited',
  markedForReview: false,
},
    ],
  },

  // ===================== PHYSICS =====================
  {
    id: 'physics',
    label: 'Physics',
    questions: [
      {
        id: 1,
        type: 'MCQ',
        question: 'Rate of gas consumption in geyser is:',
        options: [
          { value: 'A', text: '2.1 g/s' },
          { value: 'B', text: '4.2 g/s' },
          { value: 'C', text: '0.42 g/s' },
          { value: 'D', text: '0.21 g/s' },
        ],
        selectedOption: null,
        status: 'notVisited',
        markedForReview: false,
      },

      {
        id: 2,
        type: 'MCQ',
        question: 'Average thermal energy dissipated is:',
        options: [
          { value: 'A', text: 'π/2' },
          { value: 'B', text: '2π' },
          { value: 'C', text: 'π' },
          { value: 'D', text: 'π²' },
        ],
        selectedOption: null,
        status: 'notVisited',
        markedForReview: false,
      },

      {
  id: 3,
  type: 'MCQ',
  question:
    'A parallel plate capacitor has capacitance C in vacuum. A dielectric slab of thickness d/3 and dielectric constant K is inserted between the plates. The new capacitance is:',
  options: [
    { value: 'A', text: '3KC / (2K + 1)' },
    { value: 'B', text: '2CK / (K + 2)' },
    { value: 'C', text: '3CK / 2(K + 1)' },
    { value: 'D', text: '4KC / (3K − 1)' },
  ],
  selectedOption: null,
  status: 'notVisited',
  markedForReview: false,
},

      {
        id: 4,
        type: 'MCQ',
        question: 'Acceleration of charged particle inside solenoid:',
        options: [
          { value: 'A', text: 'a = g' },
          { value: 'B', text: 'a > g' },
          { value: 'C', text: 'a = 0' },
          { value: 'D', text: '0 < a < g' },
        ],
        selectedOption: null,
        status: 'notVisited',
        markedForReview: false,
      },

      {
        id: 5,
        type: 'MCQ',
        question: 'Thickness of transparent sheet is:',
        options: [
          { value: 'A', text: '8×10⁻⁴ cm' },
          { value: 'B', text: '6×10⁻³ cm' },
          { value: 'C', text: '5.6×10⁻⁴ cm' },
          { value: 'D', text: '5×10⁻³ cm' },
        ],
        selectedOption: null,
        status: 'notVisited',
        markedForReview: false,
      },

      {
  id: 6,
  type: 'MCQ',
  question:
    'A light wave is represented by E = 60 sin(3×10¹⁵ t + 12×10¹⁵ x). The maximum kinetic energy of photoelectrons emitted from a metal surface of work function 2.8 eV is:',
  options: [
    { value: 'A', text: '5.1 eV' },
    { value: 'B', text: '3.8 eV' },
    { value: 'C', text: '6.0 eV' },
    { value: 'D', text: '7.8 eV' },
  ],
  selectedOption: null,
  status: 'notVisited',
  markedForReview: false,
},
      {
        id: 7,
        type: 'MCQ',
        question: 'Force required to move rod is:',
        options: [
          { value: 'A', text: '7.5×10⁻² N' },
          { value: 'B', text: '5.7×10⁻³ N' },
          { value: 'C', text: '5.7×10⁻² N' },
          { value: 'D', text: '7.5×10⁻³ N' },
        ],
        selectedOption: null,
        status: 'notVisited',
        markedForReview: false,
      },

      {
  id: 8,
  type: 'MCQ',
  question:
    'Two strings having linear densities 2×10⁻⁴ kg/m and 4×10⁻⁴ kg/m are joined together under tension 500 N. If pulses are sent from both ends, then ratio t₁/t₂ is:',
  options: [
    { value: 'A', text: '1.08' },
    { value: 'B', text: '1.90' },
    { value: 'C', text: '1.67' },
    { value: 'D', text: '1.18' },
  ],
  selectedOption: null,
  status: 'notVisited',
  markedForReview: false,
},

      {
  id: 9,
  type: 'MCQ',
  question:
    'A point charge 10⁻⁸ C is placed at origin. Work done in moving charge 2 μC from A(4,4,2) to B(2,2,1) is:',
  options: [
    { value: 'A', text: '45×10⁻⁶ J' },
    { value: 'B', text: '0 J' },
    { value: 'C', text: '30×10⁻⁶ J' },
    { value: 'D', text: '15×10⁻⁶ J' },
  ],
  selectedOption: null,
  status: 'notVisited',
  markedForReview: false,
},

      {
  id: 10,
  type: 'MCQ',
  question:
    'A microscope has objective focal length 2 cm and eyepiece focal length 4 cm. If tube length is 32 cm, then magnification for normal adjustment is:',
  options: [
    { value: 'A', text: '80' },
    { value: 'B', text: '90' },
    { value: 'C', text: '100' },
    { value: 'D', text: '120' },
  ],
  selectedOption: null,
  status: 'notVisited',
  markedForReview: false,
},
    ],
  },

  // ===================== CHEMISTRY =====================
  {
    id: 'chemistry',
    label: 'Chemistry',
    questions: [
      {
        id: 1,
        type: 'MCQ',
        question: 'Formula of hydrocarbon is:',
        options: [
          { value: 'A', text: 'C₂H₄' },
          { value: 'B', text: 'C₄H₁₀' },
          { value: 'C', text: 'C₂H₂' },
          { value: 'D', text: 'C₂H₆' },
        ],
        selectedOption: null,
        status: 'notVisited',
        markedForReview: false,
      },

      {
        id: 2,
        type: 'MCQ',
        question: 'Incorrect statement regarding calcium reaction:',
        options: [
          { value: 'A', text: '0.35 mol H₂ evolved' },
          { value: 'B', text: '7.84 L H₂ evolved' },
          { value: 'C', text: '33.3 g CaCl₂ formed' },
          { value: 'D', text: 'Calcium is limiting reagent' },
        ],
        selectedOption: null,
        status: 'notVisited',
        markedForReview: false,
      },

      {
        id: 3,
        type: 'MCQ',
        question: 'Percentage sulphur by Carius method:',
        options: [
          { value: 'A', text: '4.55%' },
          { value: 'B', text: '10.30%' },
          { value: 'C', text: '21.97%' },
          { value: 'D', text: '16.48%' },
        ],
        selectedOption: null,
        status: 'notVisited',
        markedForReview: false,
      },

     {
  id: 4,
  type: 'MCQ',
  question:
    'An organic compound P on treatment with aqueous NH₃ forms Q, which on heating with Br₂/KOH gives R having molecular formula C₆H₇N. Identify P, Q and R respectively:',
  options: [
    { value: 'A', text: 'Benzoic acid, benzamide, aniline' },
    { value: 'B', text: 'Toluic acid, methylbenzamide, 2-methylaniline' },
    { value: 'C', text: 'Benzoic acid, 4-methylbenzamide, 4-methylaniline' },
    { value: 'D', text: 'Phenylethanoic acid, phenylethanamide, benzamine' },
  ],
  selectedOption: null,
  status: 'notVisited',
  markedForReview: false,
},


      {
        id: 5,
        type: 'MCQ',
        question: 'MnO₄²⁻ in acidic medium disproportionates to:',
        options: [
          { value: 'A', text: 'Mn₂O₇ and MnO₂' },
          { value: 'B', text: 'MnO₄⁻ and MnO' },
          { value: 'C', text: 'MnO₄⁻ and MnO₂' },
          { value: 'D', text: 'Mn₂O₇ and MnO' },
        ],
        selectedOption: null,
        status: 'notVisited',
        markedForReview: false,
      },

      
{
  id: 6,
  type: 'MCQ',
  question:
    'Among [Cu(NH₃)₄]²⁺, [Ni(en)₃]²⁺, [Ni(NH₃)₆]²⁺ and [Mn(H₂O)₆]²⁺, the complex having maximum number of unpaired electrons is:',
  options: [
    { value: 'A', text: '[Cu(NH₃)₄]²⁺' },
    { value: 'B', text: '[Ni(en)₃]²⁺' },
    { value: 'C', text: '[Ni(NH₃)₆]²⁺' },
    { value: 'D', text: '[Mn(H₂O)₆]²⁺' },
  ],
  selectedOption: null,
  status: 'notVisited',
  markedForReview: false,
},

{
  id: 7,
  type: 'MCQ',
  question:
    'Identify the correct statements regarding amino acids:',
  options: [
    { value: 'A', text: 'Arginine and tryptophan are essential amino acids' },
    { value: 'B', text: 'Histidine contains no heterocyclic ring' },
    { value: 'C', text: 'Proline is a six-membered cyclic amino acid' },
    { value: 'D', text: 'Glycine does not possess a chiral centre' },
  ],
  selectedOption: null,
  status: 'notVisited',
  markedForReview: false,
},

{
  id: 8,
  type: 'MCQ',
  question:
    'For the reaction N₂O₄ ⇌ 2NO₂, identify the correct statement:',
  options: [
    { value: 'A', text: 'ΔG is always negative' },
    { value: 'B', text: 'Reverse reaction goes to completion' },
    { value: 'C', text: 'At equilibrium ΔG = 0' },
    { value: 'D', text: 'NO₂ cannot exist at equilibrium' },
  ],
  selectedOption: null,
  status: 'notVisited',
  markedForReview: false,
},

{
  id: 9,
  type: 'MCQ',
  question:
    'The frequency of second line of Balmer series obtained from He⁺ is equal to:',
  options: [
    { value: 'A', text: 'First line of Lyman series of hydrogen' },
    { value: 'B', text: 'Second line of Lyman series of hydrogen' },
    { value: 'C', text: 'First line of Paschen series' },
    { value: 'D', text: 'Third line of Balmer series' },
  ],
  selectedOption: null,
  status: 'notVisited',
  markedForReview: false,
},

{
  id: 10,
  type: 'MCQ',
  question:
    'In the reaction sequence involving Na₂Cr₂O₇ and H₂SO₄, if X is number of peroxide linkages, Y is total oxygen atoms and Z is oxidation state of chromium in final product, then X + Y + Z equals:',
  options: [
    { value: 'A', text: '10' },
    { value: 'B', text: '11' },
    { value: 'C', text: '12' },
    { value: 'D', text: '13' },
  ],
  selectedOption: null,
  status: 'notVisited',
  markedForReview: false,
},
    ],
  },
];

  activeSection = 'math';
  currentQuestionIndex = 0;
  selectedLanguage = 'English';
  isSubmitModalOpen = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.markCurrentQuestionVisited();
  }

  get currentSection(): Section {
    return (
      this.sections.find((section) => section.id === this.activeSection) ??
      this.sections[0]
    );
  }

  get currentQuestion(): Question {
    return this.currentSection.questions[this.currentQuestionIndex];
  }

  get allQuestions(): Question[] {
    return this.sections.flatMap((section) => section.questions);
  }

  get answeredCount(): number {
    return this.allQuestions.filter(
      (q) => q.status === 'answered' || q.status === 'answeredAndMarked'
    ).length;
  }

  get notAnsweredCount(): number {
    return this.allQuestions.filter((q) => q.status === 'notAnswered').length;
  }

  get notVisitedCount(): number {
    return this.allQuestions.filter((q) => q.status === 'notVisited').length;
  }

  get markedForReviewCount(): number {
    return this.allQuestions.filter(
      (q) => q.status === 'markedForReview'
    ).length;
  }

  get answeredAndMarkedCount(): number {
    return this.allQuestions.filter(
      (q) => q.status === 'answeredAndMarked'
    ).length;
  }

  handleSectionChange(sectionId: string): void {
    this.activeSection = sectionId;
    this.currentQuestionIndex = 0;
    this.markCurrentQuestionVisited();
  }

  handleQuestionNavigation(index: number): void {
    this.currentQuestionIndex = index;
    this.markCurrentQuestionVisited();
  }

  handleOptionSelect(value: string): void {
    this.currentQuestion.selectedOption = value;
  }

  handleMarkReview(): void {
    if (this.currentQuestion.selectedOption) {
      this.currentQuestion.status = 'answeredAndMarked';
    } else {
      this.currentQuestion.status = 'markedForReview';
    }

    this.currentQuestion.markedForReview = true;
    this.goToNextQuestion();
  }

  handleClearResponse(): void {
    this.currentQuestion.selectedOption = null;
    this.currentQuestion.markedForReview = false;
    this.currentQuestion.status = 'notAnswered';
  }

  handleSaveNext(): void {
    this.saveCurrentQuestionStatus();
    this.goToNextQuestion();
  }

  handleSubmit(): void {
    this.saveCurrentQuestionStatus();
    this.isSubmitModalOpen = true;
  }

  closeSubmitModal(): void {
    this.isSubmitModalOpen = false;
  }

  confirmSubmit(): void {
    this.isSubmitModalOpen = false;
    this.router.navigate(['/mock-submit']);
  }

  getQuestionButtonClass(question: Question, index: number): string {
    const classes = [this.getStatusClass(question.status)];

    if (index === this.currentQuestionIndex) {
      classes.push('current');
    }

    return classes.join(' ');
  }

  getMathLines(mathContent: string): string[] {
    return mathContent.split('\n');
  }

  private getStatusClass(status: QuestionStatus): string {
    switch (status) {
      case 'answered':
        return 'answered';
      case 'notAnswered':
        return 'not-answered';
      case 'markedForReview':
        return 'marked-review';
      case 'answeredAndMarked':
        return 'answered-marked-review';
      default:
        return 'not-visited';
    }
  }

  private markCurrentQuestionVisited(): void {
    if (this.currentQuestion.status === 'notVisited') {
      this.currentQuestion.status = 'notAnswered';
    }
  }

  private saveCurrentQuestionStatus(): void {
    if (this.currentQuestion.selectedOption) {
      this.currentQuestion.status = this.currentQuestion.markedForReview
        ? 'answeredAndMarked'
        : 'answered';
    } else {
      this.currentQuestion.status = this.currentQuestion.markedForReview
        ? 'markedForReview'
        : 'notAnswered';
    }
  }

  private goToNextQuestion(): void {
    if (this.currentQuestionIndex < this.currentSection.questions.length - 1) {
      this.currentQuestionIndex++;
      this.markCurrentQuestionVisited();
      return;
    }

    const sectionIndex = this.sections.findIndex(
      (section) => section.id === this.activeSection
    );
    const nextSection = this.sections[sectionIndex + 1];

    if (nextSection) {
      this.activeSection = nextSection.id;
      this.currentQuestionIndex = 0;
      this.markCurrentQuestionVisited();
    }
  }
}
