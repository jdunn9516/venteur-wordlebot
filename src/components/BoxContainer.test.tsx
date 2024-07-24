// BoxContainer.test.tsx
import { render, screen, fireEvent, act } from '@testing-library/react';
import BoxContainer from './BoxContainer';

describe('BoxContainer', () => {
    const mockOnSubmit = jest.fn();

    beforeEach(() => {
        mockOnSubmit.mockClear();
    });

    test('renders input boxes correctly', () => {
        const { container } = render(
            <BoxContainer
                word={['', '', '', '', '']}
                rowIndex={0}
                onSubmit={mockOnSubmit}
                userCurrentState={0}
                wordForGuess="apple"
            />
        );

        const inputs = container.querySelectorAll('input');
        expect(inputs).toHaveLength(5);
    });

    test('renders input boxes with yellow and white bg correctly', () => {
        const { container } = render(
            <BoxContainer
                word={['l', 'l', 'c', 'e', 'e']}
                rowIndex={0}
                onSubmit={mockOnSubmit}
                userCurrentState={0}
                wordForGuess="apple"
            />
        );

        const inputs = container.querySelectorAll('input');
        expect(inputs).toHaveLength(5);
    });

    test('renders input on suggetion box', () => {
        const { container } = render(
            <BoxContainer
                word={['l', 'l', 'c', 'e', 'e']}
                rowIndex={6}
                onSubmit={mockOnSubmit}
                userCurrentState={0}
                wordForGuess="apple"
            />
        );

        const inputs = container.querySelectorAll('input');
        expect(inputs).toHaveLength(5);
    });


    test('updates input values and focuses next input on change', () => {
        render(
            <BoxContainer
                word={['', '', '', '', '']}
                rowIndex={0}
                onSubmit={mockOnSubmit}
                userCurrentState={0}
                wordForGuess="apple"
            />
        );

        const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];

        fireEvent.change(inputs[0], { target: { value: 'a' } });
        expect(inputs[0].value).toBe('a');

        fireEvent.change(inputs[1], { target: { value: 'p' } });
        expect(inputs[1].value).toBe('p');
    });

    test('focuses previous input on backspace when current input is empty', () => {
        render(
            <BoxContainer
                word={['', '', '', '', '']}
                rowIndex={0}
                onSubmit={mockOnSubmit}
                userCurrentState={0}
                wordForGuess="apple"
            />
        );

        const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];

        fireEvent.change(inputs[0], { target: { value: 'a' } });
        fireEvent.keyDown(inputs[1], { key: 'Backspace', code: 'Backspace' });
    });

    test('calls onSubmit with correct parameters when Enter is pressed', () => {
        render(
            <BoxContainer
                word={['a', 'p', 'p', 'l', 'e']}
                rowIndex={0}
                onSubmit={mockOnSubmit}
                userCurrentState={0}
                wordForGuess="apple"
            />
        );

        const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];

        // Simulate typing the complete word
        fireEvent.change(inputs[0], { target: { value: 'a' } });
        fireEvent.change(inputs[1], { target: { value: 'p' } });
        fireEvent.change(inputs[2], { target: { value: 'p' } });
        fireEvent.change(inputs[3], { target: { value: 'l' } });
        fireEvent.change(inputs[4], { target: { value: 'e' } });

        fireEvent.keyDown(inputs[4], { key: 'Enter', code: 'Enter' });

        expect(mockOnSubmit).toHaveBeenCalledWith(0, ['a', 'p', 'p', 'l', 'e']);
    });
});
