import { TinhTpResponse } from './50tinh-tp.response.model';

export class QuanHuyenResponse {
  id?: string;
  idTinhTp?: TinhTpResponse;
  ten?: string;
  maQuanHuyen?: string;
  maQuanHuyenViettelPost?: string;
  nameExtension?: [];

  created_at?: string;
  updated_at?: string;
}
