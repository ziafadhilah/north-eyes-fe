export interface featureData {
  description: string;
  feature_id: string;
  is_active: boolean;
  name: string;
  order: number;
}

export interface createFeatureData {
  name: string;
  description: string;
  is_active: boolean;
}

export interface editFeatureData {
  name: string;
  description: string;
  is_active: boolean;
  feature_id: string;
}

export interface editFeatureDataStatus {
  is_active: boolean;
}
