import { AxiosResponse } from "axios";
import { UserGender, UserModel } from "../../../models/user.model";
import axiosInstance from "../../../@http-api/axios";
import { IGuyModel } from "../../../models/guy.model";

export interface IJoinWaitingListReqData {
  email: string;
  name: string;
  gender: UserGender;
}

export interface ISignupReqData {
  email: string;
  password: string;
}

export interface ILoginReqData {
  username: string;
  password: string;
}

export interface IAuthResData {
  id_token: string;
  user: IGuyModel;
}

export default class AuthService {
  static joinWaitingList = async (data: IJoinWaitingListReqData): Promise<AxiosResponse<UserModel>> => {
    return await axiosInstance.post('/auth/joinwaitinglist', data);
  }

  static signup = async (data: ISignupReqData): Promise<AxiosResponse<IAuthResData>> => {
    return await axiosInstance.post('/auth/signup', data);
  }

  static login = async (data: ILoginReqData): Promise<AxiosResponse<IAuthResData>> => {
    const resp = await axiosInstance.post('/auth/login', data);
    localStorage.setItem("privatedate.id_token", resp.data.id_token);

    return resp;
  }

  static resetPassword = async (data: { email: string }): Promise<AxiosResponse<String>> => {
    return await axiosInstance.patch('/auth/changepassword', data);
  }
}
