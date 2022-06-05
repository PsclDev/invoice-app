<template>
  <div v-if="!isLoading" class="page" size="A4">
    <div class="letterHeading">
      <div>Feld für Briefkopf / Logo Whatever</div>
    </div>
    <div class="content">
      <div class="addressHeading">
        <div class="address">
          <address class="sender">
            <span>Muster GmbH - Musterstr. 1337 - 12345 Musterhausen</span>
          </address>
          <address class="recipient">
            MusterMann GmbH<br />
            Musterstr. 7331<br />
            12345 Musterstadt
          </address>
        </div>
        <div class="invoiceSpecs">
          <strong>Date:</strong> 05.06.2022<br />
          <strong>Order Nr:</strong> 1337<br />
          <strong>Contact Person:</strong> Max MusterMann
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
              <tr>
                <td>1 Lorem Ipsum dolor $50.00 1 $50.00</td>
              </tr>
              <tr>
                <td>2 cyka bljat $20.00 3 $60.00</td>
              </tr>
              <tr>
                <td>1 Lorem Ipsum dolor $50.00 1 $50.00</td>
              </tr>
              <tr>
                <td>2 cyka bljat $20.00 3 $60.00</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="foot">
          <div class="col">
            <strong>Thanks for your Purchase</strong><br />
            <p>
              <strong>Payment Info</strong><br />
              Account Nr: 123 456 789<br />
              A/C Name: Lorem Ipsum<br />
              Bank Details: Dolor sit amet
            </p>
          </div>
          <div class="col">
            <div class="price">
              <strong>Before Taxes Total:</strong> 1337€<br />
              <strong>Taxrate:</strong> 15%<br />
              <strong>Total After Taxes:</strong> 1537,55€
            </div>
          </div>
        </div>
        <div class="footAddress">
          Muster GmbH - Musterstr. 1337 - 12345 Musterhausen<br />
          Account Nr: 123 456 789 - A/C Name: Lorem Ipsum - Bank Details: Dolor
          sit amet
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getModule } from 'vuex-module-decorators';
import * as Mustache from 'mustache';
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
      console.log('Data', this.document, this.client, this.settings);
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

.footAddress {
  text-align: center;
  background-color: #373b44;
  color: #fff;
  padding: 2.5mm;
}
</style>
