# wrng
React Native project.

## Setup(Run as admin)
```
npm install -g expo-cli
git.exe clone --progress -v "git@github.com:y5bcit/wrng.git" "wrng"
cd "wrng"
npm install
npm start
```

## VSCode
If you've installed `Code Runner` extension, you can add following lines to  
your VSCode settings.json to enable one-click run `npm start` on TypeScript  
`.tsx` file:
```
  "code-runner.executorMapByFileExtension": {
    ".tsx": "cd $dir && npm start"
  },
```
