import GameData from "./GameData";

export default class Helper {
    public intersect(rx: number, ry: number, rHalfWidth: number, rHalfHeight: number, cx: number, cy: number): boolean {
        let dx = Math.abs(cx - rx - rHalfWidth);
        if (dx > rHalfWidth + GameData.Save.controlRadius) {
            return false;
        }
        let dy = Math.abs(cy - ry - rHalfHeight);
        if (dy > rHalfHeight + GameData.Save.controlRadius) {
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
