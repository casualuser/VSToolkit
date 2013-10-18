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
 *  All application inherit from Application class.<br/>
 *  This is the root component from which all other components (widgets, ...)
 *  are dependent on.
 *  @class
 *  All application inherit from Application class. <br/>
 *  This is the root component from which all other components (widgets, ...)
 *  are dependent on.
 *  <p>
 *  The class offers you a set of usefull method for laoding
 *  Javascript or CSS, know the current GUI orientation...
 *  <p>
 *  You should not create your own Application instante, because it is
 *  automatically generated by ViniSketch Designer.
 *
 *  @author David Thevenin
 *
 *  @extends vs.ui.View
 * @name vs.ui.Application
 *  @constructor
 *  Main constructor
 *
 * @param {string} type the event type [optional]
*/
var Application = function (config)
{
  this._layout = undefined;
  
  this.parent = View;
  this.parent (config);
  this.constructor = Application;
};

/**
 * @private
 * @const
 */
Application.CSS_DEFAULT = 0;

/**
 * @private
 * @const
 */
Application.CSS_IOS = 5;

/**
 * @private
 * @const
 */
Application.CSS_ANDROID = 9;

/**
 * @private
 * @const
 */
Application.CSS_MEEGO = 10;

/**
 * @private
 * @const
 */
Application.CSS_WP7 = 6;

/**
 * @private
 * @const
 */
Application.CSS_SYMBIAN = 8;

/**
 * @private
 * @const
 */
Application.CSS_BLACKBERRY = 7;

/**
 * @private
 * @const
 */
Application.CSS_PURE = 100;

/**
 * @private
 */
var Application_applications = {};

var ORIENTATION_CHANGE_EVT =
  'onorientationchange' in window ? 'orientationchange' : 'resize';

vs.Application_applications = Application_applications;

Application.prototype = {
  
  /*****************************************************************
   *                Private members
   ****************************************************************/

  /**
   * @protected
   * @type {boolean}
   */
  _prevent_scroll : true,

  /*****************************************************************
   *
   ****************************************************************/
  /**
   * @protected
   * @function
   */
  initComponent : function ()
  {
    Application_applications [this.id] = this;

    View.prototype.initComponent.call (this);
    this.preventScroll = true;

    if (this.view instanceof HTMLHtmlElement)
    {
      var html = this.view;
      html._comp_ = undefined;
    
      // by default select the body element
      this.view = html.querySelector ('body');
      if (!this.view)
      {
        console.error ("Invalid Application view");
        return;
      }
      this.view._comp_ = this;

      html.removeAttribute ('id');
      html.removeAttribute ('x-hag-ref');
      html.removeAttribute ('x-hag-comp');
    }
    this.view.setAttribute ('id', this.id);
    this.view.setAttribute ('x-hag-ref', this.id);
    this.view.setAttribute ('x-hag-comp', this.id);

    var self = this;
    window.addEventListener (ORIENTATION_CHANGE_EVT, function (e)
    {
      var target_id =
        window.deviceConfiguration.setOrientation (window.orientation);
      if (target_id) {
        self.propagate ('deviceChanged', target_id, null, true);
      }
    });
  },
  
  /**
   * Exit and terminate the application.
   * @name vs.ui.Application#exit 
   * @function
   */
  exit : function ()
  {
    Application.exit ()
  },
  
  /**
   * @protected
   * @name vs.ui.Application#applicationStarted 
   * @function
   */
  applicationStarted : function ()
  { },
  
  /**
   * @protected
   * @function
   */
  _updateSizeAndPos: function ()
  {
    this.view.style.width = this._size[0] + 'px';;
    this.view.style.height = this._size[1] + 'px';;
    this.view.style.right = 'auto';
    this.view.style.bottom = 'auto';

    this.view.style.left = this._pos[0] + 'px';
    this.view.style.top = this._pos[1] + 'px';
    this.view.style.right = 'auto';
    this.view.style.bottom = 'auto';
  },
  
  /**
   * Sets the active stylesheet for the HTML document according to
   * the specified pid.
   *
   * @private
   *
   * @name vs.ui.Application#setActiveStyleSheet 
   * @function
   * @param {string} title
   */
  setActiveStyleSheet : function (pid)
  {
    Application.setActiveStyleSheet (pid);
    this.propagate ('deviceChanged', pid, null, true);
  },
  
  /**
   * @protected
   *
   * @name vs.ui.Application#orientationWillChange 
   * @function
   * @param {number} orientation = {0, 180, -90, 90}
   */
  orientationWillChange: function (orientation)
  { },
    
  /**
   *  Dynamically load a script into your application.
   *  <p/>
   *  When the download is completed, the event 'scriptloaded' is fired. <br/>
   *  If a error occurs, nothing happend, then you have to manage by
   *  your own possible error load.
   *  <p/>
   *  The callback function will receive as parameter a event like that:<br/>
   *  {type: 'scriptloaded', data: path}
   *  <p/>
   *  @example
   *  myApp.bind ('scriptloaded', ...);
   *  myApp.loadScript ("resources/other.css");
   *
   * @name vs.ui.Application#loadScript 
   * @function
   * @param {string} path the script url [mandatory]
   */
  loadScript : function (path)
  {
    var self = this, endScriptLoad = function (path)
    {
      var i, l, data, ab_event;
      if (!path) { return; }
      
      self.propagate ('scriptloaded', path);
    };
    
    util.importFile (path, document, endScriptLoad, "js");
  },
  
  /**
   *  Dynamically load a CSS into your application.
   *
   *  When the download is completed, the event 'cssloaded' is fired <br/>
   *  If a error occurs, nothing happend, then you have to manage by
   *  your own possible error load.
   *  <p/>
   *  The callback function will receive as parameter a event like that:<br/>
   *  {type: 'cssloaded', data: path}
   *
   *  @example
   *  myApp.bind ('cssloaded', ...);
   *  myApp.loadCSS ("resources/other.css");
   *
   * @name vs.ui.Application#loadCSS 
   * @function
   *
   * @param {string} path the css url [mandatory]
   */
  loadCSS : function (path)
  {
    var self = this, endCssLoad = function (path)
    {
      var i, l, data, ab_event;
      if (!path) { return; }
      
      self.propagate ('cssloaded', path);
    };

    util.importFile (path, document, endCssLoad, "css");
  }  
};
util.extendClass (Application, View);

