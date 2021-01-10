
export interface WilmaError {
  error: WilmaErrorBody;
}

export interface WilmaErrorBody {
  id: string;
  message: string;
  description: string;
  whatnext: string;
  statuscode: number;
}
