import createLogger from 'redux-logger';

const logger = createLogger({
	level: 'log',
	collapsed: false,
	predicate: (getState, action) => true
});

export default logger;