import React from "react";
import { createAppContainer, createStackNavigator } from "react-navigation";
import GameScreen from "./GameScreen";
import Leaderboard from "./Leaderboard";
import WelcomeScreen from "./WelcomeScreen";

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
  public render() {
    return <AppContainer />;
  }
}