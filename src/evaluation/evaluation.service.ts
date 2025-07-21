import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { 
  ChatMessage, 
  EvaluationRequest, 
  EvaluationResponse, 
  ImprovementArea 
} from './dto/evaluation.types';

const SYSTEM_PROMPT = `You are an expert HR and technical evaluation AI analyzing employee promotion readiness.

TASK: Evaluate if an employee is ready for promotion based on:
1. Chat conversations and communication patterns
2. Technical skills demonstrated
3. Problem-solving abilities
4. Leadership indicators
5. Collaboration and teamwork
6. Reports from colleagues

INPUT DATA:
- Employee chat history
- Target bucket criteria and requirements
- Evaluation period
- Reports about the employee

REQUIRED OUTPUT FORMAT:
{
  "evaluation_summary": {
    "promotion_recommendation": boolean,
    "confidence_level": number (0-100),
    "overall_score": number (0-100)
  },
  "detailed_metrics": {
    "technical_skills_score": number (0-100),
    "communication_score": number (0-100),
    "problem_solving_score": number (0-100),
    "leadership_score": number (0-100),
    "collaboration_score": number (0-100)
  },
  "chat_activity_metrics": {
    "total_messages": number,
    "average_response_time": string (e.g., "2.5 hours"),
    "message_quality_score": number (0-100),
    "engagement_level": string ("Low", "Medium", "High")
  },
  "ai_insights": {
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2"],
    "recommendations": ["recommendation1", "recommendation2"]
  },
  "improvement_areas": [
    {
      "category": "Technical Skills|Communication|Leadership|Problem Solving|Collaboration",
      "description": "Specific, actionable description of what needs improvement"
    }
  ],
  "promotion_readiness_assessment": {
    "readiness_percentage": number (0-100),
    "key_factors": ["factor1", "factor2", "factor3"],
    "timeline_recommendation": string (e.g., "3-6 months", "Ready now", "1 year")
  },
  "cto_summary": {
    "executive_summary": "High-level summary for CTO",
    "risk_assessment": "Assessment of promotion risks",
    "strategic_recommendation": "Strategic recommendation"
  }
}

CRITICAL RULES:
1. If promotion_recommendation is FALSE, improvement_areas MUST have 2-3 specific areas
2. Each improvement_area must have both "category" and "description" fields
3. Categories must be specific: "Technical Skills", "Communication", "Leadership", "Problem Solving", "Collaboration"
4. Descriptions must be actionable and specific
5. All scores must be calculated based on actual data, not fixed values
6. Chat metrics must be calculated from actual chat history
7. Confidence level must reflect actual analysis quality

ANALYSIS GUIDELINES:
- Analyze chat messages for technical depth, communication quality, and problem-solving
- Evaluate response times and engagement patterns
- Assess leadership indicators in team interactions
- Consider reports for additional context
- Compare against target bucket requirements
- Provide specific, actionable feedback`;

