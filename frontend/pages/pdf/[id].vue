<script setup lang="ts">
import Mustache from 'mustache';

const router = useRouter();
const route = useRoute();
const documentStore = useDocumentStore();
const clientStore = useClientStore();
const settingStore = useSettingStore();
const documentHelper = useDocumentHelper();
const { formatDate } = useCustomDateHelper();

if (!route.params.id) {
  router.push('/');
}

const documentId = ref(route.params.id.toString());
await settingStore.getAll();

const document = await documentStore.getById(documentId.value);
const client = await clientStore.getById(document.clientId);
const settings = {} as any;
settingStore.settings
  .filter((s) => s.type === SettingType.PDF)
  .forEach((s) => {
    settings[s.key] = s.value;
  });

const isInvoice = computed(() => {
  return documentHelper.isInvoice(document);
});

const sender = computed(() => {
  return `${convertTemplate(PdfKey.COMPANY_NAME)}, ${convertTemplate(
    PdfKey.COMPANY_ADRESS,
  )}`;
});

const senderLength = computed(() => {
  return sender.value.length;
});

function convertTemplate(key: string) {
  return Mustache.render(`{{${key}}}`, {
    ...document,
    ...client,
    ...settings,
  });
}

const qrCodeLink = computed(() => {
  const reqUrl = useApiUrl() + '/document';
  return `${reqUrl}/generate-girocode/${documentId.value}`;
});

definePageMeta({
  layout: 'print',
});
</script>

