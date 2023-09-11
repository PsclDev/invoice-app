import { Client } from 'types';

export default function useClientHelper() {
  const isCompany = (client: Client) => {
    return !!client.company;
  };

  const getName = (client: Client) => {
    const name = `${client.firstname} ${client.lastname}`;

    if (isCompany(client)) {
      return client.company.concat(' | ', name);
    }

    return name;
  };

  return { isCompany, getName };
}
