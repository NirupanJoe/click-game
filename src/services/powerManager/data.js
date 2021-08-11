import config from '../../core/config';

const damage = {
	super: config.powers.superBat.swatDamage,
	normal: config.swatDamage,
};

const stateKeysToPowers = {
	frozenTill: 'ice',
	superTill: 'superBat',
};

export {
	damage,
	stateKeysToPowers,
};
