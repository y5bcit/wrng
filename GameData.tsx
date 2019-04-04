import { THREE } from "expo-three";
import { PixelRatio } from "react-native";
import Save from "./Save";
import { Audio } from 'expo';

export default class GameData {
    static Save = new Save();
    static dragPos = new THREE.Vector2(0, 0);
    static screenSize = new THREE.Vector2();
    static pixelRatio = PixelRatio.get();
    static soundObject = new Audio.Sound();
    static blocks = [[-2.0, 12, 1.25, 0.15],
    [1, 14, 1.25, 0.15],
    [-2, 16, 1.25, 0.15],
    [1, 18, 1.25, 0.15],
    [-0.5, 28, 1.75, 1.5],
    [0.5, 34, 1.75, 1.5],
    [-0.5, 40, 1.75, 1.5],
    [0.5, 46, 1.75, 1.5],
    [2, 56, 4, 0.15],
    [2, 58, 4, 0.15],
    [2, 60, 4, 0.15],
    [2, 62, 4, 0.15]];
}
