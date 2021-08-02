import { config } from './../../../config/config';
import { AxiosResponse } from "axios";
import axiosInstance from "../../../@http-api/axios";
import { IGirlModel } from "../../../models/girl.model";
import { IGuyModel } from "../../../models/guy.model";

export default class UserService {
  static me = async (): Promise<AxiosResponse<IGuyModel>> => {
    return await axiosInstance.get('/me');
  }

  // guy apis
  static getGuy = async (uuid: string): Promise<AxiosResponse<IGuyModel>> => {
    return await axiosInstance.get(`/guys/${uuid}`);
  }

  static updateGuy = async (uuid: string, data: IGuyModel): Promise<AxiosResponse<IGuyModel>> => {
    return await axiosInstance.put(`/guys/${uuid}`, data);
  }

  static uploadPhoto = async (uuid: string, data: { base64: string }): Promise<AxiosResponse<IGuyModel>> => {
    return await axiosInstance.patch(`/guys/upload/base64/${uuid}`, data);
  }

  static deletePhotos = async (uuid: string): Promise<AxiosResponse<IGuyModel>> => {
    return await axiosInstance.patch(`/guys/delete/${uuid}/photos`);
  }

  // girl apis
  static getGirl = async (uuid: string): Promise<AxiosResponse<IGirlModel>> => {
    return await axiosInstance.get(`/girls/${uuid}`);
  }

  static getGirls = async (filter: any, page: number): Promise<AxiosResponse<{ users: IGirlModel[]; totalCount: number }>> => {
    return await axiosInstance.get(`/girls/approved?filter=${JSON.stringify(filter)}&page=${page}&numPerPage=${config.NUM_PER_PAGE}`);
  }
}
