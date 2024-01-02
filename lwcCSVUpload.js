import {LightningElement, track} from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import { createRecord } from 'lightning/uiRecordApi';
import PARSER from '@salesforce/resourceUrl/PapaParse';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import DESCRIPTION_FIELD from '@salesforce/schema/Account.Description';
export default class lwcCSVUpload extends LightningElement {
    parserInitialized = false;
    loading = false;
    @track _results;
    @track _rows;
    get columns(){
        const columns = [
            { label: 'Account Name', fieldName: 'AccountName' },
            { label: 'Description', fieldName: 'Description' }
        ];
        if(this.results.length){
            columns.push({ label: 'Result',fieldName: 'result' });
        }
        return columns;
    }
    get rows(){
        if(this._rows){
            return this._rows.map((row, index) => {
                row.key = index;
                if(this.results[index]){
                    row.result = this.results[index].id || this.results[index].error;
                }
                return row;
            })
        }
        return [];
    }
    get results(){
        if(this._results){
            return this._results.map(r => {
                const result = {};
                result.success = r.status === 'fulfilled';
                result.id = result.success ? r.value.id : undefined;
                result.error = !result.success ? r.reason.body.message : undefined;
                return result;
            });
        }
        return [];
    }
    renderedCallback() {
        if(!this.parserInitialized){
            loadScript(this, PARSER)
                .then(() => {
                    this.parserInitialized = true;
                })
                .catch(error => console.error(error));
        }
    }
    handleInputChange(event){
        if(event.target.files.length > 0){
            const file = event.target.files[0];
            this.loading = true;
            Papa.parse(file, {
                quoteChar: '"',
                header: 'true',
                complete: (results) => {
                    this._rows = results.data;
                    this.loading = false;
                },
                error: (error) => {
                    console.error(error);
                    this.loading = false;
                }
            })
        }
    }
    createAccounts(){
        const accountsToCreate = this.rows.map(row => {
            const fields = {};
            fields[NAME_FIELD.fieldApiName] = row.AccountName;
            fields[DESCRIPTION_FIELD.fieldApiName] = row.Description;
            const recordInput = { apiName: ACCOUNT_OBJECT.objectApiName, fields };
            return createRecord(recordInput);
        });
        if(accountsToCreate.length){
            this.loading = true;
            Promise.allSettled(accountsToCreate)
                .then(results => this._results = results)
                .catch(error => console.error(error))
                .finally(() => this.loading = false);
        }
    }
    cancel(){
        this._rows = undefined;
        this._results = undefined;
    }
}