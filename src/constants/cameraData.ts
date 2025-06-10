export interface CameraData {
  camera_id: string;
  camera_name: string;
  camera_code: string;
  area_id: string;
  rstv: string;
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
  rstv: string;
  description: string;
}
