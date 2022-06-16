/* eslint-disable vue/no-v-html */
<template>
  <div v-if="!isLoading" class="page" size="A4">
    <div class="falzLeft"></div>
    <div class="falzRight"></div>

    <div class="letterHeading">
      <div>
        {{
          `${convertTemplate('Company Name')} • ${convertTemplate(
            'Company Address'
          )} • USt.-IdNr. DE${convertTemplate('Company Tax Id')}`
        }}
      </div>
    </div>
    <div class="content">
      <div class="addressHeading">
        <div class="address">
          <address
            class="sender"
            :style="`font-size: ${senderLength > 50 ? '8' : '9'}pt`"
          >
            <span>{{ sender }}</span>
          </address>
          <address class="recipient">
            <div v-if="client.company" class="fw-bold">
              {{ client.company }}
            </div>
            <div v-if="client.firstname && client.lastname" class="fw-bold">
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
        <div class="invoiceSpecs">
          <div class="fw-bold h1">{{ isInvoice ? 'Rechnung' : 'Angebot' }}</div>
          <div class="d-flex justify-content-between">
            <div>Datum:</div>
            <div class="fw-bold">
              {{ getDate(document.dateOfIssue) }}
            </div>
          </div>
          <div class="d-flex justify-content-between">
            <div>Nr:</div>
            <div class="fw-bold">
              {{ isInvoice ? 'R#' : 'A#' }}
              {{
                String(
                  isInvoice ? document.invoiceNr : document.offerNr
                ).padStart(4, '0')
              }}
            </div>
          </div>
          <div v-if="isInvoice" class="d-flex justify-content-between">
            <div>Fällig bis:</div>
            <div class="fw-bold">
              {{ getDate(document.dueDate) }}
            </div>
          </div>
        </div>
      </div>
      <div class="mainContent">
        <div class="tableContainer">
          <table class="table">
            <thead>
              <tr>
                <th class="first">Beschreibung</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(text, index) of document.description" :key="index">
                <td>{{ text }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pricing">
          <div class="col">
            <div>
              <div v-if="isInvoice">Vielen Dank für Ihr Vertrauen!</div>
              <div v-else>Vorab bedanken wir uns bei Ihren Vertrauen!</div>
            </div>
            <div v-if="isInvoice" class="payment mt-3">
              <div>Zahlungsinformationen</div>
              <div class="d-flex justify-content-between">
                <div>Name:</div>
                <div class="fw-bold">{{ convertTemplate('Payment Name') }}</div>
              </div>
              <div class="d-flex justify-content-between">
                <div>IBAN:</div>
                <div class="fw-bold">{{ convertTemplate('Payment Iban') }}</div>
              </div>
              <div class="d-flex justify-content-between">
                <div>Referenz:</div>
                <div class="fw-bold">
                  R#{{ `${String(document.invoiceNr).padStart(4, '0')}` }}
                </div>
              </div>
            </div>
          </div>
          <div class="col d-flex justify-content-end">
            <div class="monetary">
              <div class="d-flex justify-content-between">
                <div>Zwischensumme:</div>
                <div>{{ document.subTotal.toFixed(2) }}€</div>
              </div>

              <div class="d-flex justify-content-between">
                <div>Steuern ({{ document.taxRate }}%):</div>
                <div>{{ document.tax.toFixed(2) }}€</div>
              </div>
              <div
                v-if="isInvoice && document.alreadyPaid"
                class="d-flex justify-content-between"
              >
                <div>Bereits gezahlt:</div>
                <div>{{ document.alreadyPaid.toFixed(2) }}€</div>
              </div>
              <div class="d-flex justify-content-between total fw-bold mt-3">
                <div>Gesamtbetrag:</div>
                <div>{{ document.total.toFixed(2) }}€</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="isInvoice" class="footer">
          <div>
            Für Privatpersonen besteht eine Aufbewahrungspflicht von 2 Jahren
            für Rechnungen.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getModule } from 'vuex-module-decorators';
import Mustache from 'mustache';
import ClientModule from '~/store/client';
import DocumentModule from '~/store/document';
import SettingModule from '~/store/setting';
import { Client, Document } from '~/models';
import { SettingType } from '~/types';
import { getDate } from '~/utils/helper';

