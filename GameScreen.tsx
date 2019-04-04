import { Audio, GLView } from "expo";
import ExpoTHREE, { THREE } from "expo-three";
import React from "react";
import { PanResponder, PanResponderInstance, View, TextInput, Text, Button, StyleSheet } from "react-native";
import GameData from "./GameData";
import Save from "./Save";
import Helper from "./Helper";

export default class GameScreen extends React.Component<{ navigation: any }, { bg_music: boolean, playerName: string }> {
    public static navigationOptions = {
        headerStyle: {
            backgroundColor: "#F4511E",
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
            fontWeight: "bold",
        },
        title: "GameScreen",
    };
    static style = StyleSheet.create({
        display: {
            alignItems: "stretch",
            alignSelf: "center",
            backgroundColor: "rgba(190,206,232,0.8)",
            bottom: "50%",
            height: "25%",
            justifyContent: "center",
            position: "absolute",
            width: "50%",
        },
        hidden: {}
    });
    public panResponder: PanResponderInstance;

    constructor(props) {
        super(props);
        this.state = {
            bg_music: true,
            playerName: ""
        }
        this.panResponder = PanResponder.create({
            onPanResponderGrant: (evt, gestureState) => {
                let x = gestureState.x0 * GameData.pixelRatio / GameData.screenSize.x - 0.5;
                let y = gestureState.y0 * GameData.pixelRatio / -GameData.screenSize.y + 0.5;
                x /= 3;
                y /= 3;
                GameData.dragPos = new THREE.Vector2(x, y);
            },
            onPanResponderMove: (evt, gestureState) => {
                let x = gestureState.x0 + gestureState.dx;
                let y = gestureState.y0 + gestureState.dy;
                x = x * GameData.pixelRatio / GameData.screenSize.x - 0.5;
                y = y * GameData.pixelRatio / -GameData.screenSize.y + 0.5;
                x /= 3;
                y /= 3;
                GameData.dragPos = new THREE.Vector2(x, y);
            },
            onPanResponderRelease: (evt, gestureState) => {
                GameData.dragPos = new THREE.Vector2(0, 0);
            },
            onStartShouldSetPanResponder: (evt, gestureState) => true,
        });
        THREE.suppressExpoWarnings(true);
        this.occ = this.occ.bind(this);
    }

