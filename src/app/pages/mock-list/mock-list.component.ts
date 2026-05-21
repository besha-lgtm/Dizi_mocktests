import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export interface Question {
  id: string;
  topic: string;
  questionText: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  lastModified: string;
}

@Component({
  selector: 'app-mock-list',
  standalone: false,
  templateUrl: './mock-list.component.html',
  styleUrls: ['./mock-list.component.css']
})
export class MockListComponent implements OnInit {

  subject: string = '';

  // ─── Subject-specific question banks ────────────────────────────────────────
  private questionBank: Record<string, Question[]> = {

    Mathematics: [
      { id: '#MAT-101', topic: 'Algebra',      questionText: 'Solve for x: 2x² + 5x - 3 = 0',                                   difficulty: 'Easy',   lastModified: 'Oct 12, 2023' },
      { id: '#MAT-204', topic: 'Calculus',     questionText: 'Find the derivative of f(x) = sin(x²)',                            difficulty: 'Medium', lastModified: 'Oct 10, 2023' },
      { id: '#MAT-312', topic: 'Geometry',     questionText: 'Calculate the volume of a sphere with radius r = 5 cm',            difficulty: 'Hard',   lastModified: 'Oct 09, 2023' },
      { id: '#MAT-105', topic: 'Algebra',      questionText: 'Simplify the expression: (x+2)(x-2) + 4',                         difficulty: 'Easy',   lastModified: 'Sep 30, 2023' },
      { id: '#MAT-220', topic: 'Trigonometry', questionText: 'Prove that sin²θ + cos²θ = 1',                                    difficulty: 'Medium', lastModified: 'Sep 28, 2023' },
      { id: '#MAT-315', topic: 'Geometry',     questionText: 'Find the area of a triangle with sides 5, 12, and 13',             difficulty: 'Easy',   lastModified: 'Sep 25, 2023' },
      { id: '#MAT-401', topic: 'Calculus',     questionText: 'Evaluate the integral: ∫(3x² + 2x + 1)dx',                        difficulty: 'Hard',   lastModified: 'Sep 22, 2023' },
      { id: '#MAT-116', topic: 'Algebra',      questionText: 'Factor the polynomial: x³ - 3x² + 3x - 1',                        difficulty: 'Medium', lastModified: 'Sep 18, 2023' },
      { id: '#MAT-502', topic: 'Statistics',   questionText: 'Find the mean, median and mode of: 4, 7, 2, 9, 4, 1, 8, 4',       difficulty: 'Easy',   lastModified: 'Sep 15, 2023' },
      { id: '#MAT-308', topic: 'Trigonometry', questionText: 'Solve for θ in [0°, 360°]: 2sin²θ - sinθ - 1 = 0',                difficulty: 'Hard',   lastModified: 'Sep 12, 2023' },
      { id: '#MAT-133', topic: 'Algebra',      questionText: 'If log₂(x) = 5, find the value of x',                             difficulty: 'Easy',   lastModified: 'Sep 10, 2023' },
      { id: '#MAT-412', topic: 'Calculus',     questionText: 'Find the limit: lim(x→0) [sin(x)/x]',                             difficulty: 'Medium', lastModified: 'Sep 05, 2023' },
      { id: '#MAT-225', topic: 'Statistics',   questionText: 'Calculate the standard deviation of: 2, 4, 4, 4, 5, 5, 7, 9',     difficulty: 'Hard',   lastModified: 'Sep 02, 2023' },
      { id: '#MAT-319', topic: 'Geometry',     questionText: 'Find the equation of a circle with center (3, -4) and radius 6',  difficulty: 'Medium', lastModified: 'Aug 28, 2023' },
      { id: '#MAT-108', topic: 'Algebra',      questionText: 'Solve the system: 2x + 3y = 12 and x - y = 1',                    difficulty: 'Easy',   lastModified: 'Aug 25, 2023' },
      { id: '#MAT-505', topic: 'Statistics',   questionText: 'What is the probability of rolling a sum of 7 with two dice?',     difficulty: 'Medium', lastModified: 'Aug 20, 2023' },
    ],

    Physics: [
      { id: '#PHY-101', topic: 'Mechanics',        questionText: 'A ball is thrown vertically upward with speed 20 m/s. Find the maximum height reached.',          difficulty: 'Easy',   lastModified: 'Oct 11, 2023' },
      { id: '#PHY-204', topic: 'Electromagnetism', questionText: 'State and explain Faraday\'s law of electromagnetic induction.',                                   difficulty: 'Medium', lastModified: 'Oct 09, 2023' },
      { id: '#PHY-312', topic: 'Optics',           questionText: 'A convex lens has focal length 20 cm. Find the image distance for an object 30 cm away.',         difficulty: 'Hard',   lastModified: 'Oct 07, 2023' },
      { id: '#PHY-105', topic: 'Mechanics',        questionText: 'What is Newton\'s second law of motion? Give one real-life example.',                              difficulty: 'Easy',   lastModified: 'Sep 29, 2023' },
      { id: '#PHY-220', topic: 'Thermodynamics',   questionText: 'Explain the first law of thermodynamics with a suitable example.',                                 difficulty: 'Medium', lastModified: 'Sep 27, 2023' },
      { id: '#PHY-315', topic: 'Waves',            questionText: 'A wave has frequency 500 Hz and wavelength 0.6 m. Calculate the speed of the wave.',               difficulty: 'Easy',   lastModified: 'Sep 24, 2023' },
      { id: '#PHY-401', topic: 'Electromagnetism', questionText: 'Derive the expression for the magnetic field at the centre of a circular coil carrying current.',  difficulty: 'Hard',   lastModified: 'Sep 21, 2023' },
      { id: '#PHY-116', topic: 'Mechanics',        questionText: 'A 5 kg object moves with velocity 4 m/s. Calculate its kinetic energy.',                           difficulty: 'Easy',   lastModified: 'Sep 17, 2023' },
      { id: '#PHY-502', topic: 'Optics',           questionText: 'What is total internal reflection? State the conditions required for it.',                          difficulty: 'Medium', lastModified: 'Sep 14, 2023' },
      { id: '#PHY-308', topic: 'Thermodynamics',   questionText: 'An ideal gas undergoes isothermal expansion. How does its internal energy change? Explain.',        difficulty: 'Hard',   lastModified: 'Sep 11, 2023' },
      { id: '#PHY-133', topic: 'Waves',            questionText: 'Define the Doppler effect and give two real-life applications.',                                    difficulty: 'Medium', lastModified: 'Sep 08, 2023' },
      { id: '#PHY-412', topic: 'Electromagnetism', questionText: 'Calculate the force between two charges of 3μC and 5μC separated by 0.2 m in air.',               difficulty: 'Easy',   lastModified: 'Sep 04, 2023' },
      { id: '#PHY-225', topic: 'Modern Physics',   questionText: 'Explain the photoelectric effect and state Einstein\'s equation for it.',                          difficulty: 'Hard',   lastModified: 'Sep 01, 2023' },
      { id: '#PHY-319', topic: 'Optics',           questionText: 'A ray of light travels from water (n=1.33) to air. Find the critical angle.',                      difficulty: 'Medium', lastModified: 'Aug 27, 2023' },
      { id: '#PHY-108', topic: 'Modern Physics',   questionText: 'What is the de Broglie wavelength of an electron moving with velocity 2×10⁶ m/s?',                difficulty: 'Hard',   lastModified: 'Aug 23, 2023' },
      { id: '#PHY-505', topic: 'Thermodynamics',   questionText: 'State the zeroth law of thermodynamics and explain its significance.',                              difficulty: 'Easy',   lastModified: 'Aug 19, 2023' },
    ],

    Chemistry: [
      { id: '#CHE-101', topic: 'Organic Chemistry',   questionText: 'What is the IUPAC name of CH₃-CH₂-CH₂-OH?',                                                         difficulty: 'Easy',   lastModified: 'Oct 10, 2023' },
      { id: '#CHE-204', topic: 'Physical Chemistry',  questionText: 'Calculate the pH of a 0.01 M HCl solution at 25°C.',                                                 difficulty: 'Easy',   lastModified: 'Oct 08, 2023' },
      { id: '#CHE-312', topic: 'Inorganic Chemistry', questionText: 'Explain the hybridisation and geometry of the PCl₅ molecule.',                                       difficulty: 'Hard',   lastModified: 'Oct 06, 2023' },
      { id: '#CHE-105', topic: 'Organic Chemistry',   questionText: 'Draw the structural formula of benzene and explain its aromaticity.',                                 difficulty: 'Medium', lastModified: 'Sep 28, 2023' },
      { id: '#CHE-220', topic: 'Physical Chemistry',  questionText: 'State and explain Hess\'s law of constant heat summation with an example.',                          difficulty: 'Medium', lastModified: 'Sep 26, 2023' },
      { id: '#CHE-315', topic: 'Electrochemistry',    questionText: 'Calculate the EMF of a Daniell cell at 25°C. (E°Cu=+0.34V, E°Zn=-0.76V)',                           difficulty: 'Easy',   lastModified: 'Sep 23, 2023' },
      { id: '#CHE-401', topic: 'Organic Chemistry',   questionText: 'Explain the mechanism of SN2 reaction with a suitable example.',                                     difficulty: 'Hard',   lastModified: 'Sep 20, 2023' },
      { id: '#CHE-116', topic: 'Inorganic Chemistry', questionText: 'What are the anomalous properties of fluorine compared to other halogens?',                          difficulty: 'Medium', lastModified: 'Sep 16, 2023' },
      { id: '#CHE-502', topic: 'Physical Chemistry',  questionText: 'Derive the integrated rate law for a first-order reaction.',                                          difficulty: 'Hard',   lastModified: 'Sep 13, 2023' },
      { id: '#CHE-308', topic: 'Electrochemistry',    questionText: 'State Faraday\'s first and second laws of electrolysis.',                                             difficulty: 'Medium', lastModified: 'Sep 10, 2023' },
      { id: '#CHE-133', topic: 'Inorganic Chemistry', questionText: 'Explain why transition metals exhibit variable oxidation states.',                                    difficulty: 'Medium', lastModified: 'Sep 07, 2023' },
      { id: '#CHE-412', topic: 'Organic Chemistry',   questionText: 'What is Markovnikov\'s rule? Give one example to illustrate it.',                                    difficulty: 'Easy',   lastModified: 'Sep 03, 2023' },
      { id: '#CHE-225', topic: 'Electrochemistry',    questionText: 'How does concentration affect the EMF of a cell? Explain using the Nernst equation.',                difficulty: 'Hard',   lastModified: 'Aug 30, 2023' },
      { id: '#CHE-319', topic: 'Physical Chemistry',  questionText: 'A solution contains 5 g of NaCl in 200 mL. Calculate the molarity.',                                 difficulty: 'Easy',   lastModified: 'Aug 26, 2023' },
      { id: '#CHE-108', topic: 'Inorganic Chemistry', questionText: 'Compare the acidic strengths of HF, HCl, HBr, and HI with reasons.',                                 difficulty: 'Hard',   lastModified: 'Aug 22, 2023' },
      { id: '#CHE-505', topic: 'Organic Chemistry',   questionText: 'Write the reaction of ethanol with sodium metal and explain what is observed.',                       difficulty: 'Easy',   lastModified: 'Aug 18, 2023' },
    ],

  };