/********************************************************************
                  Define class properties
********************************************************************/

util.defineClassProperties (Application, {
  'size': {
    /** 
     * Getter|Setter for size.<br/>
     * Gives access to the size of the Application
     * @name vs.ui.Application#size 
     *
     * @type {Array.<number>}
     */ 
    set : function (v)
    {
      if (!v) { return; }
      if (!util.isArray (v) || v.length !== 2) { return; }
      if (!util.isNumber (v[0]) || !util.isNumber(v[1])) { return; }
      this._size [0] = v [0];
      this._size [1] = v [1];
      
      if (!this.view) { return; }
      this._updateSizeAndPos ();
      
      window.resizeTo (this._size [0], this._size [1]);
    },
    
    /**
     * @ignore
     * @type {Array.<number>}
     */
    get : function ()
    {
      if (this.view && this.view.parentNode)
      {
        this._size [0] = this.view.offsetWidth;
        this._size [1] = this.view.offsetHeight;
      }
      return this._size.slice ();
    }
  },
  'preventScroll': {
    /** 
     * Getter|Setter for page scrolling cancel.<br/>
     * Set to true to cancel scrolling behavior and false to have the
     * normal behavior.<br/>
     * By default, the property is set to true.
     * 
     * @name vs.ui.Application#preventScroll 
     *
     * @type {boolean}
     */ 
    set : function (pScroll)
    {
      if (pScroll)
      {
        this._prevent_scroll = true;
        document.preventScroll = pScroll;
      }
      else
      {
        this._prevent_scroll = false;
        document.preventScroll = pScroll;
      }
    },
  
    /**
     * @ignore
     * @type {boolean}
     */
    get : function ()
    {
      this._prevent_scroll = document.preventScroll;
      return this.__prevent_scroll;
    }
  }
});

/**
 * Exit and terminate the application.
 * @name vs.ui.Application.exit 
 */
Application.exit = function ()
{
  if (window.close)
  {
    window.close ();
  }
}

/**
 * @name vs.ui.Application.configureDevice 
 */
