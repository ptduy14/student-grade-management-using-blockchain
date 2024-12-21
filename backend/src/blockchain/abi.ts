export const abi = [
	{
		"inputs": [
			{
				"internalType": "uint16",
				"name": "_semesterId",
				"type": "uint16"
			},
			{
				"internalType": "uint16",
				"name": "_studentId",
				"type": "uint16"
			},
			{
				"internalType": "uint16",
				"name": "_courseSectionId",
				"type": "uint16"
			},
			{
				"internalType": "uint16",
				"name": "_score",
				"type": "uint16"
			},
			{
				"internalType": "enum ScoreType",
				"name": "_scoreType",
				"type": "uint8"
			}
		],
		"name": "addOrUpdateCourseSection",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_courseSectionAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint16",
				"name": "studentId",
				"type": "uint16"
			},
			{
				"internalType": "uint16",
				"name": "semesterId",
				"type": "uint16"
			}
		],
		"name": "generateStudentSemesterKey",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint16",
				"name": "_semesterId",
				"type": "uint16"
			},
			{
				"internalType": "uint16",
				"name": "_studentId",
				"type": "uint16"
			}
		],
		"name": "getAllCourseSectionInSemester",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint16",
						"name": "courseSectionId",
						"type": "uint16"
					},
					{
						"internalType": "bool",
						"name": "isCourseSectionExisted",
						"type": "bool"
					},
					{
						"components": [
							{
								"internalType": "uint16",
								"name": "midterm",
								"type": "uint16"
							},
							{
								"internalType": "uint16",
								"name": "finalExam",
								"type": "uint16"
							},
							{
								"internalType": "uint16",
								"name": "total",
								"type": "uint16"
							},
							{
								"internalType": "bool",
								"name": "isMidtermSet",
								"type": "bool"
							},
							{
								"internalType": "bool",
								"name": "isFinalExamSet",
								"type": "bool"
							}
						],
						"internalType": "struct Score",
						"name": "score",
						"type": "tuple"
					}
				],
				"internalType": "struct CourseSection[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint16",
				"name": "_semesterId",
				"type": "uint16"
			},
			{
				"internalType": "uint16",
				"name": "_studentId",
				"type": "uint16"
			},
			{
				"internalType": "uint16",
				"name": "_courseSectionId",
				"type": "uint16"
			}
		],
		"name": "getCourseSectionInSemester",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint16",
						"name": "courseSectionId",
						"type": "uint16"
					},
					{
						"internalType": "bool",
						"name": "isCourseSectionExisted",
						"type": "bool"
					},
					{
						"components": [
							{
								"internalType": "uint16",
								"name": "midterm",
								"type": "uint16"
							},
							{
								"internalType": "uint16",
								"name": "finalExam",
								"type": "uint16"
							},
							{
								"internalType": "uint16",
								"name": "total",
								"type": "uint16"
							},
							{
								"internalType": "bool",
								"name": "isMidtermSet",
								"type": "bool"
							},
							{
								"internalType": "bool",
								"name": "isFinalExamSet",
								"type": "bool"
							}
						],
						"internalType": "struct Score",
						"name": "score",
						"type": "tuple"
					}
				],
				"internalType": "struct CourseSection",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint16",
				"name": "",
				"type": "uint16"
			},
			{
				"internalType": "uint16",
				"name": "",
				"type": "uint16"
			}
		],
		"name": "studentSemester",
		"outputs": [
			{
				"internalType": "uint16",
				"name": "semesterId",
				"type": "uint16"
			},
			{
				"internalType": "bool",
				"name": "semesterExisted",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]