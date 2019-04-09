import React from "react";
import { Button, Text, View, StyleSheet, Image, TouchableHighlight } from "react-native";
import GameData from "./GameData";

export default class WelcomeScreen extends React.Component<
                 { navigation: any },
                 {}
               > {
                 public static navigationOptions = {
                   headerStyle: {
                     backgroundColor: "black"
                   },
                   headerTintColor: "#FFFFFF",
                   headerTitleStyle: {
                     fontWeight: "bold"
                   },
                   title: "Welcome"
                 };

                 click_button_sound = async () => {
                   try {
                     await GameData.soundObject.replayAsync();
                   } catch (error) {
                     console.log("click_sound error: ", error);
                   }
                 };
                 public render() {
                   return (
                     <View style={styles.container}>
                       <Image
                         source={require("./img/taichi.png")}
                         style={styles.backgroundImage}
                       />
                       <TouchableHighlight
                         style={{
                           position: "absolute",
                           top: "20%"
                         }}
                         onPress={() => {
                           GameData.Save.gameEnd = false;
                           this.props.navigation.navigate(
                             "Game"
                           );
                           this.click_button_sound();
                         }}
                       >
                         <Text style={{ fontSize: 40 }}>
                           Play
                         </Text>
                       </TouchableHighlight>

                       <TouchableHighlight
                         style={{
                           position: "absolute",
                           bottom: "20%"
                         }}
                         onPress={() => {
                           this.props.navigation.navigate(
                             "Score"
                           );
                           this.click_button_sound();
                         }}
                       >
                         <Text
                           style={{
                             fontSize: 40,
                             color: "white"
                           }}
                         >
                           Leaderboard
                         </Text>
                       </TouchableHighlight>
                     </View>
                   );
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
    backgroundImage: {
        width: '100%',
        height: '100%'
    }
});
