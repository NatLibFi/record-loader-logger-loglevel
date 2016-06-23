/**
 *
 * @licstart  The following is the entire license notice for the JavaScript code in this file. 
 *
 * Loglevel logger implementation for recordLoader
 *
 * Copyright (c) 2015-2016 University Of Helsinki (The National Library Of Finland)
 *
 * This file is part of record-loader-logger-loglevel
 *
 * record-loader-prototypes is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *  
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this file.
 *
 **/

/* istanbul ignore next: umd wrapper */
(function (root, factory) {

    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['loglevel', 'loglevel-std-streams', 'loglevel-message-prefix'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('loglevel'), require('loglevel-std-streams'), require('loglevel-message-prefix'));
    }

}(this, factory));

function factory(log, loglevelStdStreams, loglevelMessagePrefix) {

    'use strict';

    return function(parameters_factory) {
	return function(parameters, module_name)
	{

	    function loadPlugins()
	    {

		var messagePrefixParameters = {};

		loglevelStdStreams(logger);

		if (Array.isArray(parameters_factory.prefixes)) {
		    messagePrefixParameters.prefixes = parameters_factory.prefixes.filter(function(prefix) {
			return prefix !== 'module';
		    });
		}

		if (module_name !== undefined && parameters_factory.prefixes.indexOf('module') >= -1) {
		    messagePrefixParameters.staticPrefixes = [module_name];
		}

		loglevelMessagePrefix(logger, messagePrefixParameters);

	    }

	    var logger = log.getLogger(module_name === undefined ? 'root' : module_name);

	    loadPlugins();
	    logger.setLevel(parameters_factory.level);

	    return {
		error: function(message)
		{
		    logger.error(message);
		},
		warn: function(message)
		{
		    logger.warn(message);
		},
		info: function(message)
		{
		    logger.info(message);
		},
		debug: function(message)
		{
		    logger.debug(message);
		},
		trace: function(message)
		{
		    logger.trace(message);
		}
	    };
	
	};
    };

}
