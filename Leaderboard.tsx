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
                renderItem={({ item }) => <View style={{ alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'black', borderRadius: 10, padding: 3, margin: 10, marginHorizontal: 60 }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{item.n}</Text>
                    <Text style={{ fontSize: 16 }}>{item.s}</Text>
                </View>}
            />
        );
    }
};
