// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EducationToken is ERC20 {
    // Mapping để lưu địa chỉ admin
    mapping(address => bool) public admins;

    constructor() ERC20("EducationToken", "EDU") {
        admins[msg.sender] = true;
        _mint(msg.sender, 10000 * 10 ** decimals());
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
    }

    // Hàm để xóa admin
    function removeAdmin(address adminAddress) external onlyAdmin {
        require(admins[adminAddress], "Address is not an admin");
        admins[adminAddress] = false;
    }

    // Hàm để mint token cho address giảng viên
    function mint(address to, uint256 amount) external onlyAdmin {
        _mint(to, amount);
    }

    // Hàm để chuyển token cho address giảng viên
    function transferTokens(address to, uint256 amount) external onlyAdmin {
        _transfer(msg.sender, to, amount);
    }
}