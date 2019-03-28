import React from "react";
import { Button, Text, View } from "react-native";
import { styles } from "./App";
export class WelcomeScreen extends React.Component<{ navigation: any }, {}> {
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
                this.props.navigation.navigate("Game");
            }} />
            <Button title="Go to Leaderboard" onPress={() => {
                this.props.navigation.navigate("Score");
            }} />
        </View>);
    }
}