    public async occ(gl: WebGLRenderingContext) {
        const renderer = new ExpoTHREE.Renderer({ gl, width: gl.drawingBufferWidth, height: gl.drawingBufferHeight });
        GameData.screenSize = new THREE.Vector2(gl.drawingBufferWidth, gl.drawingBufferHeight);
        const scene = new THREE.Scene();
        const light = new THREE.AmbientLight(0xffffff);
        scene.add(light);
        const camera = new THREE.PerspectiveCamera(100, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
        const geometry = new THREE.PlaneGeometry(1, 1);
        const blocksGeometry = new THREE.BoxGeometry(1, 1, 1);
        const sphere = new THREE.SphereGeometry(GameData.Save.controlRadius, 32, 32);
        const texture = await ExpoTHREE.loadTextureAsync({ asset: require("./img/yinyang.png") });
        const materialYinyang = new THREE.MeshLambertMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
        });
        camera.position.z = 5;
        camera.lookAt(0, 5, 0);
        const yinyang = new THREE.Mesh(geometry, materialYinyang);
        yinyang.scale.set(2, 2, 1);
        scene.add(yinyang);
        const ballball = new THREE.Mesh(sphere);
        scene.add(ballball);
        const ballball2 = new THREE.Mesh(sphere);
        scene.add(ballball2);
        ballball.position.z = 0.5;
        ballball2.position.z = 0.5;
        GameData.blocks.forEach(b => {
            let block = new THREE.Mesh(blocksGeometry);
            block.scale.set(b[2] * 2, b[3] * 2, 1);
            block.position.x = b[0];
            block.position.y = b[1];
            block.position.z = 0.5;
            scene.add(block);
        });
        const xBound = 2.25;
        const yBound = -1;
        let current = new Save();
        const bgsound = new Audio.Sound();
        const gameove = new Audio.Sound();
        await bgsound.loadAsync(require("./assets/sounds/bg_music.mp3"));
        await gameove.loadAsync(require("./assets/sounds/dying_sound.wav"));
        const game_over_sound = async () => {
            try {
                await bgsound.pauseAsync();
                await gameove.replayAsync();
            } catch (error) {
                console.log('play music error: ', error)
            }
        }
        const animate = () => {
            if (!current.gameEnd) {
                requestAnimationFrame(animate);
                current.progress += 0.02;
                current.rotation = yinyang.rotation.z -= 0.01;
                current.locationX = yinyang.position.x += GameData.dragPos.x;
                current.locationY = yinyang.position.y += GameData.dragPos.y;
                if (yinyang.position.x > xBound) {
                    yinyang.position.x = xBound;
                } else if ((yinyang.position.x) < -xBound) {
                    yinyang.position.x = -xBound;
                }
                ballball.position.x = Math.sin(-yinyang.rotation.z) * current.centerRadius + yinyang.position.x;
                ballball.position.y = Math.cos(-yinyang.rotation.z) * current.centerRadius + yinyang.position.y;
                ballball2.position.x = -Math.sin(-yinyang.rotation.z) * current.centerRadius + yinyang.position.x;
                ballball2.position.y = -Math.cos(-yinyang.rotation.z) * current.centerRadius + yinyang.position.y;
                if (ballball.position.y < current.progress - yBound) {
                    current.gameEnd = true;
                }
                if (ballball2.position.y < current.progress - yBound) {
                    current.gameEnd = true;
                }
                GameData.blocks.forEach(b => {
                    if (Helper.intersect(b[0], b[1], b[2], b[3], ballball.position.x, ballball.position.y)) {
                        current.gameEnd = true;
                    } else if (Helper.intersect(b[0], b[1], b[2], b[3], ballball2.position.x, ballball2.position.y)) {
                        current.gameEnd = true;
                    }
                });
                camera.position.y = current.progress;
                GameData.Save = current;
                renderer.render(scene, camera);
                // @ts-ignore
                gl.endFrameEXP();
                if (current.gameEnd) {
                    this.setState({});
                    // TODO: POST the data here to server
                    // console.log(JSON.stringify(current, (k, v)=> Number(v.toFixed(4))));
                    // TODO: Add end game animation and exit/pause button
                    // TODO: Navigate to leaderboard
                    //JSON.stringify(GameData.Save, (k, v) => { if (typeof v === "number") return Number(v.toFixed(4)); else return v; })
                    game_over_sound();
                }
            }
        };
        animate();
        await bgsound.replayAsync();
    }

    public render() {
        return (<View {...this.panResponder.panHandlers}>
            <GLView style={{ height: "100%", width: "100%" }} onContextCreate={this.occ} />
            <View style={GameData.Save.gameEnd ? GameScreen.style.display : GameScreen.style.hidden}>
                <TextInput
                    style={{ height: 35, width: 200, padding: 10, margin: 10, borderWidth: 1, borderRadius: 10, borderColor: "#48BBEC" }}
                    placeholder="Enter your name"
                    onChangeText={(text) => this.setState({ playerName: text })}
                    clearTextOnFocus={true}
                />
                <Text>Your score is {((GameData.Save.progress + 5) * 100).toFixed()}</Text>
                <Button
                    onPress={() => {
                        fetch("https://wrng-server.herokuapp.com/top", {
                            method: "POST",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                n: this.state.playerName,
                                s: Number(((GameData.Save.progress + 5) * 100).toFixed()),
                            }),
                        });
                        this.props.navigation.navigate("Main");
                    }}
                    title="Upload"
                    color="white"
                    accessibilityLabel="This is a button"
                />
            </View>
        </View>);
    }
}
