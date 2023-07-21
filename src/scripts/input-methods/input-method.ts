import CommonButtons from "../common-buttons";

abstract class InputMethod<T extends string = CommonButtons> {
    key: string;

    abstract buttonsIndices: {
        [k in number]: T;
    };

    constructor(key: string) {
        this.key = key;
    }

    abstract getStickAxes(axes: number[]): {
        leftStick: {
            x: number;
            y: number;
        };
        rightStick: {
            x: number;
            y: number;
        }
    }

    getPressedButtons(buttons: readonly GamepadButton[]) {
        const pressedButtons: T[] = [];

        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].pressed) {
                pressedButtons.push(this.buttonsIndices[i]);
            }
        }

        return pressedButtons;
    };
};

export default InputMethod;
