interface IBrand {
    name: string;
    image: string;
    country: string;
    link: string;
    perfumes: IPerfume[];
}

interface IPerfume {
    name: string;
    image: string;
    year: number;
}
