export interface CameraData {
  camera_id: string;
  camera_name: string;
  camera_code: string;
  area_id: string;
  url: string;
  description: string;
  // tambahan bisa di comment nanti
  thumbnail: string;
  suspect_count: string;
  confirmed_count: string;
  uniform_violation: string;
  grooming_violation: string;
  strangers_violation: string;
  behavior_violation: string;
}

export interface CreateCameraData {
  camera_name: string;
  camera_code: string;
  area_id: string;
  url: string;
  description: string;
}

export interface EditCameraData {
  camera_name: string;
  camera_code: string;
  camera_id: string;
  area_id: string;
  url: string;
  description: string;
}
