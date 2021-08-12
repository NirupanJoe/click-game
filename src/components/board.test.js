import { render, fireEvent } from '@testing-library/react';

import context from '../core/context';
import Board from './board';

describe('Board', () => {
	const { actions } = context;

	test('renders the component with appropriate classes', () => {
		const component = render(Board()).getByRole('board');

		expect(component).toBeInTheDocument();
		expect(component).toHaveClass('board');
	});

	test('when clicked triggers the action, decreaseLives', () => {
		jest.spyOn(actions, 'decreaseLives').mockImplementation();

		const component = render(Board()).getByRole('board');

		fireEvent.click(component);

		expect(actions.decreaseLives).toHaveBeenCalled();
	});
});
