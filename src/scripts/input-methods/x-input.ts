import CommonButtons from "../common-buttons";
import InputMethod from "./input-method";
type XBoxButtons = CommonButtons | "DPad-Up" | "DPad-Down" | "DPad-Left" | "DPad-Right" | "RT" | "LT" | "RB" | "LB";

class XInput extends InputMethod<XBoxButtons> {
    buttonsIndices: { [x: number]: XBoxButtons; } = {
        0: "A",
        1: "B",
        2: "X",
        3: "Y",
        4: "LB",
        5: "RB",
        6: "LT",
        7: "RT",
        12: "DPad-Up",
        13: "DPad-Down",
        14: "DPad-Left",
        15: "DPad-Right"
    }
    constructor() {
        super("xinput");
    }

    getStickAxes(axes: readonly number[]) {
        return {
            leftStick: {
                x: axes[0],
                y: axes[1]
            },
            rightStick: {
                x: axes[2],
                y: axes[3]
            }
        }
    }
}

export default XInput;
