import React from "react";
import { Text, View } from "react-native";
export class Leaderboard extends React.Component {
    public static navigationOptions = {
        headerStyle: {
            backgroundColor: "#F4511E",
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
            fontWeight: "bold",
        },
        title: "Leaderboard",
    };
    public render() {
        return (<View>
            <Text>This is Leaderboard Screen</Text>
        </View>);
    }
}
