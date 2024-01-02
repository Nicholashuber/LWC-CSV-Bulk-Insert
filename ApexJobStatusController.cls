public with sharing class ApexJobStatusController {
    @AuraEnabled(cacheable=false)
    public static List<JobInfo> getApexJobs(String batchClassName) {
        List<JobInfo> jobInfoList = new List<JobInfo>();
        
        batchClassName='CSVBulkUploadBatch';
        Datetime threeDaysAgo = Datetime.now().addDays(-3);
        
        // Query for Apex jobs related to the specified batch class
        List<AsyncApexJob> apexJobs = [SELECT Id, ApexClass.Name, Status, JobType, CreatedDate, CompletedDate, TotalJobItems, NumberOfErrors, CreatedById, CreatedBy.FirstName
                                        FROM AsyncApexJob
                                        WHERE ApexClass.Name = :batchClassName
                                        AND CreatedDate >= :threeDaysAgo AND JobType = 'BatchApex'
                                        ORDER BY CreatedDate DESC];
        
        // Convert AsyncApexJob objects to a custom JobInfo class
        for (AsyncApexJob job : apexJobs) {
            JobInfo info = new JobInfo();
            info.Id = job.Id;
            info.ApexClassName = job.ApexClass.Name;
            info.Status = job.Status;
            //info.CreatedDate = job.CreatedDate;
            info.CreatedDate = job.CreatedDate.format('MM/dd/yyyy HH:mm:ss'); // Format the date
            info.CompletedDate = job.CompletedDate;
            info.TotalJobItems = job.TotalJobItems;
            info.NumberOfErrors = job.NumberOfErrors;
            info.SubmittedById = job.CreatedById;
            info.SubmittedByName = job.CreatedBy.FirstName;
            jobInfoList.add(info);
        }
        
        return jobInfoList;
    }
    
    // Custom class to hold job information
    public class JobInfo {
        @AuraEnabled
        public Id Id { get; set; }
        @AuraEnabled
        public String ApexClassName { get; set; }
        @AuraEnabled
        public String Status { get; set; }
        @AuraEnabled
        public String CreatedDate { get; set; }
        @AuraEnabled
        public DateTime CompletedDate { get; set; }
        @AuraEnabled
        public Integer TotalJobItems { get; set; }
        @AuraEnabled
        public Integer NumberOfErrors { get; set; }
        @AuraEnabled
        public Id SubmittedById { get; set; }
        @AuraEnabled
        public String SubmittedByName { get; set; }
    }
}