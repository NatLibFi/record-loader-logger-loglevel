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
 * record-loader-logger-loglevel is free software: you can redistribute it and/or modify
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
    define([
      'es6-polyfills/lib/polyfills/object',
      'loglevel',
      'loglevel-message-buffer',
      'loglevel-message-prefix',
      'loglevel-std-streams',
      'record-loader-prototypes/lib/logger/prototype'
    ], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('es6-polyfills/lib/polyfills/object'),
      require('loglevel'),
      require('loglevel-message-buffer'),
      require('loglevel-message-prefix'),
      require('loglevel-std-streams'),
      require('record-loader-prototypes/lib/logger/prototype')
    );
  }

}(this, factory));

function factory(Object, loglevel, messageBufferPlugin, messagePrefixPlugin, stdStreamsPlugin, loggerFactory) {

  'use strict';
  
  return function(parameters)
  {

    /**
     * Used for unit tests
     */
    var fn_mock_plugin = arguments.length === 2 && typeof arguments[1] === 'function' ? arguments[1] : undefined;

    function getLogger(name)
    {

      var logger = loglevel.getLogger(name || 'root');

      return messagePrefixPlugin(logger, Object.assign(parameters, {
        prefixFormat: '[%p' + (name ? ' ' + name : '') + ']:'
      }));

    }

    function create(name)
    {

      var auto_flush, level,
      obj = loggerFactory(),
      logger = getLogger(name);

      function log(message, message_level)
      {

        logger[message_level](message);
        
        if (auto_flush) {
          logger.flush();
        }

        return obj;

      }

      name = name || '';

      return Object.assign(obj, {
        setLevel: function(level_arg)
        {
          level = level_arg;
          logger.setLevel(level === 'warning' ? 'warn' : level);
          return obj;
        },
        error: function(message)
        {
          return log(message, 'error');
        },
        warning: function(message)
        {
          return log(message, 'warn');
        },
        info: function(message)
        {
          return log(message, 'info');
        },
        debug: function(message)
        {
          return log(message, 'debug');
        },
        getLevel: function()
        {
          return level;
        },
        setAutoFlush: function(toggle)
        {
          auto_flush = toggle;
          return obj;
        },
        flush: function()
        {
          logger.flush();
          return obj;
        },
        createInstance: function(name)
        {
          if (name) {
            return Object.assign(create(name), {
              getName: function()
              {
                return name;
              }
            }).setLevel(level);
          } else {
            throw new Error('Name must be provided');
          }
        }
      });

    }

    parameters = typeof parameters === 'object' ? JSON.parse(JSON.stringify(parameters)) : {};
    loglevel = fn_mock_plugin ? fn_mock_plugin(loglevel) : loglevel;
    loglevel = stdStreamsPlugin(messageBufferPlugin(loglevel));

    return create();

  };

}