<template>
  <div
    class="relative m-0 h-[29.7cm] w-[21cm] bg-[white] p-0 text-[12pt] text-[black] shadow-none"
  >
    <div class="flex h-[4.5cm] items-center justify-center text-[10pt]">
      <div>
        {{
          `${convertTemplate(PdfKey.COMPANY_NAME)} • ${convertTemplate(
            PdfKey.COMPANY_ADRESS,
          )} • USt.-IdNr. DE${convertTemplate(PdfKey.COMPANY_TAXID)}`
        }}
      </div>
    </div>
    <div class="w-full">
      <div class="flex w-[16.5cm] flex-row">
        <div class="mx-[2cm] h-[4.5cm] w-[8.5cm]">
          <address
            class="mb-0 ml-[0.5cm] max-h-[1.4cm] min-h-[1.4cm] w-[8cm] px-[0mm] py-[6.2mm] pb-0 text-[9pt] not-italic"
            :style="`font-size: ${senderLength > 50 ? '8' : '9'}pt`"
          >
            <span
              class="block border-b-[0.5mm] border-solid pb-[0.5mm]"
              :class="
                isInvoice ? 'border-b-spring-green-500' : 'border-b-[#C8C892]'
              "
              >{{ sender }}</span
            >
          </address>
          <address class="mb-0 ml-[0.5cm] h-[2.73cm] w-[8cm] pb-0 not-italic">
            <div v-if="client.company" class="font-bold">
              {{ client.company }}
            </div>
            <div v-if="client.firstname && client.lastname" class="font-bold">
              {{ `${client.firstname} ${client.lastname}` }}
            </div>
            <div>
              {{ client.street }}
            </div>
            <div>
              {{ `${client.postalCode} ${client.city}` }}
            </div>
          </address>
        </div>
        <div class="mt-[-0.5cm] h-[4cm] min-w-[6.5cm]">
          <div
            class="text-[24pt] font-bold"
            :class="isInvoice ? 'text-spring-green-500' : 'text-[#b3b381]'"
          >
            {{ isInvoice ? 'Rechnung' : 'Angebot' }}
          </div>
          <div class="flex justify-between">
            <div>Datum:</div>
            <div class="font-bold">
              {{ formatDate(document.dateOfIssue, false, 'de') }}
            </div>
          </div>
          <div class="flex justify-between">
            <div>Nr:</div>
            <div class="font-bold">
              {{ isInvoice ? 'R#' : 'A#' }}
              {{
                String(
                  isInvoice ? document.invoiceNr : document.offerNr,
                ).padStart(4, '0')
              }}
            </div>
          </div>
          <div v-if="isInvoice" class="flex justify-between">
            <div>Fällig bis:</div>
            <div class="font-bold">
              {{ formatDate(document.dueDate, false, 'de') }}
            </div>
          </div>
        </div>
      </div>
      <div class="ml-[2.5cm] mt-[0.650cm] w-[16.5cm]">
        <div class="min-h-[11.5cm]">
          <table class="table">
            <thead :class="isInvoice ? 'bg-spring-green-500' : 'bg-[#C8C892]'">
              <tr>
                <th class="text-[13pt]">Beschreibung</th>
              </tr>
            </thead>
            <tbody
              class="border-b border-solid"
              :class="
                isInvoice ? 'border-b-spring-green-500' : 'border-b-[#C8C892]'
              "
            >
              <tr v-for="(text, index) of document.description" :key="index">
                <td>{{ text }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mb-[1cm] flex justify-between">
          <div class="w-6/12">
            <div>
              <div v-if="isInvoice">Vielen Dank für Ihr Vertrauen!</div>
              <template v-else>
                <div>Dieses Angebot gilt 2 Wochen.</div>
                <div>Vorab bedanken wir uns bei Ihren Vertrauen!</div>
              </template>
            </div>
            <div v-if="isInvoice" class="mt-3 w-[7.5cm]">
              <div>Zahlungsinformationen</div>
              <div class="flex justify-between">
                <div>Name:</div>
                <div class="font-bold">
                  {{ convertTemplate(PdfKey.PAYMENT_NAME) }}
                </div>
              </div>
              <div class="flex justify-between">
                <div>IBAN:</div>
                <div class="font-bold">
                  {{ convertTemplate(PdfKey.PAYMENT_IBAN) }}
                </div>
              </div>
              <div class="flex justify-between">
                <div>Referenz:</div>
                <div class="font-bold">
                  R#{{ `${String(document.invoiceNr).padStart(4, '0')}` }}
                </div>
              </div>
              <div class="flex h-28 flex-col items-center">
                <p>
                  <span class="font-bold text-[#010066]">GIRO</span
                  ><span class="font-bold text-[#FE0009]">CODE</span>
                </p>
                <img class="size-24" :src="qrCodeLink" alt="QR Code" />
                <p class="text-xs">Für bequemes Bezahlen mit der Banking-App</p>
              </div>
            </div>
          </div>
          <div class="flex justify-end">
            <div class="w-[7cm]">
              <div class="flex justify-between">
                <div>Zwischensumme:</div>
                <div>{{ document.subTotal.toFixed(2) }}€</div>
              </div>

              <div class="flex justify-between">
                <div>Steuern ({{ document.taxRate }}% USt.):</div>
                <div>{{ document.tax.toFixed(2) }}€</div>
              </div>
              <div
                v-if="isInvoice && document.alreadyPaid"
                class="flex justify-between"
              >
                <div>Bereits gezahlt:</div>
                <div>{{ document.alreadyPaid.toFixed(2) }}€</div>
              </div>
              <div
                class="mt-3 flex justify-between p-2.5 text-[13.5pt] font-bold"
                :class="isInvoice ? 'bg-spring-green-500' : 'bg-[#C8C892]'"
              >
                <div>Gesamtbetrag:</div>
                <div>{{ document.total.toFixed(2) }}€</div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="isInvoice"
          class="flex h-[0.75cm] items-end justify-center text-[8pt] text-gray-300"
        >
          <div>
            Für Privatpersonen besteht eine Aufbewahrungspflicht von 2 Jahren
            für Rechnungen.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
body,
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  padding: 0;
  box-shadow: none;
  color: black;
  background-color: white;
  font-size: 12pt;
  width: 21cm;
  height: 29.7cm;
  position: relative;
}

table {
  border: 0;
  border-collapse: collapse;
  width: 100%;
}

table thead th {
  width: 100%;
  text-align: left;
}
table tr {
  td {
    padding: 0.4rem 0.5rem;
  }
}

table,
table th {
  padding: 0.32cm;
}

table tbody tr {
  background-color: #fbfbf9;
}

table tbody tr:nth-of-type(odd) {
  background-color: #eeefeb;
}

table tbody tr:last-of-type {
  border-bottom: 0;
}
</style>
~/models
