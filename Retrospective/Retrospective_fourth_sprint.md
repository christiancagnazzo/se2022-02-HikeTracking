RETROSPECTIVE (Team 2)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done: 8 - 8
- Total points committed vs done: 71 - 71  
- Nr of hours planned vs spent (as a team): 72h30m - 78h20min



### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_Uncategorized              |  9       |    -   |      22h      |       21h 25m       |
| _#30_Modify hike description   | 1         |   8    |    1h        |    1h        |  
| _#17_Start hike   | 7         |   13    |    10h30m        |    10h30m       |  
| _#18_Terminate hike   | 5         |   13    |    6h30m        |    7h25m       |  
| _#34_Completed hikes   | 5         |   5    |    6h30m        |    6h30m       | 
| _#19_Record Point   | 5         |   8    |    7h       |    9h15m       | 
| _#35_Performance stats  | 5         |   8    |    6h30m        |    7h       | 
| _#27_New Weather Alert  | 6         |   8    |    6h30m       |    9h15m       | 
| _#29_Weather Alert Notification  | 5         |   8    |    6h       |    6h       | 




- Hours per task (average): estimate: 1.51, 1.62
- Standard Deviation (estimate and actual):  1.1410411151176318, 0.9962903196567087
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1 = 0.07

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated 8.5
  - Total hours spent 8.5
  - Nr of automated unit test cases 17
- E2E testing:
  - Total hours estimated 8.5
  - Total hours spent 8.5
- Code review 
  - Total hours estimated 6
  - Total hours spent 4h30m
- Technical Debt management:
  - Total hours estimated 6h
  - Total hours spent 5h45m
  - Hours estimated for remediation by SonarQube 4d6h 
  - Hours estimated for remediation by SonarQube only for the selected and planned issues 1d1h
  - Hours spent on remediation 3h45m on relevant smeels + false positive which increased estimation
  - debt ratio (as reported by SonarQube under "Measures-Maintainability") 0.7%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ) 
  RELIABLITY - A; SECURITY-A; MAINTAINABILITY-A;
  

In general, after analyzing the results of SonarCloud's analysis we reviewed the code, fixed bugs, security issues, and neutralized numerous critical smells, thus reducing the impact of technical debts by more than one day.
Additionally, we have passed the sonar cloud quality gate with grade A.


## ASSESSMENT

- What caused your errors in estimation (if any)?

 We overestimated some tasks but in general we did a good estimation since the actual time spent is more or less around the designated time budget.

- What lessons did you learn (both positive and negative) in this sprint?



- Which improvement goals set in the previous retrospective were you able to achieve? 

We assigned in a more precisely way tasks about technical debt and we paid more attention to avoid adding smells in the new code

- Which ones you were not able to achieve? Why?



- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  

- One thing you are proud of as a Team!!

We implemented a lot of stories and we made better use of the time available to complete more work!
