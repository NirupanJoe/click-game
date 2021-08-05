import config from '../core/config';
import { rndBetween, rndValue } from '@laufire/utils/random';
import { keys } from '@laufire/utils/collection';
import { getRandomX, getRandomY } from './positionService';
import { getId, getVariance, isFuture } from './helperService';
import PowerManager from './powerManager';

const { maxTargets } = config;
const targetTypeKeys = keys(config.targets);

const getTarget = ({ x, y, type } = {}) => {
	const typeConfig = config.targets[type || rndValue(targetTypeKeys)];
	const variance = getVariance(typeConfig.variance);
	const size = {
		height: typeConfig.height * variance,
		width: typeConfig.width * variance,
	};

	return {
		id: getId(),
		x: x !== undefined ? x : getRandomX(size),
		y: y !== undefined ? y : getRandomY(size),
		...typeConfig,
		...size,
	};
};

const moveTargets = ({ targets, frozenTill }) =>
	(isFuture(frozenTill)
		? targets.map((target) => ({
			...target,
			x: getRandomX(target),
			y: getRandomY(target),
		}))
		: targets);

const getTargets = () => targetTypeKeys.map((type) =>
	rndBetween(1, 1 / config.targets[type].prob.add) === 1
	&& getTarget({ type })).filter((val) => val);

const addTargets = (targets) => (targets.length < maxTargets
	? targets.concat(getTargets())
	: targets);

const removeTarget = (targets, target) =>
	targets.filter((current) => current.id !== target.id);

const removeTargets = (targets, targetsToRemove) =>
	targets.filter((target) => !targetsToRemove.includes(target));

const getTargetsScore = (targets) =>
	targets.reduce((acc, target) => acc + target.score, 0);

const decreaseTargetLives = (
	targets, impactedTargets, damage
) => {
	const dataId = impactedTargets.map((impactedTarget) => impactedTarget.id);

	return 	targets.map((target) =>
		(dataId.includes(target.id)
			? {
				...target,
				lives: Math.max(target.lives - damage, 0),
			}
			: target));
};

const getDeadTargets = (targets) =>
	targets.filter((target) => target.lives <= 0);

const swatActionDefault = (state, data) => ({
	targets: decreaseTargetLives(
		state.targets, [data], PowerManager.getDamage(state)
	),
});

const swatActions = {
	butterfly: (state, data) => ({
		lives: state.lives - 1,
		...swatActionDefault(state, data),
	}),
};

const swatTarget = (state, data) =>
	(swatActions[data.type] || swatActionDefault)(state, data);

const TargetManager = {
	moveTargets,
	addTargets,
	getTarget,
	removeTarget,
	removeTargets,
	getTargetsScore,
	decreaseTargetLives,
	getDeadTargets,
	swatTarget,
};

export default TargetManager;
