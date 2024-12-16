// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./Types.sol";
import "./ICourseSectionManagement.sol";

contract SemesterManagement {
    struct Semester {
        uint16 semesterId;
        uint16[] courseSectionIds;
        bool semesterExisted;
    }

    // studentId => semesterId => Semester;
    mapping (uint16 => mapping(uint16 => Semester)) public studentSemester;

    ICourseSectionManagement private courseSectionContract;

    constructor(address _courseSectionAddress) {
        courseSectionContract = ICourseSectionManagement(_courseSectionAddress);
    }

    // Hàm tạo khóa duy nhất từ studentId và semesterId
    function generateStudentSemesterKey(uint16 studentId, uint16 semesterId) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(studentId, semesterId));
    }

    function addOrUpdateCourseSection(uint16 _semesterId, uint16 _studentId, uint16 _courseSectionId, uint16 _score, ScoreType _scoreType) public returns(bool) {
        bytes32 studentSemesterKey  = generateStudentSemesterKey(_studentId, _semesterId);
        Semester storage semester = studentSemester[_studentId][_semesterId];

        // Kiểm tra học kỳ đã tồn tại chưa
        if (semester.semesterExisted) {
            bool isCourseSectionExistedInSemester = false;
            
            for(uint16 i = 0; i < semester.courseSectionIds.length; i++) {
                if (semester.courseSectionIds[i] == _courseSectionId) {
                    isCourseSectionExistedInSemester = true;
                    break;
                }
            }
            
            if (isCourseSectionExistedInSemester) {
               // Kiểm tra xem điểm loại này đã tồn tại chưa
                CourseSection memory currentSection = courseSectionContract.getCourseSectionScore(studentSemesterKey, _courseSectionId);
                bool isScoreTypeExisted = false;
                
                if (_scoreType == ScoreType.Midterm) {
                    isScoreTypeExisted = currentSection.score.isMidtermSet;
                } else if (_scoreType == ScoreType.FinalExam) {
                    isScoreTypeExisted = currentSection.score.isFinalExamSet;
                }

                if (isScoreTypeExisted) {
                    // Nếu điểm đã tồn tại, gọi hàm update
                    courseSectionContract.updateStudentCourseScore(studentSemesterKey, _courseSectionId, _score, _scoreType);
                } else {
                    // Nếu điểm chưa tồn tại, gọi hàm add
                    courseSectionContract.addCourseSectionScore(studentSemesterKey, _courseSectionId, _score, _scoreType);
                }
            } else {
                // gọi smartcontract CourseSectionManagement.addScrore(_semesterId, _courseSectionId, _score, _scoreType, studentSemesterKey)
                courseSectionContract.addCourseSectionScore(studentSemesterKey, _courseSectionId, _score, _scoreType);
                semester.courseSectionIds.push(_courseSectionId);
            }
        } else {
            // Nếu học kỳ chưa tồn tại, khởi tạo học kỳ mới
            semester.semesterId = _semesterId;
            semester.courseSectionIds.push(_courseSectionId);
            semester.semesterExisted = true;

            studentSemester[_studentId][_semesterId] = semester;

            // Gọi hàm addCourseSectionScore từ CourseSectionManagement cho học phần mới
            courseSectionContract.addCourseSectionScore(studentSemesterKey, _courseSectionId, _score, _scoreType);
        }

        return true;
    }


    function getAllCourseSectionInSemester(uint16 _semesterId, uint16 _studentId) public view returns(CourseSection[] memory) {
        bytes32 studentSemesterKey = generateStudentSemesterKey(_studentId, _semesterId);
        return courseSectionContract.getStudentCourseSections(studentSemesterKey);
    }

    function getCourseSectionInSemester(uint16 _semesterId, uint16 _studentId, uint16 _courseSectionId) public view returns(CourseSection memory) {
        bytes32 studentSemesterKey = generateStudentSemesterKey(_studentId, _semesterId);
        return courseSectionContract.getCourseSectionScore(studentSemesterKey, _courseSectionId);
    }
}