Application.configureDevice = function ()
{
  function setDeviceCSS () {

    var name = (window.target_css)?
      window.target_css [window.deviceConfiguration.targetId]:'';

    if (!name) name = "default";
  
    function importCSS (path, node) {
      var css_style = document.createElement ("link");
      css_style.setAttribute ("rel", "stylesheet");
      css_style.setAttribute ("type", "text/css");
      css_style.setAttribute ("href", path);
      css_style.setAttribute ("media", "screen");

      if (node)
        document.head.insertBefore (css_style, node);
      else
        document.head.appendChild (css_style);
    }
    
    var links = document.head.querySelectorAll ('link'), node;
    for (var i = 0; i < links.length; i++) {
      node = links.item (i);
      if (node.getAttribute ('href') == "lib/css/vs_ui.css") {
        node = node.nextElementSibling;
        break;
      }
      else node = null;
    }
  
    if (name == 'default') {
      switch (window.deviceConfiguration.os) {
        case DeviceConfiguration.OS_IOS:
          importCSS ("lib/css/vs_ui_ios.css", node);
        break;
   
        case DeviceConfiguration.OS_ANDROID:
          importCSS ("lib/css/vs_ui_android.css", node);
        break;
      }
    }
    else importCSS ("lib/css/vs_ui_" + name + ".css", node);
  }
  
  var did = window.deviceConfiguration.generateDeviceId (true), tid, size;
  window.deviceConfiguration.deviceId = did;
  window.deviceConfiguration.virtualScreenSize = null;
  
  for (tid in window.target_device_ids) {
    var dids = window.target_device_ids [tid];
    if (dids.indexOf (did) !== -1) {
      window.deviceConfiguration.targetId = tid;
      window.deviceConfiguration.setOrientation (window.orientation || 0, true);

      setDeviceCSS ();
      return;
    }
  }

  if (deviceConfiguration.screenSize === DeviceConfiguration.SS_4_INCH)
    tid = "phone3_4";
  if (deviceConfiguration.screenSize === DeviceConfiguration.SS_7_INCH)
    tid = "tablet7";  
  if (deviceConfiguration.screenSize === DeviceConfiguration.SS_10_INCH)
    tid = "phone10";
  
  if (deviceConfiguration.orientation === 0 ||
      deviceConfiguration.orientation === 90)
    tid += "_p"; 

  if (deviceConfiguration.orientation === 180 ||
      deviceConfiguration.orientation === -180)
    tid += "_l";

  if (window.target_device_ids [tid]) {
    window.deviceConfiguration.targetId = tid;
   
    window.deviceConfiguration.setOrientation (window.orientation || 0, true);

    setDeviceCSS ();
    return;
  }

  size = getScreenSize (DeviceConfiguration.SS_7_INCH);

  if (deviceConfiguration.screenSize === DeviceConfiguration.SS_10_INCH) {
    tid = "tablet7";
  }

  if (deviceConfiguration.orientation === 0 ||
      deviceConfiguration.orientation === 90)
    tid += "_p"; 

  if (deviceConfiguration.orientation === 180 ||
      deviceConfiguration.orientation === -180)
    tid += "_l";

  if (window.target_device_ids [tid]) {
    window.deviceConfiguration.targetId = tid;
    window.deviceConfiguration.virtualScreenSize = size;
    window.deviceConfiguration.setOrientation (window.orientation || 0, true);

    setDeviceCSS ();
    return;
  }

  tid = "phone3_4";
  size = getScreenSize (DeviceConfiguration.SS_4_INCH)

  if (deviceConfiguration.orientation === 0 ||
      deviceConfiguration.orientation === 90)
    tid += "_p"; 

  if (deviceConfiguration.orientation === 180 ||
      deviceConfiguration.orientation === -180)
    tid += "_l";

  if (window.target_device_ids [tid]) {
    window.deviceConfiguration.targetId = tid;
    window.deviceConfiguration.virtualScreenSize = size;
    window.deviceConfiguration.setOrientation (window.orientation || 0, true);

    setDeviceCSS ();
    return;
  }
}

