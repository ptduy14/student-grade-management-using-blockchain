// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./Types.sol";
import "./ICourseSectionManagement.sol";

contract CourseSectionManagement is ICourseSectionManagement {
    // Mapping để lưu địa chỉ của SemesterManagement contract
    address public semesterManagementAddress;
    address public admin;

    // lưu điểm của tất cả học phần dựa trên studentId + semesterId
    mapping (bytes32 => CourseSection[]) private studentCourseSections;

    // điểm của từng học phần dựa trên studentId + semesterId
    mapping (bytes32 => mapping (uint16 => CourseSection)) private courseSectionScore;

    // Mapping để lưu trữ địa chỉ giảng viên cho mỗi học phần
    mapping(uint16 => address) private courseSectionTeachers;

    constructor() {
        admin = msg.sender;
    }

    // Modifier để kiểm tra chỉ cho phép SemesterManagement contract gọi
    modifier onlySemesterManagement() {
        require(msg.sender == semesterManagementAddress, 
                "Only semester management contract can call this function");
        _;
    }

    // Modifier để kiểm tra giảng viên
    modifier onlyTeacher(uint16 _courseSectionId) {
        // Nếu học phần chưa có giảng viên, cho phép thực hiện (giảng viên đầu tiên)
        // Nếu đã có giảng viên, kiểm tra xem có phải giảng viên được chỉ định không
        // Lấy địa chỉ của người gọi transaction gốc
        address originalSender = tx.origin;
        require(
            courseSectionTeachers[_courseSectionId] == address(0) ||
            courseSectionTeachers[_courseSectionId] == originalSender, 
            "Only assigned teacher can perform this action"
        );
        _;
    }

    // Function để cập nhật địa chỉ SemesterManagement
    function updateSemesterManagementAddress(address _semesterManagementAddress) public {
        require(msg.sender == admin, "Only admin can update semester management address");
        require(_semesterManagementAddress != address(0), "Invalid semester management address");
        semesterManagementAddress = _semesterManagementAddress;
    }

     // lấy toàn bộ điểm của các học phần của sinh viên
    function getStudentCourseSections(bytes32 _studentSemesterKey) public view returns(CourseSection[] memory) {
        return studentCourseSections[_studentSemesterKey];
    }

    // lấy toàn bộ điểm của môn học
    function getCourseSectionScore(bytes32 _studentSemesterKey, uint16 _courseSectionId) public view returns(CourseSection memory) {
        return courseSectionScore[_studentSemesterKey][_courseSectionId];
    } 

    function calculateTotalScore(CourseSection storage courseSection) private {
        // Kiểm tra cả 2 điểm đã được nhập chưa
        if (courseSection.score.isMidtermSet && courseSection.score.isFinalExamSet) {
            // Tính điểm theo công thức (giữa kì * 40 + cuối kì * 60) / 100 
            uint256 scoreMidterm = courseSection.score.midterm;
            uint256 scoreFinalExam = courseSection.score.finalExam;
            uint256 total = (scoreMidterm * 40 + scoreFinalExam * 60) / 100;

            // Cập nhật điểm trung bình (chuyển đổi về uint16)
            courseSection.score.total = uint16(total); 
        }
    }

    // Function thêm điểm và tự động assign giảng viên nếu cần
    function addCourseSectionScore(bytes32 _studentSemesterKey, uint16 _courseSectionId, uint16 _score, ScoreType _scoreType) public onlySemesterManagement onlyTeacher(_courseSectionId) {
        require(isValidScore(_score), "Score not valid, must be 0 or between 100 and 999, and divisible by 10!");
        require(!isScoreExistedInCourseSection(_studentSemesterKey, _courseSectionId, _scoreType), "Score is already existed in course !!");

        // Nếu học phần chưa có giảng viên, assign giảng viên hiện tại
        if(courseSectionTeachers[_courseSectionId] == address(0)) {
            courseSectionTeachers[_courseSectionId] = tx.origin;
        }

        CourseSection storage courseSection = courseSectionScore[_studentSemesterKey][_courseSectionId];
        bool isCourseSectionExisted = courseSection.isCourseSectionExisted;

        if (!isCourseSectionExisted) {
            courseSection.isCourseSectionExisted = true;
            courseSection.courseSectionId = _courseSectionId;
            courseSectionScore[_studentSemesterKey][_courseSectionId] = courseSection;
        }

        if (_scoreType == ScoreType.Midterm) {
            courseSection.score.midterm = _score;
            courseSection.score.isMidtermSet = true;
        } else if (_scoreType == ScoreType.FinalExam) {
            courseSection.score.finalExam = _score;
            courseSection.score.isFinalExamSet = true;
        }

        // gọi hàm tính điểm trung bình ở đây
        calculateTotalScore(courseSection);

        if (!isCourseSectionExisted) {
            studentCourseSections[_studentSemesterKey].push(courseSection);
        } else {
            for (uint16 i = 0; i < studentCourseSections[_studentSemesterKey].length; i++) {
                if (studentCourseSections[_studentSemesterKey][i].courseSectionId == _courseSectionId) {
                    studentCourseSections[_studentSemesterKey][i] = courseSection;
                    break;
                }
            }
        }
    }

    // chỉnh sửa điểm học phần
    function updateStudentCourseScore(bytes32 _studentSemesterKey, uint16 _courseSectionId, uint16 _score, ScoreType _scoreType) public onlySemesterManagement onlyTeacher(_courseSectionId) {
        require(courseSectionScore[_studentSemesterKey][_courseSectionId].isCourseSectionExisted, "Course not existed !!");
        require(isScoreExistedInCourseSection(_studentSemesterKey, _courseSectionId, _scoreType), "Score not existed in course !!");
        require(isValidScore(_score), "Score not valid, must be 0 or between 100 and 999, and divisible by 10!");

        CourseSection storage courseSection = courseSectionScore[_studentSemesterKey][_courseSectionId];

        // Cập nhật điểm theo loại
        if (_scoreType == ScoreType.Midterm) {
            courseSection.score.midterm = _score;
        } else if (_scoreType == ScoreType.FinalExam) {
            courseSection.score.finalExam = _score;
        }

        // gọi hàm tính điểm trung bình ở đây
        calculateTotalScore(courseSection); 

        // cập nhật chỉnh sửa vào mảng
        for (uint16 i = 0; i < studentCourseSections[_studentSemesterKey].length; i++) {
            if (studentCourseSections[_studentSemesterKey][i].courseSectionId == _courseSectionId) {
                studentCourseSections[_studentSemesterKey][i] = courseSection;
                break;
            }
        }

    }

    // kiểm tra điểm của môn học đó đã được thêm hay chưa trước khi cho phép update
    function isScoreExistedInCourseSection(bytes32 _studentSemesterKey, uint16 _courseSectionId, ScoreType _scoreType) private view returns (bool) {
        CourseSection storage courseSection = courseSectionScore[_studentSemesterKey][_courseSectionId];

        bool isSet = false;

        if (_scoreType == ScoreType.Midterm) {
            isSet = courseSection.score.isMidtermSet;
        } else if (_scoreType == ScoreType.FinalExam) {
            isSet = courseSection.score.isFinalExamSet;
        }

        return isSet;
    }

    // Function để kiểm tra giảng viên của học phần
    function getCourseSectionTeacher(uint16 _courseSectionId) public view returns (address) {
        return courseSectionTeachers[_courseSectionId];
    }

    // kiểm tra điểm nhập vào phải hợp lệ
    function isValidScore(uint16 _score) private pure returns (bool) {
        return (_score == 0) || ((_score >= 100 && _score <= 999) && (_score % 10 == 0));
    }
}