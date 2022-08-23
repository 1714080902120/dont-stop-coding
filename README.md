# dont-stop-coding README

Once you open the plug-in, you cannot stop coding. After the set time interval is exceeded, it will continue to delete your code until you enter the content again.

I am not responsible for any problems that cause project losses.

## how to use

1. key down F1 and input dontstopcoding select start or close.
2. shortcut `ctrl + alt + [` start plugin and `ctrl + alt + ]` stop plugin in windows.
3. shortcut `cmd + [` start and `cmd + ]` stop in macOs.

## example

![example](https://raw.githubusercontent.com/1714080902120/dont-stop-coding/main/src/image/example.gif)


## Extension Settings

You can customize the time interval and the string length of each deletion, and add the following contents to the configuration file of workbench

For example:
    "dontStopCoding.config": {
        "delay": 50,
        "num": 1
    },
* `dontStopCoding.config.delay`: How long will it take to start deleting, default: 0.05s
* `dontStopCoding.config.num`: How many are deleted at a time.

**Enjoy!**
