// TODO: write the test,  desc: component renders the appropriate icon
jest.mock('../core/context', () => ({ state: { lives: 2 }}));
import { render } from '@testing-library/react';

// import context from '../core/context';
import Lives from './lives';

describe('Lives', () => {
	test('renders the component with appropriate styling', () => {
		const { getByRole } = render(Lives());

		const component = getByRole('lives');

		expect(component).toBeInTheDocument();
		expect(component).toHaveStyle({
			position: 'absolute',
			top: '0%',
			right: '0%',
			background: 'silver',
			fontSize: '4vw',
			textAlign: 'center',
		});
	});
});
