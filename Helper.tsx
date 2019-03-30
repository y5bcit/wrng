import GameData from "./GameData";

export default class Helper {
    public static intersect(rx: number, ry: number, rHalfWidth: number, rHalfHeight: number, cx: number, cy: number): boolean {
        let dx = Math.abs(cx - rx);
        if (dx > GameData.Save.controlRadius + rHalfWidth) {
            return false;
        }
        let dy = Math.abs(cy - ry);
        if (dy > GameData.Save.controlRadius + rHalfHeight) {
            return false;
        }
        if (dx <= rHalfWidth || dy <= rHalfHeight) {
            return true;
        }
        let dxCorner = dx - rHalfWidth;
        let dyCorner = dy - rHalfHeight;
        return dxCorner * dxCorner + dyCorner * dyCorner <= GameData.Save.controlRadius * GameData.Save.controlRadius;
    }
}
