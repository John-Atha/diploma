export interface ProductionCompanyProps {
    id: number;
    name: string;
}

export class ProductionCompany {
    id: number;
    name: string;

    constructor({ id, name }: ProductionCompanyProps) {
        this.id = id;
        this.name = name;
    }
}