export interface IGuyModel {
  uuid?: string;
  auth0_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  gender?: Gender;
  age?: number;
  area?: string;
  photos?: string[];
  status?: GuyStatus;
  created_at?: number;
  updated_at?: number;
}

export enum GuyStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}
