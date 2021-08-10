import { rndBetween } from '@laufire/utils/random';
import { keys } from '@laufire/utils/collection';
import config from '../../core/config';
import { getRandomX, getRandomY } from '../positionService';
import { getId, isFuture } from '../helperService';
import Powers from './powers';
import { damage } from './data';

const powerKeys = keys(config.powers);

const getPower = ({ type }) => {
	const typeConfig = config.powers[type];

	return {
		id: getId(),
		x: getRandomX(typeConfig),
		y: getRandomY(typeConfig),
		...typeConfig,
	};
};

const getPowers = () => powerKeys.map((type) =>
	rndBetween(1,
		1 / config.powers[type].prob.add) === 1
		&& getPower({ type })).filter((value) => value);

const addPowers = (powers) => powers.concat(getPowers());

const hasPowerExpired = (data) =>
	rndBetween(1, 1 / data.prob.remove) === 1;

const removeExpiredPowers = (powers) => powers.filter((data) =>
	!hasPowerExpired(data));

const activatePower = (state, data) => Powers[data.type](state);

const removePower = (powers, data) =>
	powers.filter((current) => current.id !== data.id);

const getBatType = ({ superTill }) => (
	isFuture(superTill) ? 'super' : 'normal');

const getDamage = (state) => damage[getBatType(state)];

const isFrozen = ({ frozenTill }) => isFuture(frozenTill);

const activePowersStateKeys = {
	frozenTill: 'ice',
	superTill: 'superBat',
};

const getActivePowers = ({ state }) => keys(activePowersStateKeys)
	.filter((stateKey) => isFuture(state[stateKey]))
	.map((stateKey) => activePowersStateKeys[stateKey]);

const PowerManager = {
	getPower,
	addPowers,
	removeExpiredPowers,
	activatePower,
	removePower,
	getBatType,
	getDamage,
	isFrozen,
	getActivePowers,
};

export default PowerManager;
