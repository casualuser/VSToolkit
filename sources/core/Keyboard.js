/**
  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and 
  contributors. All rights reserved
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.
  
  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

/**
 *  The vs.core.KEYBOARD Object
 * <p>
 * <p>
 *  List of predefined event spec:<br>
 *  <ul>
 *  <li> vs.core.KEYBOARD.KEY_UP
 *  <li> vs.core.KEYBOARD.ESC
 *  <li> vs.core.KEYBOARD.ENTER
 *  <li> vs.core.KEYBOARD.SPACE
 *  <li> vs.core.KEYBOARD.BACKSPACE
 *  <li> vs.core.KEYBOARD.SHIFT
 *  <li> vs.core.KEYBOARD.CTRL
 *  <li> vs.core.KEYBOARD.ALT
 *  <li> vs.core.KEYBOARD.NUMLOCK
 *  <li> vs.core.KEYBOARD.LEFT_ARROW 
 *  <li> vs.core.KEYBOARD.UP_ARROW 
 *  <li> vs.core.KEYBOARD.RIGHT_ARROW
 *  <li> vs.core.KEYBOARD.DOWN_ARROW 
 *  <li> vs.core.KEYBOARD.A
 *  <li> vs.core.KEYBOARD.S
 *  <li> vs.core.KEYBOARD.Z
 *  <li> vs.core.KEYBOARD.META
 *  <li> vs.core.KEYBOARD.ANY_MASK
 *  <li> vs.core.KEYBOARD.UNDO
 *  <li> vs.core.KEYBOARD.REDO
 *  <li> vs.core.KEYBOARD.SAVE
 * </ul>
 *
 *  @type vs.core.EventSource
 *
 * @name vs.core.KEYBOARD
 *  @const
 */
var KEYBOARD = new EventSource ('__KEYBOARD__');

/**
 * @private
 */
KEYBOARD._handler_set_down = false;

/**
 * @private
 */
KEYBOARD._handler_set_up = false;

/**
 *  The event bind method to listen events
 *  <p>
 *  When you want listen an event generated by this object, you can
 *  bind your object (the observer) to this object using 'bind' method.
 *  <p>
 *  Warning:<br>
 *  If you know the process of your callback can take time or can be blocking
 *  you should set delay to 'true' otherwise you application will be stuck.
 *  But be careful this options add an overlay in the event propagation.
 *  For debug purpose or more secure coding you can force delay to true, for
 *  all bind using global variable vs.core.FORCE_EVENT_PROPAGATION_DELAY.<br/>
 *  You just have set as true (vs.core.FORCE_EVENT_PROPAGATION_DELAY = true)
 *  at beginning of your program.
 *
 * @name vs.core.KEYBOARD.bind
 * 
 * @param {string} spec the event specification [mandatory]
 * @param {vs.core.Object} obj the object interested to catch the event [mandatory]
 * @param {string} func the name of a callback. If its not defined
 *        notify method will be called [optional]
 * @param {boolean} delay if true the callback 'func' will be call within 
 *        an other "simili thread". 
 */
function KEYBOARD_bind (keyCode, obj, func, prevent)
{
  var handler = EventSource.prototype.bind.call (this, keyCode, obj, func),
    self = this;
  if (prevent) { handler.prevent = true; }
  if (keyCode > KEYBOARD.KEY_UP)
  {
    if (!this._handler_set_up)
    {
      document.documentElement.addEventListener
        ("keyup", function (event)
      {
        self.managePrevent (event.keyCode, event);
        self.propagate (event.keyCode + KEYBOARD.KEY_UP, event);
      }, false);
      this._handler_set_up = true;
    }
  }
  else
  {
    if (!this._handler_set_down)
    {
      document.documentElement.addEventListener
        ("keydown", function (event)
      {
        if ((event.ctrlKey || event.metaKey) &&
            !event.shiftKey && event.keyCode === KEYBOARD.Z)
        {
          self.propagate (KEYBOARD.UNDO);
          event.preventDefault ();
        }
        else if ((event.ctrlKey || event.metaKey) &&
                  event.shiftKey && event.keyCode === KEYBOARD.Z)
        {
          self.propagate (KEYBOARD.REDO);
          event.preventDefault ();
        }
        else if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.keyCode === KEYBOARD.S)
        {
          self.propagate (KEYBOARD.SAVE);
          event.preventDefault ();
        }
        else if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.keyCode)
        {
          self.managePrevent (KEYBOARD.META + event.keyCode, event);
          self.propagate (KEYBOARD.META + event.keyCode);
          //event.preventDefault ();
        }
        else
        {
          self.managePrevent (event.keyCode, event);
          self.propagate (event.keyCode, event);
        }
      }, false);
      this._handler_set_down = true;
    }
  }
};

/**
 *  @private
 */
KEYBOARD.managePrevent = function (type, event)
{
  var list_bind = this.__bindings__ [type], i, handler;
  if (!list_bind) { return; }
  
  for (i = 0; i < list_bind.length; i++)
  {
    handler = list_bind [i];
    if (handler.prevent)
    {
      event.preventDefault ();
      return;
    }
  }
};

KEYBOARD.KEY_UP = 1000; 
KEYBOARD.ESC = 27;
KEYBOARD.ENTER = 13;
KEYBOARD.SPACE = 32;
KEYBOARD.BACKSPACE = 8;
KEYBOARD.SHIFT = 16;
KEYBOARD.CTRL = 17;
KEYBOARD.ALT = 18;
KEYBOARD.NUMLOCK = 144;

KEYBOARD.LEFT_ARROW = 37;
KEYBOARD.UP_ARROW = 38;
KEYBOARD.RIGHT_ARROW = 39;
KEYBOARD.DOWN_ARROW = 40;

KEYBOARD.L = 76;
KEYBOARD.S = 83;
KEYBOARD.Z = 90;


KEYBOARD.META = 2000;
KEYBOARD.ANY_MASK = 3000;

KEYBOARD.UNDO = 256;
KEYBOARD.REDO = 257;
KEYBOARD.SAVE = 258;

/**
 * @private
 */
core.KEYBOARD = KEYBOARD;
core.KEYBOARD.bind = KEYBOARD_bind;
