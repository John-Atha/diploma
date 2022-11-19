export interface LanguageProps {
    iso_639_1: string;
    name: string;
}

export class Language {
    iso_639_1: string;
    name: string;

    constructor({ iso_639_1, name }: LanguageProps) {
        this.iso_639_1 = iso_639_1;
        this.name = name;
    }
}