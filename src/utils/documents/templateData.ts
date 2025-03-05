
import { Template } from './types';

// Predefined templates
export const templates: Template[] = [
  {
    id: 'contract-service',
    title: 'Service Agreement',
    description: 'Standard contract for professional services',
    category: 'Contract'
  },
  {
    id: 'contract-nda',
    title: 'Non-Disclosure Agreement',
    description: 'Confidentiality agreement between parties',
    category: 'Contract'
  },
  {
    id: 'contract-employment',
    title: 'Employment Contract',
    description: 'Standard agreement for new employees',
    category: 'Contract'
  },
  {
    id: 'contract-lease',
    title: 'Commercial Lease Agreement',
    description: 'Property rental agreement for business use',
    category: 'Contract'
  },
  {
    id: 'litigation-complaint',
    title: 'Complaint',
    description: 'Initial pleading to start a lawsuit',
    category: 'Litigation'
  },
  {
    id: 'litigation-motion',
    title: 'Motion for Summary Judgment',
    description: 'Request for judgment without full trial',
    category: 'Litigation'
  },
  {
    id: 'litigation-discovery',
    title: 'Discovery Request',
    description: 'Document requesting evidence from opposing party',
    category: 'Litigation'
  },
  {
    id: 'corporate-bylaws',
    title: 'Corporate Bylaws',
    description: 'Rules governing a corporation',
    category: 'Corporate'
  },
  {
    id: 'corporate-minutes',
    title: 'Board Meeting Minutes',
    description: 'Official record of board meeting proceedings',
    category: 'Corporate'
  },
  {
    id: 'ip-trademark',
    title: 'Trademark Application',
    description: 'Application for trademark registration',
    category: 'IP'
  },
  {
    id: 'ip-patent',
    title: 'Patent Application',
    description: 'Document for filing a patent claim',
    category: 'IP'
  },
  {
    id: 'ip-licensing',
    title: 'IP Licensing Agreement',
    description: 'Contract for licensing intellectual property',
    category: 'IP'
  }
];

