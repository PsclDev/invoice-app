import { Client, ClientForm } from '~/types';

export default function useClientHelper() {
  const isCompany = (client: Client | ClientForm) => {
    return !!client.company;
  };

  const getName = (client: Client | ClientForm) => {
    const name = `${client.firstname} ${client.lastname}`;

    if (isCompany(client)) {
      return client.company.concat(' | ', name);
    }

    return name;
  };

  return { isCompany, getName };
}
