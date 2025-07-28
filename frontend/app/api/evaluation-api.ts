import { getAuthHeaders } from '@app/lib/firebase';
import { BASE_URL, ENDPOINTS } from './api-config';

export interface EvaluationRequest {
  employeeId: string;
  bucketId: string;
  chatHistory: any[];
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
  evaluationId: string;
  timestamp: string;
  employeeId: string;
  bucketId: string;
  evaluation_summary: {
    overall_score: number;
    promotion_recommendation: boolean;
    confidence_level: number;
  };
  detailed_metrics: {
    communication_score: number;
    technical_depth: number;
    problem_solving: number;
    leadership_indicators: number;
    initiative_level: number;
    collaboration_skills: number;
  };
  chat_activity_metrics: {
    total_messages: number;
    average_response_time: string;
    technical_terms_used: number;
    solution_proposals_made: number;
    mentoring_instances: number;
  };
  ai_insights: Array<{
    type: 'positive' | 'improvement';
    category: string;
    description: string;
    evidence: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  improvement_areas: Array<{
    category: string;
    description: string;
    specific_examples: string;
    recommended_actions: string;
  }>;
  promotion_readiness_assessment: {
    meets_criteria: boolean;
    strengths_alignment: number;
    gaps_identified: string[];
    timeline_recommendation: string;
  };
  cto_summary: {
    executive_summary: string;
    key_decision_factors: string[];
    risk_assessment: 'low' | 'medium' | 'high';
    next_steps: string;
  };
}

export const analyzeEvaluationApi = async (request: EvaluationRequest): Promise<EvaluationResponse> => {
  const { uri, method } = ENDPOINTS.evaluation.analyze;
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.details || error.message || 'Failed to analyze evaluation');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to analyze evaluation: ', error);
    throw error;
  }
};

export const promoteEmployeeApi = async (employeeId: string, categoryId: string): Promise<any> => {
  const authHeaders = await getAuthHeaders();

  const res = await fetch(`${BASE_URL}/user/bucket/${employeeId}/promote/${categoryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to promote employee');
  }

  return res.json();
}; 