import React from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import GameData from "./GameData";

export default class WelcomeScreen extends React.Component<{ navigation: any }, {}> {
    public static navigationOptions = {
        headerStyle: {
            backgroundColor: "#F4511E",
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
            fontWeight: "bold",
        },
        title: "WelcomeScreen",
    };
    public render() {
        return (<View style={styles.container}>
            <Text>This is Home Screen</Text>
            <Button title="Go to Game" onPress={() => {
                GameData.Save.gameEnd = false;
                this.props.navigation.navigate("Game");
            }} />
            <Button title="Go to Leaderboard" onPress={() => {
                this.props.navigation.navigate("Score");
            }} />
        </View>);
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
  