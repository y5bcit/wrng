import React from "react";
import { Text, View, ScrollView } from "react-native";

export default class Leaderboard extends React.Component <{}, {scores: {n:string,s:number}[]}> {
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

    constructor(props){
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
        .catch((error) =>{
        console.error(error);
        });
        console.disableYellowBox = true;
    };
    

    public render() {
        return (
            <ScrollView>
                {this.state.scores.map((key, item) => (
                <View>
                    <Text>Name: {key.n}, Score: {key.s}</Text>
                </View>
          ))}
            </ScrollView>
          );
    }
};
