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
  selectedAnswers: string[];
  numericalAnswer?: number | null;
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
  selector: 'app-jee-advanced-questions',
  standalone: false,
  templateUrl: './jee-advanced-questions.component.html',
  styleUrls: ['./jee-advanced-questions.component.css']
})

export class JeeAdvancedQuestionsComponent
implements OnInit {
  candidate: Candidate = {
    name: 'John Smith'
  };

  sections: Section[]=[

{
id:'math',
label:'Mathematics',
questions:[

{
id:1,
type:'MCQ',
question:'If x²−5x+6=0 then roots are:',
options:[
{value:'A',text:'2 and 3'},
{value:'B',text:'1 and 6'},
{value:'C',text:'−2 and −3'},
{value:'D',text:'0 and 6'}
],
selectedAnswers:[],
status:'notVisited',
markedForReview:false
},

{
id:2,
type:'MCQ',
question:'Value of sin²θ+cos²θ is:',
options:[
{value:'A',text:'0'},
{value:'B',text:'1'},
{value:'C',text:'2'},
{value:'D',text:'Depends on θ'}
],
selectedAnswers:[],
status:'notVisited',
markedForReview:false
},

{
id:3,
type:'MCQ',
question:'Derivative of x² is:',
options:[
{value:'A',text:'x'},
{value:'B',text:'2x'},
{value:'C',text:'x²'},
{value:'D',text:'2'}
],
selectedAnswers:[],
status:'notVisited',
markedForReview:false
},

{
id:4,
type:'MCQ',
question:'Determinant of identity matrix is:',
options:[
{value:'A',text:'0'},
{value:'B',text:'1'},
{value:'C',text:'−1'},
{value:'D',text:'2'}
],
selectedAnswers:[],
status:'notVisited',
markedForReview:false
},

{
id:5,
type:'MCQ',
question:'Value of π approximately is:',
options:[
{value:'A',text:'2.14'},
{value:'B',text:'3.14'},
{value:'C',text:'4.13'},
{value:'D',text:'5.31'}
],
selectedAnswers:[],
status:'notVisited',
markedForReview:false
}

]
},

{
id:'physics',
label:'Physics',
questions:[

{
id:1,
type:'MCQ',
question:'SI unit of force is:',
options:[
{value:'A',text:'Joule'},
{value:'B',text:'Newton'},
{value:'C',text:'Watt'},
{value:'D',text:'Pascal'}
],
selectedAnswers:[],
status:'notVisited',
markedForReview:false
},

{
id:2,
type:'MCQ',
question:'Speed of light in vacuum is:',
options:[
{value:'A',text:'3×10⁸ m/s'},
{value:'B',text:'3×10⁶ m/s'},
{value:'C',text:'3×10⁴ m/s'},
{value:'D',text:'300 m/s'}
],
selectedAnswers:[],
status:'notVisited',
markedForReview:false
},

{
id:3,
type:'MCQ',
question:'SI unit of power is:',
options:[
{value:'A',text:'Joule'},
{value:'B',text:'Newton'},
{value:'C',text:'Watt'},
{value:'D',text:'Volt'}
],
selectedAnswers:[],
status:'notVisited',
markedForReview:false
},

{
id:4,
type:'MCQ',
question:'Acceleration due to gravity on Earth is:',
options:[
{value:'A',text:'9.8 m/s²'},
{value:'B',text:'3 m/s²'},
{value:'C',text:'1.8 m/s²'},
{value:'D',text:'12 m/s²'}
],
selectedAnswers:[],
status:'notVisited',
markedForReview:false
},

{
id:5,
type:'MCQ',
question:'Device used to measure current is:',
options:[
{value:'A',text:'Voltmeter'},
{value:'B',text:'Ammeter'},
{value:'C',text:'Barometer'},
{value:'D',text:'Thermometer'}
],
selectedAnswers:[],
status:'notVisited',
markedForReview:false
}

]
},

{
id:'chemistry',
label:'Chemistry',
questions:[

{
id:1,
type:'MCQ',
question:'pH value of neutral solution is:',
options:[
{value:'A',text:'0'},
{value:'B',text:'7'},
{value:'C',text:'14'},
{value:'D',text:'1'}
],
selectedAnswers:[],
status:'notVisited',
markedForReview:false
},

{
id:2,
type:'MCQ',
question:'Chemical symbol of Sodium is:',
options:[
{value:'A',text:'S'},
{value:'B',text:'Na'},
{value:'C',text:'So'},
{value:'D',text:'Sn'}
],
selectedAnswers:[],
status:'notVisited',
markedForReview:false
},

{
id:3,
type:'MCQ',
question:'Gas released during photosynthesis is:',
options:[
{value:'A',text:'CO₂'},
{value:'B',text:'O₂'},
{value:'C',text:'N₂'},
{value:'D',text:'H₂'}
],
selectedAnswers:[],
status:'notVisited',
markedForReview:false
},

{
id:4,
type:'MCQ',
question:'Water formula is:',
options:[
{value:'A',text:'CO₂'},
{value:'B',text:'H₂O'},
{value:'C',text:'NaCl'},
{value:'D',text:'O₂'}
],
selectedAnswers:[],
status:'notVisited',
markedForReview:false
},

{
id:5,
type:'MCQ',
question:'Atomic number of Carbon is:',
options:[
{value:'A',text:'4'},
{value:'B',text:'5'},
{value:'C',text:'6'},
{value:'D',text:'8'}
],
selectedAnswers:[],
status:'notVisited',
markedForReview:false
}

]
}

];

  activeSection = 'math';
  currentQuestionIndex = 0;
  selectedLanguage = 'English';
  isSubmitModalOpen = false;

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.markCurrentQuestionVisited();
  }

  get currentSection(): Section {
    return this.sections.find(
      section =>
      section.id === this.activeSection
    )!;

  }

  get currentQuestion(): Question {
    return this.currentSection.questions[
      this.currentQuestionIndex
    ];

  }

  get allQuestions(): Question[] {
    return this.sections.flatMap(
      section => section.questions
    );

  }

  get answeredCount(): number {
    return this.allQuestions.filter(
      q =>
      q.status === 'answered'
      ||
      q.status === 'answeredAndMarked'
    ).length;

  }

  get notAnsweredCount(): number {
    return this.allQuestions.filter(
      q =>
      q.status === 'notAnswered'
    ).length;

  }

  get notVisitedCount(): number {
    return this.allQuestions.filter(
      q =>
      q.status === 'notVisited'
    ).length;

  }

  get markedForReviewCount(): number {
    return this.allQuestions.filter(
      q =>
      q.status === 'markedForReview'
    ).length;

  }

  get answeredAndMarkedCount(): number {
    return this.allQuestions.filter(
      q =>
      q.status === 'answeredAndMarked'
    ).length;
  }

  handleSectionChange(
    sectionId: string
  ): void {
    this.activeSection = sectionId;
    this.currentQuestionIndex = 0;
    this.markCurrentQuestionVisited();

  }

  handleQuestionNavigation(
    index: number
  ): void {
    this.currentQuestionIndex = index;
    this.markCurrentQuestionVisited();
  }

  handleOptionSelect(
    value: string
  ): void {
    if(
      this.currentQuestion.type === 'MSQ'
    ){
      const answers =
      this.currentQuestion.selectedAnswers;
      const index =
      answers.indexOf(value);
      if(index > -1){
        answers.splice(index,1);
      } else {
        answers.push(value);
      }
      return;
    }

    this.currentQuestion.selectedAnswers =
    [value];
  }

  handleClearResponse(): void {
    this.currentQuestion.selectedAnswers = [];
    this.currentQuestion.numericalAnswer = null;
    this.currentQuestion.markedForReview = false;
    this.currentQuestion.status = 'notAnswered';
  }

  handleSaveNext(): void {
    this.saveCurrentQuestionStatus();
    this.goToNextQuestion();
  }

  handleMarkReview(): void {
    const hasAnswer =
      this.currentQuestion.selectedAnswers.length > 0
      ||
      this.currentQuestion.numericalAnswer !== null;
    this.currentQuestion.status =
      hasAnswer
      ? 'answeredAndMarked'
      : 'markedForReview';
    this.currentQuestion.markedForReview =
    true;
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

  getQuestionButtonClass(
    question: Question,
    index: number
  ): string {
    const classes = [
      this.getStatusClass(question.status)
    ];
    if(index === this.currentQuestionIndex){
      classes.push('current');
    }
    return classes.join(' ');
  }
  private getStatusClass(
    status: QuestionStatus
  ): string {
    switch(status){

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
    if(
      this.currentQuestion.status
      === 'notVisited'
    ){
      this.currentQuestion.status =
      'notAnswered';
    }
  }

  private saveCurrentQuestionStatus(): void {
    const hasAnswer =
      this.currentQuestion.selectedAnswers.length > 0
      ||
      this.currentQuestion.numericalAnswer !== null;

    this.currentQuestion.status =
      hasAnswer
      ? (
          this.currentQuestion.markedForReview
          ? 'answeredAndMarked'
          : 'answered'
        )
      : (
          this.currentQuestion.markedForReview
          ? 'markedForReview'
          : 'notAnswered'
        );
  }

  private goToNextQuestion(): void {

    if(this.currentQuestionIndex < this.currentSection.questions.length - 1){
      this.currentQuestionIndex++;
      this.markCurrentQuestionVisited();
      return;
    }

    const sectionIndex =
    this.sections.findIndex(
      section =>
      section.id === this.activeSection
    );

    const nextSection =
    this.sections[sectionIndex + 1];

    if(nextSection){
      this.activeSection =
      nextSection.id;
      this.currentQuestionIndex = 0;
      this.markCurrentQuestionVisited();
    }
  }
  getMathLines(
  mathContent: string
): string[] {
  return mathContent.split('\n');
}
}