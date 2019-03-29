import { GLView } from "expo";
import ExpoTHREE, { THREE } from "expo-three";
import React from "react";
import { PanResponder, PanResponderInstance, PixelRatio, View } from "react-native";

let dragPos = new THREE.Vector2();
let screenSize = new THREE.Vector2();
const pixelRatio = PixelRatio.get();
const Block_list = [[-2.0,12,2.5,0.3],[1,14,2.5,0.3],[-2,16,2.5,0.3],[1,18,2.5,0.3],[-0.5,28,3.5,3],[0.5,34,3.5,3],[-0.5,40,3.5,3],[0.5,46,3.5,3],[2,56,8,0.3],[2,58,8,0.3],[2,60,8,0.3],[2,62,8,0.3]];
export class GameScreen extends React.Component<{ navigation: any }, {}> {
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
                x = x * pixelRatio / screenSize.x - 0.5;
                y = y * pixelRatio / -screenSize.y + 0.5;
                x /= 3;
                y /= 3;
                dragPos = new THREE.Vector2(x, y);
            },
            onPanResponderRelease: (evt, gestureState) => {
                dragPos = new THREE.Vector2(0, 0);
            },
            onStartShouldSetPanResponder: (evt, gestureState) => true,
        });
        THREE.suppressExpoWarnings(true);
    }
    public async occ(gl: WebGLRenderingContext) {
        const renderer = new ExpoTHREE.Renderer({ gl, width: gl.drawingBufferWidth, height: gl.drawingBufferHeight });
        screenSize = new THREE.Vector2(gl.drawingBufferWidth, gl.drawingBufferHeight);
        const scene = new THREE.Scene();
        const light = new THREE.AmbientLight(0xffffff);
        scene.add(light);
        const camera = new THREE.PerspectiveCamera(100, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
        const geometry = new THREE.PlaneGeometry(1, 1);
        const blocksGeometry = new THREE.BoxGeometry(1, 1, 1);
        const sphere = new THREE.SphereGeometry(0.1, 32, 32 );
        const texture = await ExpoTHREE.loadTextureAsync({ asset: require("./img/yinyang.png") });
        const materialYinyang = new THREE.MeshLambertMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
        });
        camera.position.z = 5;
        const yinyang = new THREE.Mesh(geometry, materialYinyang);
        yinyang.scale.set(2, 2, 1);
        scene.add(yinyang);
        const ballball = new THREE.Mesh(sphere);
        scene.add(ballball);
        const ballball2 = new THREE.Mesh(sphere);
        scene.add(ballball2);
        ballball.position.z = 0.5;
        ballball2.position.z = 0.5;
        Block_list.forEach(element => {
            let block = new THREE.Mesh(blocksGeometry);
            block.scale.set(element[2], element[3],0.8);
            block.position.x = element[0]
            block.position.y = element[1]
            block.position.z = 0.5
            scene.add(block);
        });
        const xBound = 2.25;
        const yBound = -1;
        let progress = -5;
            camera.lookAt(0, 5, 0);
        const animate = () => {
            requestAnimationFrame(animate);
            progress += 0.02;
            yinyang.rotation.z -= 0.01;
            yinyang.position.y += dragPos.y;
            yinyang.position.x += dragPos.x;
            if ((yinyang.position.x) > xBound) {
                yinyang.position.x = xBound;
            } else if ((yinyang.position.x) < -xBound) {
                yinyang.position.x = -xBound;
            }
            if ((yinyang.position.y) < progress - yBound) {
                yinyang.position.y = progress - yBound;
            }
            ballball.position.x = Math.sin(-yinyang.rotation.z)*0.5+yinyang.position.x;
            ballball.position.y = Math.cos(-yinyang.rotation.z)*0.5+yinyang.position.y;
            ballball2.position.x = -Math.sin(-yinyang.rotation.z)*0.5+yinyang.position.x;
            ballball2.position.y = -Math.cos(-yinyang.rotation.z)*0.5+yinyang.position.y;
            camera.position.y = progress;
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
