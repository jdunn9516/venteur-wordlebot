// App.test.tsx
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from './App';
import { fetchWordleResult } from './api/api';

jest.mock('./api/api', () => ({
  fetchWordleResult: jest.fn(),
}));

jest.mock('./lib/helper.ts', () => ({
  getRandomWord: jest.fn(() => 'apple'),
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading spinner initially', () => {
    // Simulate initial state
    (fetchWordleResult as jest.Mock).mockResolvedValueOnce({ guess: 'apple' });

    render(<App />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays loading spinner initially', () => {
    // Simulate initial state
    (fetchWordleResult as jest.Mock).mockRejectedValueOnce({});

    render(<App />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders components and hides loading spinner when data is loaded', async () => {
    (fetchWordleResult as jest.Mock).mockResolvedValueOnce({ guess: 'apple' });

    render(<App />);
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    expect(screen.getByText('Guess #1')).toBeInTheDocument();
    expect(screen.getByText('Word to Guess:')).toBeInTheDocument();
  });


  test('displays error message on API failure', async () => {
    (fetchWordleResult as jest.Mock).mockRejectedValueOnce(new Error('API error'));

    render(<App />);
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    expect(screen.getByText('Error: API error')).toBeInTheDocument();
  });

  test('call bot api', async () => {
    (fetchWordleResult as jest.Mock).mockResolvedValueOnce({ guess: 'apple' });
    render(<App />);
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    const inputs = await screen.findAllByRole('textbox') as unknown as HTMLInputElement[];
    fireEvent.change(inputs[5], { target: { value: 's' } });
    fireEvent.change(inputs[6], { target: { value: 'p' } });
    fireEvent.change(inputs[7], { target: { value: 'o' } });
    fireEvent.change(inputs[8], { target: { value: 'r' } });
    fireEvent.change(inputs[9], { target: { value: 't' } });

    // Submit the guess
    fireEvent.keyDown(inputs[9], { key: 'Enter', code: 'Enter', charCode: 13 });
    
    (fetchWordleResult as jest.Mock).mockResolvedValueOnce({ guess: 'splac' });
    const apiFetch = screen.getByText('Submit');
    fireEvent.click(apiFetch);

  });

  test('handles win states', async () => {
    (fetchWordleResult as jest.Mock).mockResolvedValueOnce({ guess: 'apple' });
    render(<App />);
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    const inputs = await screen.findAllByRole('textbox') as unknown as HTMLInputElement[];
    fireEvent.change(inputs[5], { target: { value: 'a' } });
    fireEvent.change(inputs[6], { target: { value: 'p' } });
    fireEvent.change(inputs[7], { target: { value: 'p' } });
    fireEvent.change(inputs[8], { target: { value: 'l' } });
    fireEvent.change(inputs[9], { target: { value: 'e' } });

    // Submit the guess
    fireEvent.keyDown(inputs[9], { key: 'Enter', code: 'Enter', charCode: 13 });

    await waitFor(() => {
      expect(screen.getByText('Yay! You guessed the word!')).toBeInTheDocument();
    });
  });


  test('handles losing states', async () => {
    (fetchWordleResult as jest.Mock).mockResolvedValueOnce({ guess: 'sport' });

    render(<App />);
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];

    for (let index = 0; index < inputs.length; index++) {
      if (index > 4) {
        fireEvent.change(inputs[index], { target: { value: 'a' } });
        if (index % 4) {
          fireEvent.keyDown(inputs[index], { key: 'Enter', code: 'Enter' });
        }
      }
    }

    await waitFor(() => expect(screen.getByText('Sorry, you have no more guesses left.')).toBeInTheDocument());
  });
});