@Injectable()
export class EvaluationService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async analyzeEmployee(request: EvaluationRequest): Promise<EvaluationResponse> {
    try {
      // 1. Get employee data (use existing endpoints)
      const employee = await this.getEmployeeData(request.employeeId);
      
      // 2. Get reports about employee (use existing endpoints)
      const reports = await this.getEmployeeReports(request.employeeId);
      
      // 3. Calculate chat metrics from actual data
      const chatMetrics = this.calculateChatMetrics(request.chatHistory);
      
      // 4. Prepare AI prompt with all data
      const aiPrompt = this.buildAIPrompt(request, employee, reports, chatMetrics);
      
      // 5. Call OpenAI
      const aiResponse = await this.callOpenAI(aiPrompt);
      
      // 6. Parse and validate response
      const evaluation = this.parseAIResponse(aiResponse);
      
      // 7. Validate improvement areas
      this.validateImprovementAreas(evaluation);
      
      return evaluation;
    } catch (error) {
      throw new BadRequestException(`Evaluation failed: ${error.message}`);
    }
  }

  private async getEmployeeData(employeeId: string): Promise<any> {
    // Mock employee data - in real implementation, use existing user service
    return {
      firstName: "John",
      lastName: "Doe",
      id: employeeId,
      email: "john.doe@example.com"
    };
  }

  private async getEmployeeReports(employeeId: string): Promise<any[]> {
    // Mock reports data - in real implementation, use existing report service
    return [
      { content: "Shows good technical skills in recent projects" },
      { content: "Collaborates well with team members" }
    ];
  }

  private calculateChatMetrics(chatHistory: ChatMessage[]): any {
    if (!chatHistory || chatHistory.length === 0) {
      return {
        total_messages: 0,
        average_response_time: "N/A",
        message_quality_score: 0,
        engagement_level: "Low"
      };
    }

    // Calculate actual metrics from chat history
    const totalMessages = chatHistory.length;
    
    // Calculate average response time
    let totalResponseTime = 0;
    let responseCount = 0;
    
    for (let i = 1; i < chatHistory.length; i++) {
      const currentTime = new Date(chatHistory[i].timestamp).getTime();
      const previousTime = new Date(chatHistory[i-1].timestamp).getTime();
      const responseTime = currentTime - previousTime;
      
      if (responseTime > 0 && responseTime < 24 * 60 * 60 * 1000) { // Less than 24 hours
        totalResponseTime += responseTime;
        responseCount++;
      }
    }
    
    const averageResponseTime = responseCount > 0 
      ? this.formatResponseTime(totalResponseTime / responseCount)
      : "N/A";

    // Calculate message quality score (simplified)
    const messageQualityScore = Math.min(100, Math.max(0, 
      totalMessages > 10 ? 70 : totalMessages > 5 ? 50 : 30
    ));

    // Determine engagement level
    const engagementLevel = totalMessages > 20 ? "High" : totalMessages > 10 ? "Medium" : "Low";

    return {
      total_messages: totalMessages,
      average_response_time: averageResponseTime,
      message_quality_score: messageQualityScore,
      engagement_level: engagementLevel
    };
  }

  private formatResponseTime(milliseconds: number): string {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}.${Math.round(minutes / 6)} hours`;
    } else {
      return `${minutes} minutes`;
    }
  }

  private buildAIPrompt(request: EvaluationRequest, employee: any, reports: any[], chatMetrics: any): string {
    const reportsText = reports.map(r => `- ${r.content}`).join('\n');
    
    return `Analyze the following employee for promotion readiness:

EMPLOYEE: ${employee.firstName} ${employee.lastName}
TARGET BUCKET: ${request.targetBucketCriteria.name} (Level ${request.targetBucketCriteria.level})
EVALUATION PERIOD: ${request.evaluationPeriod.startDate} to ${request.evaluationPeriod.endDate}

CHAT METRICS:
- Total Messages: ${chatMetrics.total_messages}
- Average Response Time: ${chatMetrics.average_response_time}
- Message Quality Score: ${chatMetrics.message_quality_score}
- Engagement Level: ${chatMetrics.engagement_level}

CHAT HISTORY:
${request.chatHistory.map(msg => `${msg.sender}: ${msg.message}`).join('\n')}

COLLEAGUE REPORTS:
${reportsText || 'No reports available'}

TARGET REQUIREMENTS:
- Skills: ${request.targetBucketCriteria.required_skills.join(', ')}
- Tools: ${request.targetBucketCriteria.tools.join(', ')}
- Knowledge: ${request.targetBucketCriteria.knowledge_areas.join(', ')}
- Promotion Criteria: ${request.targetBucketCriteria.promotion_criteria.join(', ')}

