public without sharing class CSVBulkifiedUpload {
    @AuraEnabled
    public static String createAccountsInBatch(List<Account> accountList) {
        CSVBulkUploadBatch batch = new CSVBulkUploadBatch(accountList);
        String jobId = Database.executeBatch(batch);  // corrected line
        return jobId; // Returning the job ID might be useful for tracking or confirmation.
    }

}