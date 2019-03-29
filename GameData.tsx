import { THREE } from "expo-three";
import { PixelRatio } from "react-native";
import Save from "./Save";

export default class GameData {
    static Save = new Save();
    static dragPos = new THREE.Vector2(0, 0);
    static screenSize = new THREE.Vector2();
    static pixelRatio = PixelRatio.get();
    static blocks = [[-2.0, 12, 2.5, 0.3],
    [1, 14, 2.5, 0.3],
    [-2, 16, 2.5, 0.3],
    [1, 18, 2.5, 0.3],
    [-0.5, 28, 3.5, 3],
    [0.5, 34, 3.5, 3],
    [-0.5, 40, 3.5, 3],
    [0.5, 46, 3.5, 3],
    [2, 56, 8, 0.3],
    [2, 58, 8, 0.3],
    [2, 60, 8, 0.3],
    [2, 62, 8, 0.3]];
}
