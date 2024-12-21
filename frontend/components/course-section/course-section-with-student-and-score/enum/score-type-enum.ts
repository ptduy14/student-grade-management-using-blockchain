export enum ScoreTypeEnum {
    MIDTERM = "score_midterm_score", // Điểm giữa kỳ
    FINAL = "score_final_score"      // Điểm cuối kỳ
}

interface ScoreTypeNamesType {
    [key: string]: string;
}

export const ScoreTypeNames: ScoreTypeNamesType = {
    [ScoreTypeEnum.MIDTERM]: "Điểm giữa kỳ",
    [ScoreTypeEnum.FINAL]: "Điểm cuối kỳ"
}
