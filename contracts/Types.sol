// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

// Types.sol
struct Score {
    uint16 midterm;
    uint16 finalExam;
    uint16 practical;
    uint16 average;
    bool isMidtermSet;
    bool isFinalExamSet;
    bool isPracticalSet;
}

struct CourseSection {
    uint16 courseSectionId;
    bool isCourseSectionExisted;
    Score score;
}

enum ScoreType {
    Midterm,
    FinalExam,
    Practical
}