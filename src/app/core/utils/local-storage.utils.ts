export enum StorageItem {
  Auth = 'App/auth',
  Theme = 'App/theme',
  idDonDichVu = 'idDonDichVu',
  idNhomDichVu = 'idNhomDichVu',
  user = 'user',
  refreshToken = 'refreshToken',
  accessToken = 'accessToken',
  v2HoSoUngTuyen = 'v2HoSoUngTuyen',
  v2ChiTietKetQua = 'v2ChiTietKetQua',
  v2KetQua = 'v2KetQua',
  orderInformation = 'orderInformation',
  tuyenDung = 'tuyenDung',
  recharge = 'recharge',
  payments = 'payments',
  detailMyOrder = 'detailMyOrder',
  reviewSanPham = 'reviewSanPham',
  chiTietNhapKhoDaiLy = 'chiTietNhapKhoDaiLy',
  chiTietYeuCauBaoGiaDaiLy = 'chiTietYeuCauBaoGiaDaiLy',
  kiemTraBaoGia = 'v3KiemTraBaoGia',
  numberTinTuyenDungBuilder = 'v2NumberTinTuyenDung',
}

export const getItem = (itemName: StorageItem): unknown | null => {
  const item = localStorage.getItem(itemName);
  try {
    return JSON.parse(item!);
  } catch {
    return item;
  }
  // return item ? JSON.parse(item) : null;
};

export const setItem = (itemName: StorageItem, value: unknown): void => {
  localStorage.setItem(itemName, JSON.stringify(value));
};

export const removeItem = (itemName: StorageItem): void => {
  localStorage.removeItem(itemName);
};
