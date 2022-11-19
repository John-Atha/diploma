export interface KeywordProps {
    id: number;
    name: string;
}

export class Keyword {
    id: number;
    name: string;

    constructor({ id, name }: KeywordProps) {
        this.id = id;
        this.name = name;
    }
}