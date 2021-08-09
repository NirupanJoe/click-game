/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-nested-callbacks */
import Powers from './powers';
import config from '../../core/config';
import Mock from '../../../test/mock';
import * as random from '@laufire/utils/random';
import * as helper from '../helperService';
import TargetManager from '../targetManager';

beforeEach(() => {
	jest.restoreAllMocks();
});

describe('Powers', () => {
	const { bomb, ice, superBat, spoiler } = Powers;

	describe('bomb', () => {
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
				.toHaveBeenCalledWith(targetsCount.max, targets.length);

			expect(random.rndValues).toHaveBeenCalledWith(targets, count);

			expect(random.rndBetween)
				.toHaveBeenCalledWith(targetsCount.min, targetsCount.max);

			expect(TargetManager.decreaseTargetLives).toHaveBeenCalledWith(
				targets, randomTargets, damage
			);

			expect(result).toMatchObject({ targets });
		});
	});

	describe('ice', () => {
		const newTime = Symbol('newTime');
		const frozenTill = Symbol('frozenTill');
		const state = {
			frozenTill,
		};
		const frozenDuration = Symbol('frozenDuration');
		const { duration } = config.powers.ice;
		const second = 'seconds';

		test('ice return the frozenTill', () => {
			jest.spyOn(helper, 'adjustTime')
				.mockImplementation(jest.fn(() => newTime));

			jest.spyOn(random, 'rndBetween')
				.mockImplementation(jest.fn(() => frozenDuration));

			const result = ice(state);

			expect(random.rndBetween)
				.toHaveBeenCalledWith(duration.min, duration.max);
			expect(helper.adjustTime)
				.toHaveBeenCalledWith(
					frozenTill, frozenDuration, second
				);
			expect(result).toMatchObject({
				frozenTill: newTime,
			});
		});
	});

	describe('superBat', () => {
		const newTime = Symbol('newTime');
		const superTill = Symbol('superTill');
		const state = {
			superTill,
		};
		const { duration } = config.powers.superBat;
		const second = 'seconds';

		test('superBat return the superTill', () => {
			jest.spyOn(helper, 'adjustTime')
				.mockImplementation(jest.fn(() => newTime));

			const result = superBat(state);

			expect(helper.adjustTime)
				.toHaveBeenCalledWith(
					superTill, duration, second
				);
			expect(result).toMatchObject({
				superTill: newTime,
			});
		});
	});

	describe('spoiler', () => {
		const score = 10;
		const state = {
			score,
		};
		const reduceScore = 3;
		const { min, max } = config.powers.spoiler.score;

		test('spoiler reduce the score', () => {
			jest.spyOn(random, 'rndBetween')
				.mockImplementation(jest.fn(() => reduceScore));
			const result = spoiler(state);

			expect(result).toMatchObject({
				score: score - reduceScore,
			});
			expect(random.rndBetween)
				.toHaveBeenCalledWith(min, max);
		});
	});
});
