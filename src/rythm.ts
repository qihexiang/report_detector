export const rythm = (range: number, marking: number, short: number, long: number) => {
    if(range >= marking) {
        throw new Error("Rythm range must be smaller than marking");
    }
    const now = new Date().getTime();
    if (now % marking <= range || marking - now % marking <= range) {
        return short
    } else {
        return long
    }
}