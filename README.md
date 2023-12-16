## seedB
A seed databse for people who collect and grow their own seeds.

Features for each record:
* Group
* Variety
* Packet ID (stored) unique record identifier
* Weight (seed)
* Count (seed)
* Cost (when bought / if bought)
* Date collected
* Timestamp for each edit of record

### cordova setup instructions
    cordova platform add browser
    cordova run browser

### for building/running android (linux-specific)
    export ANDROID_HOME="$HOME/DevTools/Android/"
    export ANDROID_SDK_ROOT="$HOME/DevTools/Android/"
    export JAVA_HOME=/usr/lib/jvm/default-java/
    PATH="$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"
