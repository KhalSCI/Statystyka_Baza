class StatisticsQuizGame {
    constructor() {
        this.questions = [];
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.gameStarted = false;
        
        // Game state
        this.gameStats = this.loadGameStats();
        
        // DOM elements
        this.startScreen = document.getElementById('startScreen');
        this.gameScreen = document.getElementById('gameScreen');
        this.resultsScreen = document.getElementById('resultsScreen');
        this.startButton = document.getElementById('startButton');
        this.questionText = document.getElementById('questionText');
        this.optionsContainer = document.getElementById('optionsContainer');
        this.feedback = document.getElementById('feedback');
        this.nextButton = document.getElementById('nextButton');
        this.progressFill = document.getElementById('progressFill');
        this.questionCounter = document.getElementById('questionCounter');
        this.currentScore = document.getElementById('currentScore');
        
        // Results elements
        this.resultsIcon = document.getElementById('resultsIcon');
        this.resultsTitle = document.getElementById('resultsTitle');
        this.finalScore = document.getElementById('finalScore');
        this.correctAnswersEl = document.getElementById('correctAnswers');
        this.wrongAnswersEl = document.getElementById('wrongAnswers');
        this.accuracy = document.getElementById('accuracy');
        this.achievementsList = document.getElementById('achievementsList');
        this.playAgainButton = document.getElementById('playAgainButton');
        this.backToMenuButton = document.getElementById('backToMenuButton');
        
        // Stats display
        this.bestScore = document.getElementById('bestScore');
        this.gamesPlayed = document.getElementById('gamesPlayed');
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadQuestions();
            this.setupEventListeners();
            this.updateStatsDisplay();
        } catch (error) {
            console.error('Error initializing game:', error);
            alert('Błąd wczytywania pytań. Sprawdź czy plik zadania.json istnieje.');
        }
    }
    
    async loadQuestions() {
        try {
            const response = await fetch('./zadania.json');
            if (!response.ok) {
                throw new Error('Failed to load questions');
            }
            const data = await response.json();
            
            // Flatten all questions from all tests
            this.questions = [];
            data.forEach(test => {
                if (test.questions && Array.isArray(test.questions)) {
                    this.questions.push(...test.questions);
                }
            });
            
            if (this.questions.length === 0) {
                throw new Error('No questions found');
            }
            
            console.log(`Loaded ${this.questions.length} questions`);
        } catch (error) {
            console.error('Error loading questions:', error);
            throw error;
        }
    }
    
    setupEventListeners() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.nextButton.addEventListener('click', () => this.nextQuestion());
        this.playAgainButton.addEventListener('click', () => this.startGame());
        this.backToMenuButton.addEventListener('click', () => this.showStartScreen());
    }
    
    loadGameStats() {
        const stats = localStorage.getItem('naukastat-stats');
        return stats ? JSON.parse(stats) : {
            bestScore: 0,
            gamesPlayed: 0,
            totalCorrect: 0,
            totalQuestions: 0,
            achievements: []
        };
    }
    
    saveGameStats() {
        localStorage.setItem('naukastat-stats', JSON.stringify(this.gameStats));
    }
    
    updateStatsDisplay() {
        this.bestScore.textContent = `${this.gameStats.bestScore}/10`;
        this.gamesPlayed.textContent = this.gameStats.gamesPlayed;
    }
    
    startGame() {
        this.gameStarted = true;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        
        // Select 10 random questions
        this.currentQuestions = this.getRandomQuestions(10);
        
        this.showGameScreen();
        this.displayQuestion();
    }
    
    getRandomQuestions(count) {
        const shuffled = [...this.questions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, this.questions.length));
    }
    
    showStartScreen() {
        this.startScreen.classList.add('active');
        this.gameScreen.classList.remove('active');
        this.resultsScreen.classList.remove('active');
    }
    
    showGameScreen() {
        this.startScreen.classList.remove('active');
        this.gameScreen.classList.add('active');
        this.resultsScreen.classList.remove('active');
    }
    
    showResultsScreen() {
        this.startScreen.classList.remove('active');
        this.gameScreen.classList.remove('active');
        this.resultsScreen.classList.add('active');
    }
    
    displayQuestion() {
        const question = this.currentQuestions[this.currentQuestionIndex];
        
        // Update progress
        const progress = ((this.currentQuestionIndex + 1) / this.currentQuestions.length) * 100;
        this.progressFill.style.width = `${progress}%`;
        this.questionCounter.textContent = `${this.currentQuestionIndex + 1}/${this.currentQuestions.length}`;
        
        // Update score display
        this.currentScore.textContent = this.score;
        
        // Display question
        this.questionText.innerHTML = question.question;
        
        // Display options
        this.optionsContainer.innerHTML = '';
        const options = Object.entries(question.options);
        
        options.forEach(([key, value]) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.innerHTML = `${key.toUpperCase()}) ${value}`;
            optionElement.dataset.answer = key;
            
            optionElement.addEventListener('click', () => this.selectAnswer(key, optionElement));
            
            this.optionsContainer.appendChild(optionElement);
        });
        
        // Hide feedback
        this.feedback.classList.add('hidden');
        
        // Re-render MathJax for new content
        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise();
        }
    }
    
    selectAnswer(selectedAnswer, optionElement) {
        const question = this.currentQuestions[this.currentQuestionIndex];
        const correctAnswer = question.correct_answer;
        const isCorrect = selectedAnswer === correctAnswer;
        
        // Disable all options
        const allOptions = this.optionsContainer.querySelectorAll('.option');
        allOptions.forEach(option => {
            option.style.pointerEvents = 'none';
            
            if (option.dataset.answer === correctAnswer) {
                option.classList.add('correct');
            } else if (option === optionElement && !isCorrect) {
                option.classList.add('incorrect');
            }
        });
        
        // Update score and stats
        if (isCorrect) {
            this.score += 10;
            this.correctAnswers++;
        } else {
            this.wrongAnswers++;
        }
        
        // Show feedback
        this.showFeedback(isCorrect);
    }
    
    showFeedback(isCorrect) {
        const feedbackIcon = document.getElementById('feedbackIcon');
        const feedbackText = document.getElementById('feedbackText');
        
        this.feedback.classList.remove('hidden', 'correct', 'incorrect');
        
        if (isCorrect) {
            this.feedback.classList.add('correct');
            feedbackIcon.textContent = '🎉';
            feedbackText.textContent = 'Świetnie! Poprawna odpowiedź!';
        } else {
            this.feedback.classList.add('incorrect');
            feedbackIcon.textContent = '❌';
            feedbackText.textContent = 'Nie tym razem. Spróbuj jeszcze raz!';
        }
        
        // Update next button text
        if (this.currentQuestionIndex === this.currentQuestions.length - 1) {
            this.nextButton.textContent = 'Zobacz wyniki';
        } else {
            this.nextButton.textContent = 'Następne pytanie';
        }
    }
    
    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex >= this.currentQuestions.length) {
            this.endGame();
        } else {
            this.displayQuestion();
        }
    }
    
    endGame() {
        // Update game stats
        this.gameStats.gamesPlayed++;
        this.gameStats.totalCorrect += this.correctAnswers;
        this.gameStats.totalQuestions += this.currentQuestions.length;
        
        if (this.correctAnswers > this.gameStats.bestScore) {
            this.gameStats.bestScore = this.correctAnswers;
        }
        
        // Check for achievements
        const newAchievements = this.checkAchievements();
        
        this.saveGameStats();
        this.showResults(newAchievements);
    }
    
    checkAchievements() {
        const achievements = [];
        const accuracy = (this.correctAnswers / this.currentQuestions.length) * 100;
        
        // Perfect score achievement
        if (this.correctAnswers === 10 && !this.gameStats.achievements.includes('perfect')) {
            achievements.push({
                id: 'perfect',
                icon: '🏆',
                title: 'Perfekcja!',
                description: 'Uzyskałeś 100% poprawnych odpowiedzi!'
            });
            this.gameStats.achievements.push('perfect');
        }
        
        // First game achievement
        if (this.gameStats.gamesPlayed === 1 && !this.gameStats.achievements.includes('first-game')) {
            achievements.push({
                id: 'first-game',
                icon: '🎯',
                title: 'Pierwszy krok',
                description: 'Ukończyłeś swoją pierwszą grę!'
            });
            this.gameStats.achievements.push('first-game');
        }
        
        // High accuracy achievement
        if (accuracy >= 80 && !this.gameStats.achievements.includes('high-accuracy')) {
            achievements.push({
                id: 'high-accuracy',
                icon: '🎖️',
                title: 'Ekspert',
                description: 'Uzyskałeś co najmniej 80% poprawnych odpowiedzi!'
            });
            this.gameStats.achievements.push('high-accuracy');
        }
        
        // Dedication achievement
        if (this.gameStats.gamesPlayed >= 10 && !this.gameStats.achievements.includes('dedication')) {
            achievements.push({
                id: 'dedication',
                icon: '💪',
                title: 'Wytrwałość',
                description: 'Zagrałeś co najmniej 10 gier!'
            });
            this.gameStats.achievements.push('dedication');
        }
        
        // Scholar achievement
        if (this.gameStats.totalCorrect >= 50 && !this.gameStats.achievements.includes('scholar')) {
            achievements.push({
                id: 'scholar',
                icon: '📚',
                title: 'Uczony',
                description: 'Odpowiedź poprawnie na co najmniej 50 pytań!'
            });
            this.gameStats.achievements.push('scholar');
        }
        
        return achievements;
    }
    
    showResults(newAchievements) {
        const accuracy = Math.round((this.correctAnswers / this.currentQuestions.length) * 100);
        
        // Set results icon and title based on performance
        if (accuracy === 100) {
            this.resultsIcon.textContent = '🏆';
            this.resultsTitle.textContent = 'PERFEKCJA!';
        } else if (accuracy >= 80) {
            this.resultsIcon.textContent = '🎉';
            this.resultsTitle.textContent = 'ŚWIETNIE!';
        } else if (accuracy >= 60) {
            this.resultsIcon.textContent = '👍';
            this.resultsTitle.textContent = 'DOBRZE!';
        } else if (accuracy >= 40) {
            this.resultsIcon.textContent = '📈';
            this.resultsTitle.textContent = 'MOŻNA LEPIEJ';
        } else {
            this.resultsIcon.textContent = '💪';
            this.resultsTitle.textContent = 'NASTĘPNYM RAZEM!';
        }
        
        // Set final score
        this.finalScore.textContent = `${this.correctAnswers}/${this.currentQuestions.length}`;
        
        // Set breakdown stats
        this.correctAnswersEl.textContent = this.correctAnswers;
        this.wrongAnswersEl.textContent = this.wrongAnswers;
        this.accuracy.textContent = `${accuracy}%`;
        
        // Show achievements
        this.achievementsList.innerHTML = '';
        if (newAchievements.length > 0) {
            newAchievements.forEach(achievement => {
                const achievementEl = document.createElement('div');
                achievementEl.className = 'achievement';
                achievementEl.innerHTML = `
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-title">${achievement.title}</div>
                    <div class="achievement-description">${achievement.description}</div>
                `;
                this.achievementsList.appendChild(achievementEl);
            });
        } else {
            this.achievementsList.innerHTML = '<p style="text-align: center; color: #666;">Brak nowych osiągnięć</p>';
        }
        
        this.showResultsScreen();
        this.updateStatsDisplay();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new StatisticsQuizGame();
});