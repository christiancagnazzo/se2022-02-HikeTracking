RETROSPECTIVE (Team 2)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done - 10 / 9
- Total points committed vs done - 67 / 59 
- Nr of hours planned vs spent (as a team) -  71h:30m / 73h 30min

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_              |  7       |    -   |      19h 30m      |       19h 15m       |
| _#8_Link start/arrival   | 1         |   8    |    1h 30m        |    1h 30m          |
| _#9_Link hut      |   5      |  13      |  7h 30m          |   1d 30m           |
| _#33_Define Reference Points    |     1    |   5     |   4h         |  2h            |
| _#10_Set Profile      |  5       |    5    |  1d 30m          | 1d 1h             |
| _#11_Filter Hikes      |  4       |    8    |    6h 30m        |      1d 30m        |
| _#12_Hut worker sign-up / _#31_Register Local Guide      |   -     |   5 - 5    |   *     |  *          |
| _#32_Validate Local Guide / _#13_Verify hut worker      | 8        |  5 - 5     |     1d 3h 30m       | 1d 4h 30m             |
| _#14_Update hike condition     |  5       |  8      | 6h          | 6h 45m             |
| _#30_Modify hike description      |    5     |  8      |  6h 30m  |  7h 30m       |

\* already done in the previous sprint

Stories number 12-31 and 13-32 have tasks in common. However, on YouTrack it is not possible to insert an issue as a subtask of several stories, but only to link them.


- Hours per task (average): estimate 71.5/41=1.74  spent 73.5/41= 1.79
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent -1 = 0.02

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated 8.5
  - Total hours spent 8.5
  - Nr of automated unit test cases 10
- E2E testing:
  - Total hours estimated 8
  - Total hours spent 8
- Code review 
  - Total hours estimated 6
  - Total hours spent 5h30m
- Technical Debt management:
  - Total hours estimated 7
  - Total hours spent 7h15m
  - Hours estimated for remediation by SonarQube 4
  - Hours estimated for remediation by SonarQube only for the selected and planned issues 2
  - Hours spent on remediation 6h15m
  - debt ratio (as reported by SonarQube under "Measures-Maintainability")
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ) 0.0% overal code,  0,9% new code
  RELIABLITY A SECURITY A MAINTAINABILITY A
  

In general, after analyzing the results of SonarCloud's analysis we have reviewed the code, fixed bugs, fixed security issues and removed numerous critical smells, thus reducing the impact of technical debts by more than one day.
In addition, we have passed the sonar cloud quality gate with grade A.


## ASSESSMENT

- What caused your errors in estimation (if any)?
We did a good estimation since the actual time spent is near the time budget.

- What lessons did you learn (both positive and negative) in this sprint?
We need to split similar tasks related to different user story with more precision. Sonar cloud analyse improved our code quality

- Which improvement goals set in the previous retrospective were you able to achieve? 
We separate the integration tests from the unit test and better communication

- Which ones you were not able to achieve? Why?
We didn't improved the quality of the code as much as we expected, because we ran out of time

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
We have to be more precise in assigning technical debt tasks, and all of us have to avoid creating technical debt.  

- One thing you are proud of as a Team!!
We have implemented many user stories than the previous sprints