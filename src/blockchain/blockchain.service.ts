import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { abi } from './abi';
import { Grade } from 'common/interfaces/grade.interface';

@Injectable()
export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor(private configService: ConfigService) {
    // khởi tạo provider
    this.provider = new ethers.JsonRpcProvider(
      this.configService.get<string>('RPC_URL'),
    );

    // khởi tạo contract instance
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
          practical: Number(section.score.practical).toFixed(2),
          average: Number(section.score.average).toFixed(2),
          isMidtermSet: section.score.isMidtermSet,
          isFinalExamSet: section.score.isFinalExamSet,
          isPracticalSet: section.score.isPracticalSet,
        },
      }));

      return grades;
    } catch (error) {
      console.error('Error details:', error);
      throw new Error(`Failed to fetch grades: ${error.message}`);
    }
  }
}
