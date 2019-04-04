import React from "react";
import { Text, View, FlatList } from "react-native";

export default class Leaderboard extends React.Component<{}, { scores: { n: string, s: number }[] }> {
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

    constructor(props) {
        super(props);
        this.state = {
            scores: []
        };
        fetch('https://wrng-server.herokuapp.com/top')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    scores: responseJson
                })
            })
            .catch((error) => {
                console.error(error);
            });
    };

    public render() {
        return (
            <FlatList keyExtractor={(i, k) => k.toString()} extraData={this.state} data={this.state.scores}
                renderItem={({ item }) => <View>
                    <Text>Name: {item.n}, Score: {item.s}</Text>
                </View>}
            />
        );
    }
};
