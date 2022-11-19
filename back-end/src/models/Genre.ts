interface GenreProps {
    id: number;
    name: string;
}
export class Genre {
    id: number;
    name: string;

    constructor({ id, name }: GenreProps) {
        this.id = id;
        this.name = name;
    }
}