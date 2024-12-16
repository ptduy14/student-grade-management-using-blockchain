// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./Types.sol";

interface ICourseSectionManagement {
    function addCourseSectionScore(bytes32 _studentSemesterKey, uint16 _courseSectionId, uint16 _score, ScoreType _scoreType) external;
    function updateStudentCourseScore(bytes32 _studentSemesterKey, uint16 _courseSectionId, uint16 _score, ScoreType _scoreType) external;
    
    function getStudentCourseSections(bytes32 _studentSemesterKey) external view returns(CourseSection[] memory);
    function getCourseSectionScore(bytes32 _studentSemesterKey, uint16 _courseSectionId) external view returns(CourseSection memory);
}