interface RemoveByIndexProps {
    array: any[],
    index: number,
}

const removeByIndex = ({ array, index }: RemoveByIndexProps) => {
    const len = array.length;
    if (index<0 || index>=len) {
        return array;
    }
    if (index===len-1) {
        return array.slice(0, index);
    }
    return array.slice(0, index).concat(array.slice(index+1, len));
}

interface ArraySampleProps {
    array: any[],
    limit: number,
}

export const arraySample = ({ array, limit }: ArraySampleProps) => {
    if (!array) return [];
    const len = array.length;
    if (len<=limit) {
        return array;
    }
    let sample = [...array];
    while (sample.length>limit) {
        const index = Math.floor(Math.random()*sample.length);
        sample = removeByIndex({ array: sample, index });
    }
    return sample;
}