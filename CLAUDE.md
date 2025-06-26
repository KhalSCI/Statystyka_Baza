# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NaukaStat is a Polish-language statistics quiz web application built with vanilla HTML, CSS, and JavaScript. The application presents users with randomized statistics questions from multiple test sets, tracks their performance, and awards achievements based on their results.

## Architecture

### Core Components

- **index.html**: Main HTML structure with three screens (start, game, results)
- **script.js**: Single-file JavaScript application using ES6 class-based architecture
- **style.css**: CSS styling with modern design patterns (gradients, glassmorphism, animations)
- **zadania.json**: Question database containing test sets with questions, options, and correct answers

### Application Flow

1. **StatisticsQuizGame** class manages the entire application lifecycle
2. Questions are loaded from `zadania.json` and flattened into a single array
3. Game selects 10 random questions per session
4. Progress tracking with localStorage for persistent statistics
5. Achievement system with various unlock conditions

### Key Features

- **Multi-screen Interface**: Start screen, game screen, and results screen
- **Question Management**: Loads from JSON, randomizes selection, handles multiple choice
- **Progress Tracking**: Progress bar, question counter, real-time scoring
- **Statistics Persistence**: Best scores, games played, achievements stored in localStorage
- **Achievement System**: Various achievements based on performance metrics
- **Responsive Design**: Modern CSS with animations and glassmorphism effects

## Development Guidelines

### File Structure
- All questions are stored in `zadania.json` with the structure:
  ```json
  {
    "testName": "test - [number]",
    "questions": [
      {
        "question": "Question text",
        "options": {"a": "Option A", "b": "Option B", "c": "Option C"},
        "correct_answer": "a"
      }
    ]
  }
  ```

### JavaScript Architecture
- Main class: `StatisticsQuizGame` in script.js
- Game state managed through class properties
- DOM manipulation through cached element references
- Event handling setup in `setupEventListeners()`
- Data persistence through localStorage with key `naukastat-stats`

### CSS Styling
- Uses Poppins font from Google Fonts
- Gradient background with glassmorphism effects
- Responsive design with flexbox layout
- Animation keyframes for smooth transitions
- Color-coded feedback (green for correct, red for incorrect)

### Question Format
- All questions are in Polish language
- Mathematical formulas may include LaTeX notation
- Questions contain exactly 3 multiple choice options (a, b, c)
- Each question has one correct answer

## Common Development Tasks

### Running the Application
- Open `index.html` in a web browser
- No build process required - runs directly in browser
- Requires local file server for JSON loading in some browsers

### Adding New Questions
- Edit `zadania.json` to add new test sets or questions
- Maintain the existing JSON structure
- Ensure `correct_answer` matches one of the option keys

### Modifying Game Logic
- Main game logic is in the `StatisticsQuizGame` class
- Question randomization in `getRandomQuestions()`
- Scoring logic in `selectAnswer()` method
- Achievement logic in `checkAchievements()`

### Styling Changes
- Modern CSS with custom properties for easy theming
- Responsive breakpoints handle different screen sizes
- Animation timing can be adjusted in keyframe definitions