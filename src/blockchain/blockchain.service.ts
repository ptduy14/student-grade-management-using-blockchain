import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { abi } from './abi';
import { Grade } from 'common/interfaces/grade.interface';
import { PreviousDataScore } from './dto/previous-score-data.dto';
import { ScoresService } from 'src/scores/scores.service';

@Injectable()
export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor(private configService: ConfigService, private readonly scoreService: ScoresService) {
    // Khởi tạo provider
    this.provider = new ethers.JsonRpcProvider(
      this.configService.get<string>('RPC_URL'),
    );

    // Khởi tạo contract instance
    this.contract = new ethers.Contract(
      this.configService.get<string>('CONTRACT_ADDRESS'),
      abi,
      this.provider,
    );
  }

  async getAllGradeByStudentAndSemester(semesterId: number, studentId: number) {
    try {
      const courseSections = await this.contract.getAllCourseSectionInSemester(
        semesterId,
        studentId,
      );

      // Transform data từ blockchain về dạng dễ sử dụng hơn
      const grades: Grade[] = courseSections.map((section) => ({
        courseSectionId: Number(section.courseSectionId),
        isExisted: section.isCourseSectionExisted,
        scores: {
          midterm: Number(section.score.midterm).toFixed(2),
          finalExam: Number(section.score.finalExam).toFixed(2),
          average: Number(section.score.average).toFixed(2),
          isMidtermSet: section.score.isMidtermSet,
          isFinalExamSet: section.score.isFinalExamSet,
        },
      }));

      return grades;
    } catch (error) {
      console.error('Error details:', error);
      throw new Error(`Failed to fetch grades: ${error.message}`);
    }
  }

  async getCourseSectionScoreInSemester(
    semesterId: number,
    studentId: number,
    courseSectionId: number,
  ) {
    try {
      const courseSection = await this.contract.getCourseSectionInSemester(
        semesterId,
        studentId,
        courseSectionId,
      );

      // Transform the data from the blockchain into a structured format
      const grade: Grade = {
        courseSectionId: Number(courseSection.courseSectionId),
        isExisted: courseSection.isCourseSectionExisted,
        scores: {
          midterm: Number(courseSection.score.midterm).toFixed(2),
          finalExam: Number(courseSection.score.finalExam).toFixed(2),
          average: Number(courseSection.score.average).toFixed(2),
          isMidtermSet: courseSection.score.isMidtermSet,
          isFinalExamSet: courseSection.score.isFinalExamSet,
        },
      };

      return grade;
    } catch (error) {
      console.error('Error details:', error);
      throw new Error(`Failed to fetch grade: ${error.message}`);
    }
  }

  async listenTransaction(previousDataScore: PreviousDataScore) {
    try {
      // Lấy thông tin transaction ban đầu
      const transactionReceipt = await this.provider.waitForTransaction(
        previousDataScore.transaction_hash,
      );

      // Kiểm tra nếu transaction đã thành công
      if (transactionReceipt && transactionReceipt.status === 1) {
        console.log('Transaction success:', previousDataScore.transaction_hash);
        // Không cần làm gì nếu transaction thành công
      } else {
        console.log('Transaction failed:', previousDataScore.transaction_hash);
        // Thực hiện rollback dữ liệu
        await this.scoreService.rollbackDataScore(previousDataScore);
      }
    } catch (error) {
      console.error('Error listening to transaction:', error);
    }
  }
}
