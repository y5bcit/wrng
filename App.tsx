import React from "react";
import { StyleSheet } from "react-native";
import { createAppContainer, createStackNavigator } from "react-navigation";
import { GameScreen } from "./GameScreen";
import { Leaderboard } from "./Leaderboard";
import { WelcomeScreen } from "./WelcomeScreen";

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

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    justifyContent: "center",
    left: 200,
    padding: 10,
    bottom: -300,
    height: 100,
    width: 100,
  },
});