  // ─── Topic lists per subject ─────────────────────────────────────────────────
  private topicMap: Record<string, string[]> = {
    Mathematics: ['All Topics', 'Algebra', 'Calculus', 'Geometry', 'Trigonometry', 'Statistics'],
    Physics:     ['All Topics', 'Mechanics', 'Electromagnetism', 'Optics', 'Thermodynamics', 'Waves', 'Modern Physics'],
    Chemistry:   ['All Topics', 'Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Electrochemistry'],
  };

  // ─── Working arrays ──────────────────────────────────────────────────────────
  allQuestions: Question[] = [];
  filteredQuestions: Question[] = [];
  paginatedQuestions: Question[] = [];

  // Filter state
  selectedTopic: string = 'All Topics';
  selectedDifficulty: string = 'All Difficulty';

  // Dropdown visibility
  topicDropdownOpen: boolean = false;
  difficultyDropdownOpen: boolean = false;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 1;
  pageNumbers: (number | string)[] = [];

  // Dynamic topics list (built from topicMap for the current subject)
  topics: string[] = ['All Topics'];
  difficulties: string[] = ['All Difficulty', 'Easy', 'Medium', 'Hard'];

  // Stats
  totalQuestions: number = 0;
  activeTopics: number = 0;
  avgDifficulty: string = 'Intermediate';
  lastUpdate: string = '2h ago';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.subject = params['subject'] || 'Mathematics';
      this.loadSubjectData();
    });
  }

  /** Swap in the correct question bank and topic list for the active subject */
  private loadSubjectData(): void {
    this.allQuestions = (this.questionBank[this.subject] ?? []).slice(); // copy so deletes stay isolated
    this.topics = this.topicMap[this.subject] ?? ['All Topics'];

    // Reset filters on every subject switch
    this.selectedTopic = 'All Topics';
    this.selectedDifficulty = 'All Difficulty';

    this.totalQuestions = this.allQuestions.length;
    this.activeTopics = new Set(this.allQuestions.map(q => q.topic)).size;

    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredQuestions = this.allQuestions.filter(q => {
      const topicMatch = this.selectedTopic === 'All Topics' || q.topic === this.selectedTopic;
      const diffMatch  = this.selectedDifficulty === 'All Difficulty' || q.difficulty === this.selectedDifficulty;
      return topicMatch && diffMatch;
    });

    this.currentPage = 1;
    this.calculatePagination();
    this.updatePage();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredQuestions.length / this.itemsPerPage);
    this.buildPageNumbers();
  }

  buildPageNumbers(): void {
    const pages: (number | string)[] = [];
    if (this.totalPages <= 5) {
      for (let i = 1; i <= this.totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (this.currentPage > 3) pages.push('...');
      for (let i = Math.max(2, this.currentPage - 1); i <= Math.min(this.totalPages - 1, this.currentPage + 1); i++) {
        pages.push(i);
      }
      if (this.currentPage < this.totalPages - 2) pages.push('...');
      pages.push(this.totalPages);
    }
    this.pageNumbers = pages;
  }

  updatePage(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedQuestions = this.filteredQuestions.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.buildPageNumbers();
      this.updatePage();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.buildPageNumbers();
      this.updatePage();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.buildPageNumbers();
      this.updatePage();
    }
  }

  selectTopic(topic: string): void {
    this.selectedTopic = topic;
    this.topicDropdownOpen = false;
    this.applyFilters();
  }

  selectDifficulty(diff: string): void {
    this.selectedDifficulty = diff;
    this.difficultyDropdownOpen = false;
    this.applyFilters();
  }

  toggleTopicDropdown(): void {
    this.topicDropdownOpen = !this.topicDropdownOpen;
    this.difficultyDropdownOpen = false;
  }

  toggleDifficultyDropdown(): void {
    this.difficultyDropdownOpen = !this.difficultyDropdownOpen;
    this.topicDropdownOpen = false;
  }

  closeDropdowns(): void {
    this.topicDropdownOpen = false;
    this.difficultyDropdownOpen = false;
  }

  deleteQuestion(id: string): void {
    if (confirm('Are you sure you want to delete this question?')) {
      this.allQuestions = this.allQuestions.filter(q => q.id !== id);
      // Keep the bank in sync so navigating away and back reflects the deletion
      if (this.questionBank[this.subject]) {
        this.questionBank[this.subject] = this.questionBank[this.subject].filter(q => q.id !== id);
      }
      this.totalQuestions = this.allQuestions.length;
      this.activeTopics = new Set(this.allQuestions.map(q => q.topic)).size;
      this.applyFilters();
    }
  }

  // Placeholder - will be redirected later
  addNewQuestion(): void {
    this.router.navigate(['/subject-upload', this.subject]);
  }

  // Placeholder - will be redirected later
  editQuestion(id: string): void {
    // TODO: redirect to another component
  }

  goBackToSubjects(): void {
    this.router.navigate(['/admin-dashboard']);
  }

  getShowingText(): string {
    if (this.filteredQuestions.length === 0) return 'Showing 0 questions';
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end   = Math.min(this.currentPage * this.itemsPerPage, this.filteredQuestions.length);
    return `Showing ${start}-${end} of ${this.filteredQuestions.length} questions`;
  }

  getDifficultyClass(difficulty: string): string {
    switch (difficulty) {
      case 'Easy':   return 'badge-easy';
      case 'Medium': return 'badge-medium';
      case 'Hard':   return 'badge-hard';
      default:       return '';
    }
  }

  getTopicClass(topic: string): string {
    const map: Record<string, string> = {
      // Mathematics
      'Algebra':            'topic-algebra',
      'Calculus':           'topic-calculus',
      'Geometry':           'topic-geometry',
      'Trigonometry':       'topic-trigonometry',
      'Statistics':         'topic-statistics',
      // Physics
      'Mechanics':          'topic-mechanics',
      'Electromagnetism':   'topic-electromagnetism',
      'Optics':             'topic-optics',
      'Thermodynamics':     'topic-thermodynamics',
      'Waves':              'topic-waves',
      'Modern Physics':     'topic-modern',
      // Chemistry
      'Organic Chemistry':   'topic-organic',
      'Inorganic Chemistry': 'topic-inorganic',
      'Physical Chemistry':  'topic-physical',
      'Electrochemistry':    'topic-electrochemistry',
    };
    return map[topic] ?? 'topic-default';
  }
}
