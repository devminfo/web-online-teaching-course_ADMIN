import { QuanHuyenResponse } from "./60quan-huyen.response.model";

export class PhuongXaResponse {
	id?: string;
	idQuanHuyen?: QuanHuyenResponse;
	ten?: string;
	maPhuongXa?: string;
	maPhuongXaViettelPost?: string;
	nameExtension?: [];
	
	created_at?: string;
	updated_at?: string;

}