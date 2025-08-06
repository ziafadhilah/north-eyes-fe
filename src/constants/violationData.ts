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
