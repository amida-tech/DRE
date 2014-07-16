/**
 * Module dependencies.
 */

module.exports = function (app) {
	require('./match')(app);
	require('./merge')(app);
	require('./notification')(app);
	require('./record')(app);
	require('./storage')(app);
};
