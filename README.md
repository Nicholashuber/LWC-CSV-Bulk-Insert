# Salesforce CSV Bulk Upload Project

This repository contains classes for a Salesforce application designed to handle bulk uploads of data via CSV files and monitor the status of these upload jobs.

## Description

This project provides Lightning Web Components and Apex classes that facilitate bulk uploading of CSV files and managing the status of these uploads in Salesforce. It is designed to handle large data sets efficiently and provide real-time feedback on the progress of data uploading.


![Bulk Upload Process](https://i.imgur.com/vELsOXJ.gif)

### CSVBulkifiedUpload.cls

This class is responsible for handling the bulkified uploading of data from CSV files. It ensures efficient data processing and minimizes the number of DML operations.

### CSVBulkUploadBatch.cls

This class acts as a batch process for uploading large sets of data. It breaks down large files into manageable batches and processes them asynchronously to optimize performance.

### ApexJobStatusController.cls

This class provides functionalities to monitor and retrieve the status of various Apex jobs, including the CSV bulk uploads. It helps in tracking the progress and diagnosing any issues with the batch jobs.

