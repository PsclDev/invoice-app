import dayjs from 'dayjs';
import { Client } from '~/models/client';
import { ClientType } from '~/types';

export function getDate(date: Date, withTime: boolean = false): string {
  return dayjs(date).format(withTime ? 'DD.MM.YYYY HH:MM:ss' : 'DD.MM.YYYY');
}

export function getClientType(client: Client): ClientType {
  if (client.company) return ClientType.COMPANY;
  return ClientType.PRIVATE;
}

export function getMutableClient(client: Client): Client {
  return {
    id: client.id,
    company: client.company,
    vat: client.vat,
    gender: client.gender,
    firstname: client.firstname,
    lastname: client.lastname,
    email: client.email,
    street: client.street,
    postalCode: client.postalCode,
    city: client.city,
  } as Client;
}
