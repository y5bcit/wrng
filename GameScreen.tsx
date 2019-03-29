import { GLView } from "expo";
import ExpoTHREE, { THREE } from "expo-three";
import React from "react";
import { PanResponder, PanResponderInstance, PixelRatio, View } from "react-native";

let dragPos = new THREE.Vector2();
let screenSize = new THREE.Vector2();
const pixelRatio = PixelRatio.get();
const Block_list = [[-2.15,8,2.25,0.3],[0.1,9,2.25,0.3],[-2.15,10,2.25,0.3],[0.1,10,2.25,0.3]];
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
        const texture = await ExpoTHREE.loadTextureAsync({ asset: require("./img/yinyang.png") });
        const materialYinyang = new THREE.MeshLambertMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
        });
        camera.position.y = -5;
        camera.position.z = 5;
        camera.lookAt(0, 0, 0);
        const yinyang = new THREE.Mesh(geometry, materialYinyang);
        yinyang.scale.set(2, 2, 1);
        scene.add(yinyang);
        const xBound = 2.25;
        const yBound = -1;
        let progress = 0;
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
