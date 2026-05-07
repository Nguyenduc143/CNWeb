import nodemailer from 'nodemailer';

export const emailService = {
  sendOTP: async (toEmail: string, otpCode: string, type: 'register' | 'reset_password' = 'register') => {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const subject = type === 'register' 
        ? 'Mã xác thực đăng ký tài khoản (OTP)' 
        : 'Mã xác thực đặt lại mật khẩu (OTP)';
      
      const title = type === 'register' 
        ? 'Xác thực tài khoản của bạn' 
        : 'Yêu cầu đặt lại mật khẩu';
        
      const description = type === 'register' 
        ? 'Cảm ơn bạn đã đăng ký tài khoản. Để hoàn tất việc đăng ký, vui lòng nhập mã xác thực gồm 6 chữ số dưới đây:'
        : 'Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã xác thực gồm 6 chữ số dưới đây để tiếp tục:';

      const mailOptions = {
        from: `"Cửa Hàng Điện Thoại" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #0066cc; text-align: center;">${title}</h2>
            <p>Chào bạn,</p>
            <p>${description}</p>
            <div style="background-color: #f8fafc; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <h1 style="color: #333; letter-spacing: 5px; margin: 0;">${otpCode}</h1>
            </div>
            <p style="color: #e74c3c; font-size: 0.9em;">Lưu ý: Mã xác thực này sẽ hết hạn sau 5 phút.</p>
            <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 0.8em; color: #7f8c8d; text-align: center;">Đây là email tự động, vui lòng không trả lời.</p>
          </div>
        `
      };


      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Lỗi gửi email OTP:', error);
      throw new Error('Không thể gửi email xác thực.');
    }
  }
};
