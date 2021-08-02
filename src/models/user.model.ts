export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
}

export enum UserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export interface UserModel {
  uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  gender?: UserGender;
  photo_url?: string;
  status?: UserStatus;
  auth0_id?: string;
  created_at?: number;
  updated_at?: number;
}