import { Audio, GLView } from "expo";
import ExpoTHREE, { THREE } from "expo-three";
import React from "react";
import { PanResponder, PanResponderInstance, View } from "react-native";
import GameData from "./GameData";
import Save from "./Save";
import Helper from "./Helper";




export default class GameScreen extends React.Component<{ navigation: any }, {bg_music:boolean}> {

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
        this.state = {
            bg_music:true
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
        let block_texture = await ExpoTHREE.loadTextureAsync({ asset: require("./img/chinese_painting.png") });
        let materialBlock = new THREE.MeshLambertMaterial({
            map: block_texture,
            side: THREE.FrontSide,
            transparent: true,
        });
        GameData.blocks.forEach(b => {
            let block = new THREE.Mesh(blocksGeometry,materialBlock);
            block.scale.set(b[2] * 2, b[3] * 2, 2);
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
            try{
                await bgsound.pauseAsync();     
                await gameove.replayAsync();          
                
            }catch(error){
                console.log('play music error: ',error)
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
                gl.endFrameEXP();
                if (current.gameEnd) {
                    // TODO: POST the data here to server
                    // console.log(JSON.stringify(current, (k, v)=> Number(v.toFixed(4))));
                    // TODO: Add end game animation and exit/pause button
                    // TODO: Navigate to leaderboard
                    
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
        </View>);
    }
}