export default Vue.extend({
  name: 'PrintPage',
  layout: 'print',
  data() {
    return {
      getDate,
      isLoading: true,
      clientStore: getModule(ClientModule, this.$store),
      documentStore: getModule(DocumentModule, this.$store),
      settingStore: getModule(SettingModule, this.$store),
      client: {} as Client,
      document: {} as Document,
      settings: {} as any,
    };
  },
  computed: {
    isInvoice(): boolean {
      return !!this.document.invoiceNr;
    },
    sender(): string {
      return `${this.convertTemplate('Company Name')}, ${this.convertTemplate(
        'Company Address'
      )}`;
    },
    senderLength(): number {
      return this.sender.length;
    },
  },
  mounted() {
    const { params } = this.$route;
    this.getDocument(params.id);
  },
  methods: {
    async getDocument(id: string) {
      this.isLoading = true;

      try {
        this.document = await this.documentStore.getDocumentById(id);
      } catch {
        this.$router.push('/');
      }

      this.client = await this.clientStore.getClientById(
        this.document.clientId
      );
      await (
        await this.settingStore.getSettings()
      )
        .filter((s) => s.type === SettingType.PDF)
        .forEach((s) => {
          this.settings[s.key] = s.value;
        });

      this.isLoading = false;
    },
    getDescriptionItem(index: number): string {
      return this.document.description[index] || '&nbsp;';
    },
    convertTemplate(key: string): string {
      return Mustache.render(`{{${key}}}`, {
        ...this.client,
        ...this.document,
        ...this.settings,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
body,
* {
  box-sizing: border-box;
}
body,
.page {
  margin: 0;
  padding: 0;
  box-shadow: none;
  color: black;
  background-color: white;
  font-size: 12pt;
  font-family: 'Poppins', monospace;
}

.page[size='A4'] {
  width: 21cm;
  height: 29.7cm;
  position: relative;
}

.falzLeft,
.falzRight {
  position: absolute;
  top: 0;
  height: 100%;
  z-index: 1;
  width: 0.5cm;
}
.falzLeft {
  left: 0;
}
.falzRight {
  right: 0;
}
.falzLeft::before,
.falzLeft::after,
.falzRight::before,
.falzRight::after {
  content: ' ';
  position: absolute;
  height: 0;
  z-index: 2;
  width: 0.5cm;
  border-top: 0.25cm solid #fff;
  border-bottom: 0.25cm solid #fff;
  background-color: #000;
}
.falzLeft::before,
.falzLeft::after {
  left: 0;
}
.falzRight::before,
.falzRight::after {
  right: 0;
}
.falzLeft::before,
.falzRight::before {
  top: 102.5mm;
}
.falzLeft::after,
.falzRight::after {
  top: 207.5mm;
}

.letterHeading {
  font-size: 10pt;
  height: 4.5cm;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  width: 100%;
}

.addressHeading {
  display: flex;
  flex-direction: row;
  width: 16.5cm;
}

.address {
  width: 8.5cm;
  height: 4.5cm;
  margin-left: 2cm;
  margin-right: 2cm;
}
.recipient,
.sender {
  width: 8cm;
  font-style: normal;
  margin-left: 0.5cm;
  margin-bottom: 0;
  padding-bottom: 0;
}
.sender {
  padding: 6.2mm 0mm;
  font-size: 9pt;
  max-height: 1.4cm;
  min-height: 1.4cm;
}
.sender span {
  display: block;
  padding-bottom: 0.5mm;
  border-bottom: 0.5mm solid $green;
}
.recipient {
  height: 2.73cm;
}

.invoiceSpecs {
  .h1 {
    color: $green;
  }

  min-width: 6.5cm;
  height: 4cm;
  margin-top: -0.5cm;
}

.mainContent {
  margin-left: 2.5cm;
  width: 16.5cm;
  margin-top: 0.846cm;
}
.tableContainer {
  min-height: 13cm;
}
.table {
  border: 0;
  border-collapse: collapse;
  width: 100%;
}
.table thead {
  background-color: $green;
}
.table thead th {
  width: 100%;
  text-align: left;
}
.table tr {
  .first {
    font-size: 13pt;
  }

  td {
    padding: 0.4rem 0.5rem;
  }
}
.table,
.table th {
  padding: 0.32cm;
}
.table tbody tr {
  border-bottom: 1px solid $gray;
  background-color: #fbfbf9;
}
.table tbody tr:nth-of-type(odd) {
  background-color: #eeefeb;
}
.table tbody tr:last-of-type {
  border-bottom: 0;
}

.pricing {
  display: flex;
  flex-direction: row;
  margin-bottom: 1cm;
}

.pricing .col {
  width: 50%;
  max-height: 3.5cm;
}

.payment {
  width: 7.5cm;
}

.monetary {
  width: 7cm;
}

.total {
  background-color: $green;
  padding: 10px;
  font-size: 13.5pt;
}

.footer {
  display: flex;
  align-items: flex-end;
  height: 1cm;
  color: $gray;
  font-size: 10pt;
}
</style>
