import { LightningElement, track, wire } from 'lwc';
import getApexJobs from '@salesforce/apex/ApexJobStatusController.getApexJobs';

const columns = [
    //{ label: 'Job ID', fieldName: 'Id' },
    //{ label: 'Apex Class Name', fieldName: 'ApexClassName' },
    { label: 'Owner', fieldName: 'SubmittedByName' },
    { label: 'Created Date', fieldName: 'CreatedDate' },
    { label: 'Status', fieldName: 'Status' },

    //{ label: 'Completed Date', fieldName: 'CompletedDate' },
    //{ label: 'Total Job Items', fieldName: 'TotalJobItems' },
    //{ label: 'Number of Errors', fieldName: 'NumberOfErrors' },
    //{ label: 'Submitted By ID', fieldName: 'SubmittedById' },
];

export default class LwcApexJobStatus extends LightningElement {
    @track batchClassName = '';
    @track jobInfoList;
    @track isLoading = true;
    @track error;

    columns = columns;


    // Add a function to fetch Apex jobs periodically
    fetchApexJobs() {
        this.isLoading = true; // Set isLoading to true to display the spinner
        // Call the getApexJobs function and handle the response
        console.log('calling getApexJobs');
        getApexJobs()
            .then(result => {
                console.log('result: ' + result);
                console.log(result);
                //this.jobInfoList = result;
                this.jobInfoList = [...result];
                //this.isLoading = false;
                this.error = null;
            })
            .catch(error => {
                //this.error = 'Error retrieving Apex jobs: ' + error;
                //this.isLoading = false;
                this.jobInfoList = null;
            })
            .finally(() => {
                this.isLoading = false; // Set isLoading to false when data is loaded or an error occurs
            });
    }

    // Use wire to call getApexJobs on component load
    @wire(getApexJobs)
    wiredApexJobs({ error, data }) {
        if (data) {
            this.jobInfoList = data;
            this.isLoading = false; // Data has been loaded, set isLoading to false
        } else if (error) {
            //this.error = 'Error retrieving Apex jobs: ' + error;
            this.isLoading = false; // An error occurred, set isLoading to false
        }
    }


    // Use connectedCallback to fetch Apex jobs periodically
    connectedCallback() {
        this.fetchApexJobs(); // Initial fetch

        // Set up an interval to fetch data every 5 seconds
        this.intervalId = setInterval(() => {
            this.fetchApexJobs();
        }, 5000); // 5000 milliseconds = 5 seconds
    }

    // Use disconnectedCallback to clean up the interval when the component is disconnected
    disconnectedCallback() {
        clearInterval(this.intervalId);
    }
}