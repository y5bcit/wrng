import React from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import GameData from "./GameData";

export default class WelcomeScreen extends React.Component<{ navigation: any }, {}> {
    
    // public static navigationOptions = {
    //     headerStyle: {
    //         backgroundColor: "#F4511E",
    //     },
    //     headerTintColor: "#FFFFFF",
    //     headerTitleStyle: {
    //         fontWeight: "bold",
    //     },
    //     title: "WelcomeScreen",
    // };



    click_button_sound = async () =>{
        try {
            await GameData.soundObject.unloadAsync();
            await GameData.soundObject.loadAsync(require('./assets/sounds/click_sound.wav'));
            await GameData.soundObject.replayAsync();
            
          } catch (error) {
            console.log('click_sound error: ',error)
          }

    }
    public render() {
        
        return (<View style={styles.container}>
            <Text>This is Home Screen</Text>
            <Button title="Go to Game" onPress={() => {
                this.props.navigation.navigate("Game");
                this.click_button_sound();
            }} />
            <Button title="Go to Leaderboard" 
                style={styles.button}
                onPress={() => {
                this.props.navigation.navigate("Score");
                this.click_button_sound();
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
      marginTop: 5,
      bottom: -300,
      height: 100,
      width: 100,
    },
  });
  