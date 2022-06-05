<template>
  <div v-if="!isLoading" class="page" size="A4">
    <div class="letterHeading">
      <div>{{ convertTemplate('Letterhead') }}</div>
    </div>
    <div class="content">
      <div class="addressHeading">
        <div class="address">
          <address class="sender">
            <span>{{
              `${convertTemplate('Company Name')} ${convertTemplate(
                'Company Address'
              )}`
            }}</span>
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
          <strong>Ausstellungsdatum:</strong> {{ getDate(document.dateOfIssue)
          }}<br />
          <strong>{{ isInvoice ? 'Rechnung' : 'Angebot' }} Nr:</strong>
          {{ isInvoice ? 'I#' : 'O#' }}
          {{
            String(isInvoice ? document.invoiceNr : document.offerNr).padStart(
              4,
              '0'
            )
          }}<br />
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
        <div class="foot">
          <div v-if="isInvoice" class="col">
            <strong>Vielen Dank für Ihr Vertrauen!</strong><br />
            <div>Zahlungsinformationen</div>
            <div>Name: {{ convertTemplate('Payment Name') }}</div>
            <div>IBAN: {{ convertTemplate('Payment Iban') }}</div>
            <div>
              Reference: I#{{
                `${String(document.invoiceNr).padStart(4, '0')}`
              }}
            </div>
          </div>
          <div class="col">
            <div class="price">
              <strong>Zwischensumme:</strong> {{ document.subTotal }}€<br />
              <strong>Steuern ({{ document.taxRate }}%):</strong>
              {{ document.tax }}€<br />
              <strong v-if="isInvoice && document.alreadyPaid"
                >Bereits gezahlt:</strong
              >
              {{ document.alreadyPaid }}€<br />
              <strong>Rechnungsbetrag:</strong> {{ document.total }}€<br />
            </div>
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
  },
  mounted() {
    const { params } = this.$route;
    this.getDocument(params.id);
  },
  methods: {
    async getDocument(id: string) {
      this.isLoading = true;
      this.document = await this.documentStore.getDocumentById(id);
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
  font-family: 'Cousine', monospace;
}

.page {
  background: white;
  display: block;
}

.page[size='A4'] {
  width: 21cm;
  height: 29.7cm;
}
.page[size='A4'][direction='landscape'] {
  width: 29.7cm;
  height: 21cm;
}
.letterHeading {
  height: 4.5cm;
  width: 12.5cm;
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
  margin-left: 0.5cm;
  font-style: normal;
}
.sender {
  padding: 6.2mm 0mm;
  font-size: 9pt;
  max-height: 1.77cm;
  min-height: 1.77cm;
}
.sender span {
  display: block;
  padding-bottom: 0.5mm;
  border-bottom: 0.5mm solid #373b44;
}
.recipient {
  height: 2.73cm;
}

.invoiceSpecs {
  width: 7.5cm;
  margin-top: 0.5cm;
  height: 4cm;
}

.mainContent {
  margin-left: 2.5cm;
  width: 16.5cm;
  margin-top: 0.846cm;
}
.tableContainer {
  min-height: 14cm;
}
.table {
  border: 0;
  border-collapse: collapse;
  width: 100%;
}
.table thead {
  background-color: #373b44;
  color: #fff;
}
.table thead th {
  width: 100%;
  text-align: left;
}
.table td,
.table th {
  padding: 0.42333cm;
}
.table tbody tr {
  border-bottom: 1px solid #373b44;
}
.table tbody tr:last-of-type {
  border-bottom: 0;
}

.foot {
  display: flex;
  flex-direction: row;
  margin-bottom: 1cm;
}

.foot .col {
  width: 50%;
}

.price {
  text-align: right;
}
</style>
