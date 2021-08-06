/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-nested-callbacks */
import Powers from './powers';
import config from '../../core/config';
import Mock from '../../../test/mock';
import * as random from '@laufire/utils/random';
import TargetManager from '../targetManager';

beforeEach(() => {
	jest.restoreAllMocks();
});

describe('Powers', () => {
	describe('bomb', () => {
		const { bomb } = Powers;
		const randomTargets = Mock.getRandomTargets();
		const { targetsCount } = config.powers.bomb;
		const targets = [Symbol('target')];
		const count = Symbol('count');
		const damage = Symbol('damage');

		test('bomb', () => {
			jest.spyOn(Math,
				'min').mockImplementation(jest.fn(() => count));
			jest.spyOn(random,
				'rndValues').mockImplementation(jest.fn(() =>
				randomTargets));
			jest.spyOn(random,
				'rndBetween').mockImplementation(jest.fn(() => damage));
			jest.spyOn(TargetManager,
				'decreaseTargetLives').mockImplementation(jest.fn(() =>
				targets));

			const result = bomb({ targets });

			expect(Math.min)
				.toHaveBeenCalledWith(targetsCount.max,	targets.length);

			expect(random.rndValues).toHaveBeenCalledWith(targets, count);

			expect(random.rndBetween)
				.toHaveBeenCalledWith(targetsCount.min, targetsCount.max);

			expect(TargetManager.decreaseTargetLives).toHaveBeenCalledWith(
				targets, randomTargets, damage
			);

			expect(result).toMatchObject({ targets });
		});
	});
});