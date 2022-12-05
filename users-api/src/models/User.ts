interface UserProps {
    username: string;
    id: number;
};

export class User {
    username: string;
    id: number;

    constructor(user: UserProps) {
        this.username = user.username;
        this.id = user.id;
    }
}

interface UserWithPasswordProps extends UserProps{
    hashedPassword: string;
};

export class UserWithPassword extends User {
    hashedPassword: string;

    constructor(user: UserWithPasswordProps) {
        super(user);
        this.hashedPassword = user.hashedPassword;
    }
}