// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EducationToken is ERC20 {
    // Mapping để lưu địa chỉ admin
    mapping(address => bool) public admins;

    // Các sự kiện để frontend có thể phát hiện
    event AdminAdded(address indexed newAdmin);
    event AdminRemoved(address indexed removedAdmin);
    event TokensMinted(address indexed to, uint256 amount);
    event TokensTransferred(address indexed from, address indexed to, uint256 amount);

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
        emit AdminAdded(newAdmin); // Phát ra sự kiện khi thêm admin mới
    }

    // Hàm để xóa admin
    function removeAdmin(address adminAddress) external onlyAdmin {
        require(admins[adminAddress], "Address is not an admin");
        admins[adminAddress] = false;
        emit AdminRemoved(adminAddress); // Phát ra sự kiện khi xóa admin
    }

    // Hàm để mint token cho address giảng viên
    function mint(address to, uint256 amount) external onlyAdmin {
        _mint(to, amount);
        emit TokensMinted(to, amount); // Phát ra sự kiện khi mint token
    }

    // Hàm để chuyển token cho address giảng viên
    function transferTokens(address to, uint256 amount) external onlyAdmin {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance to transfer tokens");
        _transfer(msg.sender, to, amount);
        emit TokensTransferred(msg.sender, to, amount); // Phát ra sự kiện khi chuyển token
    }
}
