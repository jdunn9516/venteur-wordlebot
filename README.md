# WordleBot - Key Components and Implementation

## Review Project on your local
- Install packages
`npm install`

- Run Project
`npm start`

- Test Project
`npm test`

- Build Project
`npm build`

## 1. App Component

### State Management:

- `wordForGuess`: Stores the word that the user needs to guess.
- `loading`, `isFetching`: Booleans to manage loading states.
- `suggestions`: Stores suggestions fetched from an external source.
- `status`: An object to hold the status of the game (e.g., error, win, lose).
- `userGuessInput`: An array to hold the user's guesses.
- `userCurrentState`, `userCurrentStateShow`: Track the user's current guess attempt.

### Effect Hook:

- `useEffect`: Fetches a random word and initializes the suggestions on component mount.

### Handlers:

- `handleGuessSubmit`: Manages the submission of user guesses, updates the game state, and checks if the guess is correct.
- `submitHelp`: Fetches suggestions based on the user's guesses and updates the state accordingly.

### Rendering:

- Conditional rendering based on the loading state.
- Displays the current guess number and the input fields for user guesses.
- Displays status messages for win, lose, and error states.

## 2. BoxContainer Component

### Props:

- `word`, `rowIndex`, `onSubmit`, `userCurrentState`, `wordForGuess`: Various props to handle the state and behavior of each row of input fields.

### State Management:

- `inputs`: Local state to manage the input values in each box.
- `inputRefs`: A ref array to manage focus on input fields.

### Effect Hook:

Updates the `inputs` state based on the `word` prop.

### Handlers:

- `handleChange`: Manages changes in input fields, updates the state, and auto-focuses the next input field.
- `handleKeyDown`: Handles key events, like backspace and enter, to navigate between input fields and submit the guess.

### Helper Functions:

- `getColor`: Determines the background color of input fields based on the guess correctness (green for correct, yellow for present, white otherwise).

### Rendering:

Renders a set of input fields with dynamic styles and behaviors based on the game state and user interactions.

# Design Considerations

## 1. User Interaction:

- The user inputs guesses through a series of input fields.
- The game provides immediate feedback on the guess through color changes.
- The 'Enter' key checks the guess, and the 'Backspace' key navigates back when necessary.

## 2. State Management:

- The application uses React's state and effect hooks to manage the game state and side effects.
- The main state is managed in the `App` component, while local state management for input fields is handled in the `BoxContainer` component.

## 3. Component Reusability:

- The `BoxContainer` component is reusable and can be used for both displaying suggestions and taking user input.
- The `App` component orchestrates the game logic and user interactions.

# Demo Link
Please visit this link.

https://wordlebot.netlify.app 

