export interface ChatMessage {
  sender: string;
  message: string;
  timestamp: string;
}

export interface EvaluationRequest {
  employeeId: string;
  bucketId: string;
  chatHistory: ChatMessage[];
  evaluationPeriod: {
    startDate: string;
    endDate: string;
  };
  targetBucketCriteria: {
    name: string;
    level: string;
    required_skills: string[];
    tools: string[];
    knowledge_areas: string[];
    promotion_criteria: string[];
  };
}

export interface EvaluationResponse {
  evaluation_summary: {
    promotion_recommendation: boolean;
    confidence_level: number;
    overall_score: number;
  };
  detailed_metrics: {
    technical_skills_score: number;
    communication_score: number;
    problem_solving_score: number;
    leadership_score: number;
    collaboration_score: number;
  };
  chat_activity_metrics: {
    total_messages: number;
    average_response_time: string;
    message_quality_score: number;
    engagement_level: string;
  };
  ai_insights: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  improvement_areas: ImprovementArea[];
  promotion_readiness_assessment: {
    readiness_percentage: number;
    key_factors: string[];
    timeline_recommendation: string;
  };
  cto_summary: {
    executive_summary: string;
    risk_assessment: string;
    strategic_recommendation: string;
  };
}

export interface ImprovementArea {
  category: string;
  description: string;
} 