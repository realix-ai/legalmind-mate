
import { QueryType } from "./legalQueryService";

// Helper function to simulate API calls for different query types
export async function simulateApiCall(query: string, queryType: QueryType): Promise<string> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return different responses based on query type
  switch (queryType) {
    case 'legal-research':
      return `Based on my research, the case "${query}" relates to several key precedents:
        
1. Smith v. Johnson (2018) - Established the modern interpretation of reasonable doubt in similar contexts.

2. Wilson Corp v. Davidson (2020) - Clarified the application of statutory requirements in this area.

3. Parker Trust v. National Bank (2021) - Set important boundaries for fiduciary responsibility that would be relevant here.

The current statutory framework under Section 423(b) would likely apply to this situation, particularly given the 2022 amendments that expanded its scope.`;

    case 'risk-analysis':
      return `Risk Analysis for "${query}":

HIGH RISK FACTORS:
• Potential statute of limitations issues (3-year deadline approaching)
• Conflicting precedents in this jurisdiction
• Recent regulatory changes affecting burden of proof

MEDIUM RISK FACTORS:
• Potential for adverse media coverage
• Similar cases have seen unpredictable outcomes
• Expert testimony may be challenged under Daubert standard

LOW RISK FACTORS:
• Strong documentary evidence available
• Favorable venue selection possible
• Opposing counsel has limited experience in this area

RECOMMENDED RISK MITIGATION STRATEGIES:
1. File protective motions by June 15
2. Prepare alternative settlement scenarios
3. Conduct supplemental research on Johnson v. Metropolitan factors`;

    case 'summarize':
      return `SUMMARY OF "${query}":

CORE ISSUES:
• Breach of fiduciary duty claims relating to investment decisions
• Allegations of improper disclosure of material information
• Disputed timeline of events from 2020-2022

KEY PARTIES:
• Plaintiff corporation (seeking damages of $4.2M)
• Three defendant board members
• Two corporate entities with potential liability

PROCEDURAL STATUS:
• Initial complaint filed March 2023
• Motion to dismiss denied September 2023
• Discovery deadline extended to July 15, 2024
• Trial date set for November 2024

CRITICAL DOCUMENTS:
• Board meeting minutes from April 18, 2021
• Financial disclosure statements from Q3 2021
• Expert witness reports filed February 2024`;

    case 'data-analysis':
      return `DATA ANALYSIS FOR "${query}":

STATISTICAL FINDINGS:
• 72% of similar cases settled before trial
• Average settlement amount: $1.2M
• Median time to resolution: 14 months
• Cases with similar fact patterns had 63% plaintiff success rate

JURISDICTION INSIGHTS:
• This jurisdiction shows 22% higher damage awards than national average
• Recent trend toward stricter interpretation of statutory requirements
• Judge Williamson has ruled on 8 similar cases (5 for plaintiff, 3 for defense)

LITIGATION COST PROJECTION:
• Estimated total costs through trial: $320,000-$420,000
• Major cost drivers: Expert testimony (35%), document review (28%)
• Settlement probability peaks at months 8-10 of litigation

STRATEGIC RECOMMENDATIONS:
1. Consider early mediation (cost/benefit analysis favorable)
2. Allocate resources to key expert testimony areas
3. Prepare detailed timeline exhibits to clarify disputed sequence`;

    default:
      return `I've analyzed your query about "${query}" and compiled relevant information. Would you like me to elaborate on any specific aspect?`;
  }
}
