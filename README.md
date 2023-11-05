# IoT Application 

## Getting started with Expo Go
1. Install Expo Go application on your device
2. Install all dependencies:
```js
npm i
```
and 
```js
cd IoTApp
npx expo 
npm i
```
3. Start server
```js
node server.js
```
4. Create IoTApp/config.js file 
```js
export const SERVER_PATH = 'http://IP:3000';
```
5. Start application typing:
```js
cd IoTApp
npx expo start
```
6. Open Expo Go on your phone and follow instructions 
   
## Builds
1. Make sure you have expo-cli and all dependencies installed
```js
cd IoTApp
npm i
```
2. Make sure you have user path set to [...]/Android/Sdk/platform-tools
3. Make sure you have ANDROID_HOME set to [...]/Android/Sdk
4. Build application
```js
npx expo probuild
npx expo run:android
```
