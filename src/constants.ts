import type { ScheduleEvent } from './types';

export const DEMO_IMAGE_URL = 'https://i.imgur.com/lJ4a42N.png';

const today = new Date();
const getEventDate = (dayOffset: number, hour: number, minute: number) => {
  const date = new Date(today);
  date.setDate(today.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date;
};

const demoEventsEn: Omit<ScheduleEvent, 'id'>[] = [
  { title: 'Project Kick-off', start: getEventDate(0, 9, 0), end: getEventDate(0, 10, 30), location: 'Room 401', instructor: 'Dr. Evelyn Reed', note: 'Initial planning for the new mobile app.', ocrConfidence: 0.95, boundingBox: { x: 55, y: 125, width: 890, height: 110 }, color: '#3b82f6' },
  { title: 'Team Standup', start: getEventDate(1, 10, 0), end: getEventDate(1, 10, 15), location: 'Main Hall', instructor: 'John Doe', note: 'Daily progress update.', ocrConfidence: 0.98, boundingBox: { x: 55, y: 245, width: 890, height: 110 }, color: '#22c55e' },
  { title: 'Design Review', start: getEventDate(1, 11, 0), end: getEventDate(1, 12, 30), location: 'Design Studio', instructor: 'Jane Smith', note: 'Review wireframes for v1.', ocrConfidence: 0.92, boundingBox: { x: 55, y: 365, width: 890, height: 110 }, color: '#f59e0b' },
  { title: 'Client Meeting', start: getEventDate(2, 14, 0), end: getEventDate(2, 15, 0), location: 'Virtual Call', instructor: 'Dr. Evelyn Reed', note: 'Present demo to stakeholders.', ocrConfidence: 0.96, boundingBox: { x: 55, y: 485, width: 890, height: 110 }, color: '#8b5cf6' },
  { title: 'API Development', start: getEventDate(3, 9, 30), end: getEventDate(3, 12, 0), location: 'Dev Area', instructor: 'Mike Johnson', note: 'Work on authentication endpoints.', ocrConfidence: 0.88, boundingBox: { x: 55, y: 605, width: 890, height: 110 }, color: '#0ea5e9' },
  { title: 'Lunch & Learn', start: getEventDate(3, 12, 0), end: getEventDate(3, 13, 0), location: 'Cafeteria', instructor: 'Jane Smith', note: 'Topic: State Management in React.', ocrConfidence: 0.91, boundingBox: { x: 55, y: 725, width: 890, height: 110 }, color: '#f43f5e' },
];

const demoEventsVi: Omit<ScheduleEvent, 'id'>[] = [
  { title: 'Khởi động dự án', start: getEventDate(0, 9, 0), end: getEventDate(0, 10, 30), location: 'Phòng 401', instructor: 'TS. Bùi Thị Thùy', note: 'Lên kế hoạch ban đầu cho ứng dụng di động mới.', ocrConfidence: 0.95, boundingBox: { x: 55, y: 125, width: 890, height: 110 }, color: '#3b82f6' },
  { title: 'Họp nhóm', start: getEventDate(1, 10, 0), end: getEventDate(1, 10, 15), location: 'Sảnh chính', instructor: 'Nguyễn Văn A', note: 'Cập nhật tiến độ hàng ngày.', ocrConfidence: 0.98, boundingBox: { x: 55, y: 245, width: 890, height: 110 }, color: '#22c55e' },
  { title: 'Đánh giá thiết kế', start: getEventDate(1, 11, 0), end: getEventDate(1, 12, 30), location: 'Xưởng thiết kế', instructor: 'Trần Thị B', note: 'Xem lại wireframe cho phiên bản 1.', ocrConfidence: 0.92, boundingBox: { x: 55, y: 365, width: 890, height: 110 }, color: '#f59e0b' },
  { title: 'Họp với khách hàng', start: getEventDate(2, 14, 0), end: getEventDate(2, 15, 0), location: 'Cuộc gọi trực tuyến', instructor: 'TS. Bùi Thị Thùy', note: 'Trình bày demo cho các bên liên quan.', ocrConfidence: 0.96, boundingBox: { x: 55, y: 485, width: 890, height: 110 }, color: '#8b5cf6' },
  { title: 'Phát triển API', start: getEventDate(3, 9, 30), end: getEventDate(3, 12, 0), location: 'Khu vực dev', instructor: 'Lê Văn C', note: 'Làm việc trên các điểm cuối xác thực.', ocrConfidence: 0.88, boundingBox: { x: 55, y: 605, width: 890, height: 110 }, color: '#0ea5e9' },
  { title: 'Ăn trưa & Học hỏi', start: getEventDate(3, 12, 0), end: getEventDate(3, 13, 0), location: 'Nhà ăn', instructor: 'Trần Thị B', note: 'Chủ đề: Quản lý trạng thái trong React.', ocrConfidence: 0.91, boundingBox: { x: 55, y: 725, width: 890, height: 110 }, color: '#f43f5e' },
];

export const getDemoEvents = (language: 'en' | 'vi'): ScheduleEvent[] => {
    const events = language === 'vi' ? demoEventsVi : demoEventsEn;
    return events.map((event, index) => ({
        ...event,
        id: (index + 1).toString(),
    }));
}