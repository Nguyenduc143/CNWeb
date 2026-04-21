import { Request, Response } from 'express';
import { getConnection } from '../config/db';
import { success, error } from '../utils/response';
import sql from 'mssql';

export const getNewsList = async (req: Request, res: Response) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().execute('sp_GetTinTuc');
    return success(res, { news: result.recordset }, 'Lấy danh sách tin tức thành công');
  } catch (err) {
    console.error('getNewsList error:', err);
    return error(res, 'Lỗi lấy tin tức', 500);
  }
};

export const getNewsDetail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) return error(res, 'Thiếu ID tin tức', 400);

    const pool = await getConnection();
    const result = await pool.request()
      .input('MaTinTuc', sql.Int, id)
      .execute('sp_GetTinTucChiTiet');

    if (result.recordset.length === 0) {
      return error(res, 'Không tìm thấy bài viết', 404);
    }
    
    return success(res, { newsDetail: result.recordset[0] });
  } catch (err) {
    console.error('getNewsDetail error:', err);
    return error(res, 'Lỗi tải bài viết chi tiết', 500);
  }
};