Provide your analysis in the exact JSON format specified.`;
  }

  private async callOpenAI(prompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No content received from OpenAI');
      }
      return content;
    } catch (error) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  private parseAIResponse(aiResponse: string): EvaluationResponse {
    try {
      const parsed = JSON.parse(aiResponse);
      
      // Ensure all required fields exist
      const evaluation: EvaluationResponse = {
        evaluation_summary: {
          promotion_recommendation: parsed.evaluation_summary?.promotion_recommendation ?? false,
          confidence_level: parsed.evaluation_summary?.confidence_level ?? 0,
          overall_score: parsed.evaluation_summary?.overall_score ?? 0
        },
        detailed_metrics: {
          technical_skills_score: parsed.detailed_metrics?.technical_skills_score ?? 0,
          communication_score: parsed.detailed_metrics?.communication_score ?? 0,
          problem_solving_score: parsed.detailed_metrics?.problem_solving_score ?? 0,
          leadership_score: parsed.detailed_metrics?.leadership_score ?? 0,
          collaboration_score: parsed.detailed_metrics?.collaboration_score ?? 0
        },
        chat_activity_metrics: {
          total_messages: parsed.chat_activity_metrics?.total_messages ?? 0,
          average_response_time: parsed.chat_activity_metrics?.average_response_time ?? "N/A",
          message_quality_score: parsed.chat_activity_metrics?.message_quality_score ?? 0,
          engagement_level: parsed.chat_activity_metrics?.engagement_level ?? "Low"
        },
        ai_insights: {
          strengths: parsed.ai_insights?.strengths ?? [],
          weaknesses: parsed.ai_insights?.weaknesses ?? [],
          recommendations: parsed.ai_insights?.recommendations ?? []
        },
        improvement_areas: parsed.improvement_areas ?? [],
        promotion_readiness_assessment: {
          readiness_percentage: parsed.promotion_readiness_assessment?.readiness_percentage ?? 0,
          key_factors: parsed.promotion_readiness_assessment?.key_factors ?? [],
          timeline_recommendation: parsed.promotion_readiness_assessment?.timeline_recommendation ?? "Not specified"
        },
        cto_summary: {
          executive_summary: parsed.cto_summary?.executive_summary ?? "Analysis completed",
          risk_assessment: parsed.cto_summary?.risk_assessment ?? "Standard risk assessment",
          strategic_recommendation: parsed.cto_summary?.strategic_recommendation ?? "Continue monitoring"
        }
      };
      
      return evaluation;
    } catch (error) {
      throw new Error(`Failed to parse AI response: ${error.message}`);
    }
  }

  private validateImprovementAreas(evaluation: EvaluationResponse): void {
    if (!evaluation.evaluation_summary.promotion_recommendation) {
      // If AI doesn't recommend promotion, ensure improvement areas exist
      if (!evaluation.improvement_areas || evaluation.improvement_areas.length === 0) {
        evaluation.improvement_areas = [
          {
            category: "Overall Assessment",
            description: "Insufficient evidence of required skills for promotion"
          },
          {
            category: "Development Needed",
            description: "Additional experience and skill development required"
          }
        ];
      }
      
      // Filter out invalid improvement areas
      evaluation.improvement_areas = evaluation.improvement_areas.filter(area => 
        area.category && 
        area.description && 
        area.category.trim() !== '' && 
        area.description.trim() !== ''
      );
      
      // Ensure at least 2 improvement areas
      if (evaluation.improvement_areas.length < 2) {
        evaluation.improvement_areas.push({
          category: "Additional Development",
          description: "Need for more experience in key areas"
        });
      }
    }
  }

  // Legacy method for backward compatibility
  async evaluateEmployee(
    userId: string,
    categoryId: string,
    reports: any[],
    messages: any[],
    bucketLevels: any[]
  ) {
    // Convert to new format for backward compatibility
    const request: EvaluationRequest = {
      employeeId: userId,
      bucketId: categoryId,
      chatHistory: messages.map(msg => ({
        sender: msg.sender || 'Unknown',
        message: msg.content || msg.message || '',
        timestamp: msg.timestamp || new Date().toISOString()
      })),
      evaluationPeriod: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
        endDate: new Date().toISOString()
      },
      targetBucketCriteria: {
        name: `Category ${categoryId}`,
        level: "1",
        required_skills: ["Technical skills", "Communication"],
        tools: ["Development tools"],
        knowledge_areas: ["Software development"],
        promotion_criteria: ["Performance", "Skills"]
      }
    };

    return this.analyzeEmployee(request);
  }
} 