

export interface Homepage {
  LoginResult: string;
  WilmaId: string;
  ApiVersion: number;
  FormKey: string;
  Name: string;
  Type: number;
  PrimusId: number;
  School: string;
  Photo: string;
  EarlyEduUser: boolean;
  Roles: Role[];
}

interface Role {
  Slug: string;
  Name: string;
  Type: number;
  PrimusId: number;
  FormKey: string;
  Photo: string;
  EarlyEduUser: boolean;
  School: string;
}