function getScreenSize (screenDef) {

  function get7Inch () {
    if (devicePixelRatio <= 1.2) { // 1 pixel ratio
      return [600, 960];
    }
    else if (devicePixelRatio <= 1.4) { // 1.33 pixel ratio
      return [800, 1280];
    }
    else if (devicePixelRatio <= 1.7) { // 1.5 pixel ratio
      return [900, 1440];
    }
    return [1200, 1920]; // 2 pixel ratio
  }

  function get4Inch () {
    if (devicePixelRatio <= 1.2) { // 1 pixel ratio
      return [320, 540];
    }
    else if (devicePixelRatio <= 1.4) { // 1.33 pixel ratio
      return [427, 720];
    }
    else if (devicePixelRatio <= 1.7) { // 1.5 pixel ratio
      return [480, 800];
    }
    return [720, 1080]; // 2 pixel ratio
  }

  switch (screenDef) {
    case DeviceConfiguration.SS_7_INCH:
      return get7Inch ();
    break

    case DeviceConfiguration.SS_4_INCH:
      return get4Inch ();
    break
  }
}

/**
 * Returns the current GUI orientation.
 * <p/>
 * Be careful this API does not return the device orientation, which can be
 * deferent from the GUI orientation.
 * <p/>
 * Use the orientation module to have access to the device orientation.
 *
 * @name vs.ui.Application.getOrientation 
 * 
 * @return {integer} returns a integer include in [-90, 0, 90, 180];
 * @public
 */
Application.getOrientation = function ()
{
  return window.deviceConfiguration.getOrientation ();
};

/**
 * @potected
 */
Application.start = function ()
{
  var key, obj;
  for (key in Application_applications)
  {
    obj = Application_applications [key];
    obj.propertyChange ();
    obj.applicationStarted ();
    vs.scheduleAction (function () {obj.refresh ();});
  }
  vs.scheduleAction (function () {vs._default_df_.build ();});
};

/**
 * @protected
 */
Application.stop = function ()
{
  // un peu bourin pour le moment
  var key, obj;
  for (key in Application_applications)
  {
    obj = Application_applications [key];
    util.free (obj);
  }
  Application_applications = {};

  for (var key in vs.core.Object._obs)
  {
    var obj = vs.core.Object._obs [key];
    vs.util.free (obj);
  }
};

/**
 * @private
 * @depretacted
 */
Application.sendStart = function ()
{
  console.log ("Application.sendStart is deprecated. Please use Application.start");
  Application.start ();
};

/**
 *  Preload an array of GUI HTML templates.
 *  <p>
 *  When the developer uses createAndAddComponent method, the system will
 *  load the HTML GUI template associated to the component to create.
 *  This process can take times.<br>
 *  In order to minimize the latency, this class method allows to preload all 
 *  data related to a component.<br>
 *  This method should ne call when the application start.
 * 
 *  @example
 *  app.preloadTemplates (['GUICompOne', 'GUICompTwo']);
 * 
 * 
 * @name vs.ui.Application.preloadTemplates 
 * @param {Array.<String>} templates array of components names   
 */
Application.preloadTemplates = function (templates)
{
  for (var i = 0; i < templates.length; i++)
  {
    util.preloadTemplate (templates[i]);
  }
};

/**
 * @private
 */
var ImagePreloader = function (images)
{
  // for each image, call preload()
  for (var i = 0; i < images.length; i++ )
  {
    this.preload (images[i]);
  }
}
window.ImagePreloader = ImagePreloader;

/**
 * @private
 */
ImagePreloader.__image_path = {};

/**
 * @private
 */
ImagePreloader.prototype.preload = function (image)
{
  if (ImagePreloader.__image_path [image]) { return; }
  (new Image ()).src = image;
  ImagePreloader.__image_path [image] = true;
};

function preventBehavior (e)
{
//  window.scrollTo (0, 0);

  if (e.type == "touchstart" &&
      (e.target.tagName == "INPUT" ||
       e.target.tagName == "input" ||
       e.target.tagName == "TEXTAREA" ||
       e.target.tagName == "textarea"))
  {
    // on android do not cancel event otherwise the keyboard does not appear
    return;
  }

  e.preventDefault (); 
  return false;
};

/**
 *
 *
 * @name vs.ui.Application#mainViewVisibility 
 */
Application.prototype.mainViewVisibility = function (v)
{
};

/**
 *
 * @name vs.ui.Application#setImageBackground 
 */
Application.prototype.setImageBackground = function (path, name, type)
{
}

/**
 *
 * @name vs.ui.Application#loadingStart 
 */
Application.prototype.loadingStart = function (text)
{
};

/**
 *
 * @name vs.ui.Application#loadingStop 
 */
Application.prototype.loadingStop = function (v)
{
};

/********************************************************************
                      Export
*********************************************************************/
/** @private */
ui.Application = Application;
