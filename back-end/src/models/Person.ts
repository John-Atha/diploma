export interface PersonProps {
    id: number;
    name: string;
    gender: number;
    profile_path?: string;
}

export class Person {
    id: number;
    name: string;
    gender: number;
    profile_path?: string;

    constructor({ id, name, gender, profile_path }: PersonProps) {
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.profile_path = profile_path;
    }
}