import { GLView } from "expo";
import ExpoTHREE, { THREE } from "expo-three";
import React from "react";
import { PanResponder, PanResponderInstance, View } from "react-native";
import GameData from "./GameData";

export default class GameScreen extends React.Component<{ navigation: any }, {}> {
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
    public panResponder: PanResponderInstance;
    constructor(props) {
        super(props);
        this.panResponder = PanResponder.create({
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
        let blocksBox = [];
        GameData.blocks.forEach(b => {
            let block = new THREE.Mesh(blocksGeometry);
            block.scale.set(b[2], b[3], 1);
            block.position.x = b[0];
            block.position.y = b[1];
            block.position.z = 0.5;
            scene.add(block);
            blocksBox.push(new THREE.Box2(new THREE.Vector2(b[0] - b[2] / 2, b[1] - b[3] / 2),
                new THREE.Vector2(b[0] + b[2] / 2, b[1] + b[3] / 2)));
        });
        const xBound = 2.25;
        const yBound = -1;
        const animate = () => {
            requestAnimationFrame(animate);
            GameData.Save.progress += 0.02;
            yinyang.rotation.z -= 0.01;
            yinyang.position.y += GameData.dragPos.y;
            yinyang.position.x += GameData.dragPos.x;
            if ((yinyang.position.x) > xBound) {
                yinyang.position.x = xBound;
            } else if ((yinyang.position.x) < -xBound) {
                yinyang.position.x = -xBound;
            }
            if ((yinyang.position.y) < GameData.Save.progress - yBound) {
                GameData.Save.gameEnd = true;
            }
            if (GameData.Save.gameEnd) {
                GameData.Save.progress -= 0.02;
            }
            ballball.position.x = Math.sin(-yinyang.rotation.z) * 0.5 + yinyang.position.x;
            ballball.position.y = Math.cos(-yinyang.rotation.z) * 0.5 + yinyang.position.y;
            ballball2.position.x = -Math.sin(-yinyang.rotation.z) * 0.5 + yinyang.position.x;
            ballball2.position.y = -Math.cos(-yinyang.rotation.z) * 0.5 + yinyang.position.y;
            blocksBox.forEach(b => {
                if (false) {
                    GameData.Save.gameEnd = true;
                }
            });
            camera.position.y = GameData.Save.progress;
            renderer.render(scene, camera);
            gl.endFrameEXP();
        };
        animate();
    }
    public render() {
        return (<View {...this.panResponder.panHandlers}>
            <GLView style={{ height: "100%", width: "100%" }} onContextCreate={this.occ} />
        </View>);
    }
}
