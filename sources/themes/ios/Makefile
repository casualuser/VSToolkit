##############################################################
##                    COPYRIGHT NOTICE
##
##  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and
##  contributors. All rights reserved
##
##  This program is free software: you can redistribute it and/or modify
##  it under the terms of the GNU Lesser General Public License as published
##  by the Free Software Foundation, either version 3 of the License, or
##  (at your option) any later version.
##
##  This program is distributed in the hope that it will be useful,
##  but WITHOUT ANY WARRANTY; without even the implied warranty of
##  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
##  GNU Lesser General Public License for more details.
##
##  You should have received a copy of the GNU Lesser General Public License
##  along with this program. If not, see <http://www.gnu.org/licenses/>.
##############################################################

###                     Declaration
##############################################################

SHELL = /bin/sh
CHMOD = chmod
CP = cp
TARGET = ../../..
XTEMP = ../../../tools/manage_template.sh
MV = mv
NOOP = $(SHELL) -c true
RM_F = rm -f
RM_RF = rm -rf
TEST_F = test -f
TOUCH = touch
UMASK_NULL = umask 0
DEV_NULL = > /dev/null 2>&1
MKPATH = mkdir -p
CAT = cat
MAKE = make
OPEN = open
ECHO = echo
ECHO_N = echo -n
JAVA = java
COMPILE_YUI = $(JAVA) -cp $(TOOLS_PATH)/yuicompressor/jargs-1.0.jar:$(TOOLS_PATH)/yuicompressor/rhino-1.6R7.jar -jar $(TOOLS_PATH)/yuicompressor/yuicompressor-2.4.8.jar
COMPILE_LESS = lessc

###                         RELEASE
##############################################################

all :: clean makedirs ui ext
ifneq ($(DEBUG), 1)
	-$(COMPILE_YUI) $(TARGET)/lib_debug/css/vs_ui_ios.css -o $(TARGET)/lib/css/vs_ui_ios.css --type css --charset UTF8
	-$(COMPILE_YUI) $(TARGET)/lib_debug/css/vs_ext_ios.css -o $(TARGET)/lib/css/vs_ext_ios.css --type css --charset UTF8
	$(CP) $(TARGET)/lib_debug/css/*.png $(TARGET)/lib/css/
endif

clean:
	-$(RM_RF)  $(TARGET)/lib_debug/css/vs_ui_ios.css
	-$(RM_RF)  $(TARGET)/lib/css/vs_ui_ios.css
	-$(RM_RF)  $(TARGET)/lib_debug/css/vs_ext_ios.css
	-$(RM_RF)  $(TARGET)/lib/css/vs_ext_ios.css
	
makedirs:
	-$(MKPATH) $(TARGET)/lib_debug/
	-$(MKPATH) $(TARGET)/lib_debug/css/
	-$(MKPATH) $(TARGET)/lib/
	-$(MKPATH) $(TARGET)/lib/css/

###                         GUI
##############################################################

ui:$(TARGET)/lib_debug/css/vs_ui_ios.less copy_widgets_assets
	-$(COMPILE_LESS) $(TARGET)/lib_debug/css/vs_ui_ios.less $(TARGET)/lib_debug/css/vs_ui_ios.css
	-$(RM_F)  $(TARGET)/lib_debug/css/vs_ui_ios.less

$(TARGET)/lib_debug/css/vs_ui_ios.less: 
	$(CAT) ../generic/lesshat.less >> $@
	$(CAT) ../generic/lesshat-ext.less >> $@
	$(CAT) ui/Application.less >> $@
	$(CAT) ui/Button.less >> $@
	$(CAT) ui/List.less >> $@
	$(CAT) ui/RadioButton.less >> $@
	$(CAT) ui/NavigationBar.less >> $@
	$(CAT) ui/CheckBox.less >> $@
	$(CAT) ui/Slider.less >> $@
	$(CAT) ui/ProgressBar.less >> $@
	$(CAT) ui/InputField.less >> $@
	$(CAT) ui/Picker.less >> $@
	$(CAT) ui/Switch.less >> $@
	$(CAT) ui/TextArea.less >> $@
	$(CAT) ui/ComboBox.less >> $@
	$(CAT) ui/PopOver.less >> $@
	$(CAT) ui/ToolBar.less >> $@
	$(CAT) ui/SegmentedButton.less >> $@

copy_widgets_assets:
	$(CP) ui/*.png $(TARGET)/lib_debug/css/
	$(CP) ext/ui/*.png $(TARGET)/lib_debug/css/

###                     Extension
##############################################################

ext: $(TARGET)/lib_debug/css/vs_ext_ios.less
	-$(COMPILE_LESS) $(TARGET)/lib_debug/css/vs_ext_ios.less $(TARGET)/lib_debug/css/vs_ext_ios.css
	-$(RM_F)  $(TARGET)/lib_debug/css/vs_ext_ios.less

$(TARGET)/lib_debug/css/vs_ext_ios.less:
	$(CAT) ../generic/lesshat.less >> $@
	$(CAT) ../generic/lesshat-ext.less >> $@
	$(CAT) ext/ui/GMap.less >> $@
	$(CAT) ext/ui/Accordion.less >> $@
