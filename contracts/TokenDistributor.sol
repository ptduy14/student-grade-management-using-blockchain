// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TokenDistributor {
    // Mapping để lưu địa chỉ admin
    mapping(address => bool) public admins;

    // Các sự kiện để frontend có thể phát hiện
    event AdminAdded(address indexed newAdmin);
    event AdminRemoved(address indexed removedAdmin);
    event EtherTransferred(address indexed recipient, uint256 amount);

    // Constructor để thiết lập admin
    constructor() {
        admins[msg.sender] = true;  // Đặt admin là người triển khai contract
    }

    // Modifier để kiểm tra xem người gọi có phải là admin không
    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admin can perform this action");
        _;
    }

    // Hàm để thêm admin mới
    function addAdmin(address newAdmin) external onlyAdmin {
        require(!admins[newAdmin], "Address is already an admin");
        admins[newAdmin] = true;
        emit AdminAdded(newAdmin); // Phát ra sự kiện khi thêm admin mới
    }

    // Hàm để xóa admin
    function removeAdmin(address adminAddress) external onlyAdmin {
        require(admins[adminAddress], "Address is not an admin");
        require(admins[msg.sender], "You cannot remove yourself as admin");
        admins[adminAddress] = false;
        emit AdminRemoved(adminAddress); // Phát ra sự kiện khi xóa admin
    }

    // Hàm để admin chuyển Ether cho giảng viên hoặc người khác
    function transferEther(address payable recipient, uint256 amount) public onlyAdmin {
        require(address(this).balance >= amount, "Insufficient Ether.");
        
        // Sử dụng call thay vì transfer để bắt lỗi nếu có
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Transfer failed.");

        emit EtherTransferred(recipient, amount);  // Phát ra sự kiện khi chuyển Ether
    }

    // Hàm nhận Ether vào contract (cho phép hợp đồng nhận Ether)
    receive() external payable {}

    // Hàm để lấy số dư Ether của contract
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
