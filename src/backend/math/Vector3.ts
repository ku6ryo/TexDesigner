
export class Vector3 {
    x: number
    y: number
    z: number

    constructor(x: number, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
    }

    clone() {
        return new Vector3(this.x, this.y, this.z)
    }
}