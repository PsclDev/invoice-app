import { ClientInterface, Gender } from '~/types/client';

export  class Client implements ClientInterface {
    id!: string;
    gender!: Gender;
    firstname!: string;
    lastname!: string;
    email!: string;
    street!: string;
    postalCode!: number;
    city!: string;
    documents?: Document[] | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    company!: string;
    vat!: number;
}