// Template content repository
export const getTemplateContent = (id: string): string => {
  const templateContents: Record<string, string> = {
    'contract-service': `SERVICE AGREEMENT

THIS SERVICE AGREEMENT (the "Agreement") is made and entered into as of [DATE], by and between [CLIENT NAME], a [STATE] [entity type] ("Client") and [SERVICE PROVIDER NAME], a [STATE] [entity type] ("Service Provider").

1. SERVICES
   Service Provider shall perform the following services for Client (the "Services"):
   [DESCRIBE SERVICES IN DETAIL]

2. TERM
   This Agreement shall commence on [START DATE] and continue until [END DATE], unless earlier terminated in accordance with Section 7.

3. COMPENSATION
   In consideration for the Services, Client shall pay Service Provider as follows:
   [PAYMENT TERMS]

4. INTELLECTUAL PROPERTY
   All intellectual property rights in any materials produced under this Agreement shall be the property of [OWNER].

5. CONFIDENTIALITY
   Each party agrees to keep confidential all non-public information disclosed by the other party.

6. REPRESENTATIONS AND WARRANTIES
   Service Provider represents and warrants that:
   (a) It has the right and authority to enter into and perform its obligations under this Agreement.
   (b) The Services will be performed in a professional manner consistent with industry standards.

7. TERMINATION
   This Agreement may be terminated:
   (a) By either party upon [NOTICE PERIOD] written notice to the other party.
   (b) Immediately by either party in the event of a material breach by the other party.

8. LIMITATION OF LIABILITY
   NEITHER PARTY SHALL BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES.

9. GOVERNING LAW
   This Agreement shall be governed by the laws of the State of [STATE].

10. MISCELLANEOUS
    (a) This Agreement constitutes the entire agreement between the parties.
    (b) This Agreement may only be modified by a written amendment signed by both parties.
    (c) If any provision of this Agreement is found to be invalid, the remaining provisions shall remain in effect.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

CLIENT:
[CLIENT NAME]

By: ________________________
Name: 
Title:

SERVICE PROVIDER:
[SERVICE PROVIDER NAME]

By: ________________________
Name:
Title:`,

    'contract-nda': `CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT

THIS CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT (the "Agreement") is made and entered into as of [DATE] by and between:

[PARTY A NAME], with its principal place of business at [ADDRESS] ("Disclosing Party"), and
[PARTY B NAME], with its principal place of business at [ADDRESS] ("Receiving Party").

1. PURPOSE
   The parties wish to explore a potential business relationship in connection with [BUSINESS PURPOSE] (the "Purpose"). In connection with the Purpose, the Disclosing Party may disclose to the Receiving Party certain confidential and proprietary information.

2. DEFINITION OF CONFIDENTIAL INFORMATION
   "Confidential Information" means all non-public information disclosed by the Disclosing Party to the Receiving Party, whether orally, in writing, or by any other means, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure.

3. OBLIGATIONS OF RECEIVING PARTY
   The Receiving Party shall:
   (a) Use the Confidential Information only for the Purpose;
   (b) Protect the Confidential Information with at least the same degree of care it uses to protect its own confidential information, but no less than reasonable care;
   (c) Not disclose the Confidential Information to any third party without prior written consent of the Disclosing Party;
   (d) Limit access to the Confidential Information to its employees, agents, and representatives who have a need to know for the Purpose and who are bound by confidentiality obligations at least as restrictive as those contained herein.

4. EXCLUSIONS
   The obligations under this Agreement shall not apply to information that:
   (a) Is or becomes publicly available through no fault of the Receiving Party;
   (b) Was known to the Receiving Party prior to disclosure by the Disclosing Party;
   (c) Is rightfully received by the Receiving Party from a third party without a duty of confidentiality;
   (d) Is independently developed by the Receiving Party without use of the Confidential Information;
   (e) Is required to be disclosed by law or court order, provided the Receiving Party gives the Disclosing Party prompt written notice of such requirement.

5. TERM AND TERMINATION
   This Agreement shall remain in effect for [TERM], or until terminated by either party with [NOTICE PERIOD] written notice. The confidentiality obligations shall survive termination of this Agreement for a period of [SURVIVAL PERIOD].

6. RETURN OF MATERIALS
   Upon termination of this Agreement or upon request of the Disclosing Party, the Receiving Party shall promptly return or destroy all Confidential Information and certify in writing that it has complied with this obligation.

7. NO RIGHTS GRANTED
   Nothing in this Agreement shall be construed as granting any rights, license, or ownership interest in the Confidential Information to the Receiving Party.

8. REMEDIES
   The Receiving Party acknowledges that monetary damages may not be a sufficient remedy for unauthorized disclosure of Confidential Information and that the Disclosing Party shall be entitled to seek injunctive relief in addition to all other remedies available at law or in equity.

9. GOVERNING LAW
   This Agreement shall be governed by and construed in accordance with the laws of [STATE/COUNTRY], without regard to its conflict of law principles.

10. ENTIRE AGREEMENT
    This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior agreements and understandings, whether written or oral.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

DISCLOSING PARTY:
[PARTY A NAME]

By: ________________________
Name:
Title:

RECEIVING PARTY:
[PARTY B NAME]

By: ________________________
Name:
Title:`,

    'contract-employment': `EMPLOYMENT AGREEMENT

THIS EMPLOYMENT AGREEMENT (the "Agreement") is made and entered into as of [DATE] (the "Effective Date"), by and between [EMPLOYER NAME], a [STATE] [ENTITY TYPE] (the "Employer"), and [EMPLOYEE NAME], an individual residing at [ADDRESS] (the "Employee").

1. EMPLOYMENT AND DUTIES
   (a) Position. Employer hereby employs Employee as [POSITION TITLE], and Employee hereby accepts such employment, upon the terms and conditions set forth herein.
   (b) Duties. Employee shall perform such duties as are customarily associated with the position of [POSITION TITLE] and such other duties as may be assigned from time to time by Employer.
   (c) Reporting. Employee shall report directly to [SUPERVISOR POSITION/NAME].

2. TERM
   This Agreement shall commence on the Effective Date and shall continue until terminated in accordance with Section 7 below.

3. COMPENSATION AND BENEFITS
   (a) Base Salary. Employer shall pay Employee a base salary of $[AMOUNT] per [PERIOD], subject to applicable withholdings and deductions.
   (b) Bonus. Employee may be eligible to receive a discretionary bonus of up to [PERCENTAGE/AMOUNT] based on [PERFORMANCE METRICS].
   (c) Benefits. Employee shall be eligible to participate in Employer's benefit plans in accordance with their terms.
   (d) Vacation. Employee shall be entitled to [NUMBER] days of paid vacation per year.
   (e) Expenses. Employer shall reimburse Employee for reasonable business expenses incurred in the performance of Employee's duties.

4. WORK LOCATION AND HOURS
   (a) Location. Employee's primary work location shall be [LOCATION].
   (b) Hours. Employee shall work [FULL-TIME/PART-TIME], with expected hours of [HOURS/SCHEDULE].

5. CONFIDENTIALITY AND NON-DISCLOSURE
   Employee agrees to keep confidential all non-public information regarding Employer, its business, customers, and operations, both during and after the term of this Agreement.

6. INTELLECTUAL PROPERTY
   All work product, inventions, and intellectual property created by Employee in the course of employment shall be the exclusive property of Employer.

7. TERMINATION
   (a) At-Will Employment. Employee's employment is at-will and may be terminated by either party at any time, with or without cause.
   (b) Notice. [NOTICE REQUIREMENTS, IF ANY]
   (c) Severance. [SEVERANCE TERMS, IF ANY]
   (d) Return of Property. Upon termination, Employee shall return all Employer property in Employee's possession.

8. RESTRICTIVE COVENANTS
   (a) Non-Competition. During employment and for [PERIOD] thereafter, Employee shall not [COMPETITION RESTRICTIONS].
   (b) Non-Solicitation. During employment and for [PERIOD] thereafter, Employee shall not solicit Employer's employees or customers.

9. GOVERNING LAW
   This Agreement shall be governed by the laws of the State of [STATE], without regard to conflict of law principles.

10. MISCELLANEOUS
    (a) Entire Agreement. This Agreement constitutes the entire understanding between the parties.
    (b) Amendments. This Agreement may only be amended in writing signed by both parties.
    (c) Severability. If any provision is found to be invalid, the remaining provisions shall remain in effect.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

EMPLOYER:
[EMPLOYER NAME]

By: ________________________
Name:
Title:

EMPLOYEE:

________________________
[EMPLOYEE NAME]`,

    'litigation-complaint': `IN THE [COURT NAME]
[JURISDICTION]

[PLAINTIFF NAME],            )
                             )
          Plaintiff,         )
                             )    Case No. _______________
     v.                      )
                             )    COMPLAINT
[DEFENDANT NAME],            )
                             )    JURY TRIAL DEMANDED
          Defendant.         )

COMPLAINT

Plaintiff [PLAINTIFF NAME] ("Plaintiff"), by and through its undersigned counsel, hereby brings this Complaint against Defendant [DEFENDANT NAME] ("Defendant"), and alleges as follows:

NATURE OF THE ACTION

1. This is an action for [CAUSE OF ACTION] arising from Defendant's [GENERAL DESCRIPTION OF WRONGFUL CONDUCT].

PARTIES

2. Plaintiff [PLAINTIFF NAME] is a [INDIVIDUAL/ENTITY TYPE] with its principal place of [RESIDENCE/BUSINESS] at [ADDRESS].

3. Upon information and belief, Defendant [DEFENDANT NAME] is a [INDIVIDUAL/ENTITY TYPE] with its principal place of [RESIDENCE/BUSINESS] at [ADDRESS].

JURISDICTION AND VENUE

4. This Court has [SUBJECT MATTER] jurisdiction over this action pursuant to [JURISDICTION STATUTE/RULE].

5. Venue is proper in this Court pursuant to [VENUE STATUTE/RULE].

FACTUAL ALLEGATIONS

6. [DETAILED FACTUAL ALLEGATIONS]

7. [CONTINUE WITH NUMBERED PARAGRAPHS]

COUNT I: [FIRST CAUSE OF ACTION]

8. Plaintiff repeats and realleges each and every allegation contained in paragraphs 1 through [LAST PARAGRAPH OF FACTUAL ALLEGATIONS] above as if fully set forth herein.

9. [ELEMENTS OF FIRST CAUSE OF ACTION]

10. As a direct and proximate result of Defendant's conduct, Plaintiff has suffered damages in an amount to be determined at trial.

COUNT II: [SECOND CAUSE OF ACTION]

11. Plaintiff repeats and realleges each and every allegation contained in paragraphs 1 through [LAST PARAGRAPH OF FACTUAL ALLEGATIONS] above as if fully set forth herein.

12. [ELEMENTS OF SECOND CAUSE OF ACTION]

13. As a direct and proximate result of Defendant's conduct, Plaintiff has suffered damages in an amount to be determined at trial.

PRAYER FOR RELIEF

WHEREFORE, Plaintiff respectfully requests that this Court enter judgment in favor of Plaintiff and against Defendant as follows:

a. [REQUESTED RELIEF]

b. [ADDITIONAL REQUESTED RELIEF]

c. Such other and further relief as the Court deems just and proper.

JURY DEMAND

Plaintiff hereby demands a trial by jury on all issues so triable.

Dated: [DATE]                   Respectfully submitted,

                                [LAW FIRM NAME]

                                By: __________________________
                                [ATTORNEY NAME]
                                [ADDRESS]
                                [PHONE]
                                [EMAIL]
                                Attorney for Plaintiff`,

    'ip-trademark': `UNITED STATES PATENT AND TRADEMARK OFFICE
TRADEMARK ELECTRONIC APPLICATION SYSTEM

TRADEMARK APPLICATION

SERIAL NUMBER: [To Be Assigned]
FILING DATE: [DATE]
MARK: [TRADEMARK NAME]

APPLICANT INFORMATION:
    [APPLICANT NAME]
    [ADDRESS]
    [CITY, STATE ZIP]
    [COUNTRY]
    [ENTITY TYPE]

CORRESPONDENCE INFORMATION:
    [ATTORNEY/CORRESPONDENT NAME]
    [LAW FIRM NAME]
    [ADDRESS]
    [CITY, STATE ZIP]
    [PHONE]
    [EMAIL]

BASIS FOR FILING:
    [ ] Use in Commerce (Section 1(a))
        Date of First Use Anywhere: [DATE]
        Date of First Use in Commerce: [DATE]
    [ ] Intent to Use (Section 1(b))
    [ ] Foreign Application (Section 44(d))
        Foreign Application Number: [NUMBER]
        Foreign Application Filing Date: [DATE]
        Country of Foreign Application: [COUNTRY]
    [ ] Foreign Registration (Section 44(e))
        Foreign Registration Number: [NUMBER]
        Foreign Registration Date: [DATE]
        Country of Foreign Registration: [COUNTRY]

GOODS AND SERVICES:
International Class [NUMBER]:
[DETAILED DESCRIPTION OF GOODS/SERVICES]

SPECIMEN:
[DESCRIPTION OF SPECIMEN SHOWING USE OF MARK]

ADDITIONAL STATEMENTS:
[ ] Disclaimer
[ ] Translation
[ ] Meaning or Significance of Mark
[ ] Prior Registration(s) by Applicant
[ ] Consent of Living Individual
[ ] Concurrent Use
[ ] Other Statements

SIGNATURE:
By signing below, I acknowledge that all information in this application is accurate to the best of my knowledge and belief. I understand that willful false statements may jeopardize the validity of the application or any registration resulting from this application.

Signatory's Name: [NAME]
Signatory's Position: [POSITION]
Date: [DATE]

FEE PAYMENT:
Filing Fee: $[AMOUNT]
Number of Classes: [NUMBER]
Total Fee: $[TOTAL AMOUNT]

DECLARATION:
The undersigned, being hereby warned that willful false statements and the like so made are punishable by fine or imprisonment, or both, under 18 U.S.C. Section 1001, and that such willful false statements may jeopardize the validity of the application or any resulting registration, declares that he/she is properly authorized to execute this application on behalf of the applicant; he/she believes the applicant to be the owner of the trademark/service mark sought to be registered, or, if the application is being filed under 15 U.S.C. Section 1051(b), he/she believes applicant to be entitled to use such mark in commerce; to the best of his/her knowledge and belief no other person, firm, corporation, or association has the right to use the above identified mark in commerce, either in the identical form thereof or in such near resemblance thereto as to be likely, when used on or in connection with the goods/services of such other person, to cause confusion, or to cause mistake, or to deceive; and that all statements made of his/her own knowledge are true and that all statements made on information and belief are believed to be true.`,

    'corporate-bylaws': `BYLAWS
OF
[CORPORATION NAME]

ARTICLE I - OFFICES

Section 1. Principal Office. The principal office of the Corporation shall be located in the City of [CITY], State of [STATE].

Section 2. Other Offices. The Corporation may have such other offices as the Board of Directors may determine or as the affairs of the Corporation may require from time to time.

ARTICLE II - SHAREHOLDERS

Section 1. Annual Meeting. The annual meeting of shareholders shall be held on [DATE/TIME] each year for the purpose of electing Directors and for the transaction of such other business as may come before the meeting.

Section 2. Special Meetings. Special meetings of the shareholders may be called by the President, the Board of Directors, or by holders of not less than one-tenth of all the shares entitled to vote at such meeting.

Section 3. Place of Meeting. The Board of Directors may designate any place as the place of meeting for any annual or special meeting of the shareholders.

Section 4. Notice of Meetings. Written notice stating the place, day, and hour of the meeting, and in the case of a special meeting, the purpose for which the meeting is called, shall be delivered not less than ten nor more than sixty days before the date of the meeting.

Section 5. Quorum. A majority of the outstanding shares entitled to vote, represented in person or by proxy, shall constitute a quorum at a meeting of shareholders.

ARTICLE III - BOARD OF DIRECTORS

Section 1. General Powers. The business and affairs of the Corporation shall be managed by its Board of Directors.

Section 2. Number, Tenure and Qualifications. The number of Directors shall be [NUMBER]. Each Director shall hold office until the next annual meeting of shareholders and until his successor shall have been elected and qualified.

Section 3. Regular Meetings. A regular meeting of the Board of Directors shall be held without other notice than this Bylaw immediately after, and at the same place as, the annual meeting of shareholders.

Section 4. Special Meetings. Special meetings of the Board of Directors may be called by or at the request of the President or any two Directors.

Section 5. Quorum. A majority of the Board of Directors shall constitute a quorum for the transaction of business at any meeting of the Board.

ARTICLE IV - OFFICERS

Section 1. Officers. The officers of the Corporation shall be a President, one or more Vice Presidents, a Secretary, and a Treasurer, each of whom shall be elected by the Board of Directors.

Section 2. Election and Term of Office. The officers of the Corporation shall be elected annually by the Board of Directors at its first meeting held after each annual meeting of shareholders.

Section 3. Removal. Any officer may be removed by the Board of Directors whenever in its judgment the best interests of the Corporation would be served thereby.

Section 4. President. The President shall be the principal executive officer of the Corporation and shall supervise and control all of the business and affairs of the Corporation.

Section 5. Vice President. In the absence of the President or in the event of his inability or refusal to act, the Vice President shall perform the duties of the President.

Section 6. Secretary. The Secretary shall keep the minutes of the meetings of the shareholders and of the Board of Directors; see that all notices are duly given in accordance with the provisions of these Bylaws or as required by law; be custodian of the corporate records and of the seal of the Corporation.

Section 7. Treasurer. The Treasurer shall have charge and custody of and be responsible for all funds and securities of the Corporation.

ARTICLE V - CONTRACTS, LOANS, CHECKS, AND DEPOSITS

Section 1. Contracts. The Board of Directors may authorize any officer or officers, agent or agents, to enter into any contract or execute and deliver any instrument in the name of and on behalf of the Corporation, and such authority may be general or confined to specific instances.

Section 2. Loans. No loans shall be contracted on behalf of the Corporation and no evidences of indebtedness shall be issued in its name unless authorized by a resolution of the Board of Directors.

Section 3. Checks, Drafts, etc. All checks, drafts or other orders for the payment of money, notes or other evidences of indebtedness issued in the name of the Corporation, shall be signed by such officer or officers, agent or agents of the Corporation and in such manner as shall from time to time be determined by resolution of the Board of Directors.

ARTICLE VI - CERTIFICATES FOR SHARES AND THEIR TRANSFER

Section 1. Certificates for Shares. Certificates representing shares of the Corporation shall be in such form as may be determined by the Board of Directors.

Section 2. Transfer of Shares. Shares of the Corporation shall be transferable only on the books of the Corporation upon surrender of the certificate representing such shares.

ARTICLE VII - FISCAL YEAR

The fiscal year of the Corporation shall end on the [DAY] day of [MONTH] in each year.

ARTICLE VIII - DIVIDENDS

The Board of Directors may from time to time declare, and the Corporation may pay, dividends on its outstanding shares in the manner and upon the terms and conditions provided by law.

ARTICLE IX - SEAL

The Board of Directors shall provide a corporate seal which shall be circular in form and shall have inscribed thereon the name of the Corporation, the state of incorporation, and the words "Corporate Seal".

ARTICLE X - WAIVER OF NOTICE

Whenever any notice is required to be given under the provisions of these Bylaws, the Articles of Incorporation, or the [STATE] Business Corporation Act, a waiver thereof in writing, signed by the person or persons entitled to such notice, whether before or after the time stated therein, shall be deemed equivalent to the giving of such notice.

ARTICLE XI - AMENDMENTS

These Bylaws may be altered, amended, or repealed and new Bylaws may be adopted by the Board of Directors at any regular or special meeting of the Board of Directors.

Adopted by the Board of Directors on this [DAY] day of [MONTH], [YEAR].

______________________________
Secretary`
  };
  
  return templateContents[id] || `[Template content for ${id}]`;
};
