export interface ViolationData {
  confirmed: number;
  suspect: number;
  violations: {
    behaviour: number;
    grooming: number;
    strangers: number;
    uniform: number;
  };
}

export interface ViolationDataList {
  approved_by: string;
  camera_id: string;
  created_at: string;
  detected: string;
  detected_info: string;
  image: string;
  is_valid: boolean;
  is_confirmed: boolean;
  note: string;
  type: string;
  level?: number;
  updated_at: string;
  video: string;
  violation_id: string;
  changed?: boolean;
}

export interface EditViolationDataList {
  violation_id: string;
  is_valid: boolean;
  is_confirmed?: boolean;
  level?: number;
  // type: string;
  note: string;
}
