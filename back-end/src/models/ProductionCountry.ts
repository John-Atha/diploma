export interface ProductionCountryProps {
    iso_3166_1: string;
    name: string;
}

export class ProductionCountry {
    iso_3166_1: string;
    name: string;

    constructor({ iso_3166_1, name }: ProductionCountryProps) {
        this.iso_3166_1 = iso_3166_1;
        this.name = name;
    }
}