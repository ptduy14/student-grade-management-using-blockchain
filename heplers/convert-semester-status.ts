export function convertSemesterStatus(status: keyof typeof statusMap) {
  const statusMap = {
    "In Progress": "Đang diễn ra",
    "Not Started": "Chưa bắt đầu",
    Completed: "Đã hoàn thành",
    Cancelled: "Đã hủy",
  };

  return statusMap[status] || "Trạng thái không xác định";
}
