const jwt = require('jsonwebtoken');
const User = require('../model/user.model');
// ใช้โมดูล jsonwebtoken สำหรับการสร้างและจัดการ JSON Web Tokens

const JWT_SECRET = process.env.JWT_SECRET_KEY;
// รับค่า JWT_SECRET_KEY จาก environment variables

const generateToken = async (userId) => {
    try {
        // ค้นหาผู้ใช้จากฐานข้อมูลโดยใช้ userId
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found"); // ถ้าผู้ใช้ไม่พบ ให้โยนข้อผิดพลาด
        }

        // สร้าง JSON Web Token โดยใช้ userId และ role ของผู้ใช้
        const token = jwt.sign({userId: user._id, role: user.role}, JWT_SECRET, {expiresIn: '1h'});
        return token; // ส่งคืนโทเค็นที่สร้างขึ้น

    } catch (error) {
        console.error("Error generating token", error); // แสดงข้อผิดพลาดในกรณีที่เกิดข้อผิดพลาด
        throw error; // โยนข้อผิดพลาดต่อไป
    }
}

module.exports = generateToken; // ส่งออกฟังก์ชัน generateToken
