import React from "react";
import { Text, View, FlatList } from "react-native";

export default class Leaderboard extends React.Component<{}, { scores: { n: string, s: number }[] }> {
    public static navigationOptions = {
        headerStyle: {
            backgroundColor: "black",
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
        fetch("https://wrng-server.herokuapp.com/top")
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
        let first = 8;
        return (
            <FlatList keyExtractor={(i, k) => k.toString()} extraData={this.state} data={this.state.scores}
                renderItem={({ item }) => <View style={{ alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "black", borderRadius: 10, padding: 3, margin: 10, marginHorizontal: 60 }}>
                    <Text style={{ fontSize: item.s > 0 ? 24 : 16, fontWeight: item.n.length > 0 ? "bold" : "normal" }}>{item.n.length > 0 ? item.n : (item.s > 0 ? "Anonymous" : "Placeholder")}</Text>
                    <Text style={{ fontSize: 16 }}>{item.s}</Text>
                </View>}
            />
        );
    }
};
