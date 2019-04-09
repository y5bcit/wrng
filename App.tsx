import React from "react";
import { createAppContainer, createStackNavigator } from "react-navigation";
import GameScreen from "./GameScreen";
import Leaderboard from "./Leaderboard";
import WelcomeScreen from "./WelcomeScreen";
import GameData from "./GameData";

const MainStack = createStackNavigator(
  {
    Main: {
      screen: WelcomeScreen,
    },
    Score: {
      screen: Leaderboard,
    },
  },
  {
    initialRouteName: "Main",
  },
);

const RootStack = createStackNavigator(
  {
    Game: {
      screen: GameScreen,
    },
    Main: {
      screen: MainStack,
    },
  },
  {
    initialRouteName: "Main",
    headerMode: "none",
    mode: "modal",
  },
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  async componentDidMount() {
    if (!GameData.musicLoaded) {
      await GameScreen.bgsound.loadAsync(
        require("./assets/sounds/bg_music.mp3")
      );
      console.log("load1d");
      await GameScreen.gameove.loadAsync(
        require("./assets/sounds/dying_sound.wav")
      );
      console.log("load2d");
      await GameData.soundObject.loadAsync(
        require("./assets/sounds/click_sound.wav")
      );
      console.log("load3d");
      GameData.musicLoaded = true;
    }
  }
  public render() {
    return <AppContainer />;
  }
}