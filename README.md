## seedB.js
This project aims to create a database for the seed colllection of a small (hobby?) farm.
On our farm we collect most of the flower and vegetable seeds.
Features for each record:
* Group
* Variety
* Packet ID (stored) unique record identifyer
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
