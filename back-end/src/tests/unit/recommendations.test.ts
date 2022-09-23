import { jest } from "@jest/globals";
import { recommendationRepository } from "../../repositories/recommendationRepository";
import { recommendationService }  from "../../services/recommendationsService";
import recommendationFactory from "../factories/recommendationFactory";

jest.mock("../../repositories/recommendationRepository");

beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
})

describe("Recommendations Service suit test", () => {
    it("should create a new recommendation", async () => {
        const recommendation = recommendationFactory();

        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(():any => {
            return false;
        });

        await recommendationService.insert(recommendation);

        expect(recommendationRepository.create).toBeCalled();
    });

    it("should fail to create a duplicated recommendation", () => {
        const recommendation = recommendationFactory();

        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(():any => {
            return true;
        });

        const result = recommendationService.insert(recommendation);

        expect(result).rejects.toEqual({ 
            type: 'conflict', 
            message: 'Recommendations names must be unique' 
        });
    });

    it("should fail to upvote unregistered recommendation",() => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(():any => {
            return undefined;
        });

        const result = recommendationService.upvote(1);

        expect(result).rejects.toEqual({ 
            type: 'not_found', 
            message: "" 
        });
    });

    it("should upvote registered recommendation",async () => {
        const recommendation = recommendationFactory();

        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(():any => {
            return {
                id:1,
                name:recommendation.name,
                youtubeLink: recommendation.youtubeLink,
                score:0
            };
        });

        await recommendationService.upvote(1);

        expect(recommendationRepository.updateScore).toBeCalled();
    });

    it("should fail to downvote unregistered recommendation",() => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(():any => {
            return undefined;
        });

        const result = recommendationService.downvote(1);

        expect(result).rejects.toEqual({ 
            type: 'not_found', 
            message: "" 
        });
    });

    it("should downvote registered recommendation",async () => {
        const recommendation = recommendationFactory();

        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(():any => {
            return {
                id:1,
                name:recommendation.name,
                youtubeLink: recommendation.youtubeLink,
                score:0
            };
        });

        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce(():any => {
            return {
                score:-1
            };
        });

        await recommendationService.downvote(1);

        expect(recommendationRepository.updateScore).toBeCalled();
    });

    it("should downvote and delete recommendation with score below -5",async () => {
        const recommendation = recommendationFactory();

        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(():any => {
            return {
                id:1,
                name:recommendation.name,
                youtubeLink: recommendation.youtubeLink,
                score:0
            };
        });

        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce(():any => {
            return {
                score:-6
            };
        });

        await recommendationService.downvote(1);

        expect(recommendationRepository.remove).toBeCalled();
    });

    it("should fail to get unregistered recommendation",() => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(():any => {
            return undefined;
        });

        const result = recommendationService.getById(1);

        expect(result).rejects.toEqual({ 
            type: 'not_found', 
            message: "" 
        });
    });

    it("should return registered recommendation", async () => {
        const recommendation = recommendationFactory();

        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(():any => {
            return {
                id:1,
                name:recommendation.name,
                youtubeLink: recommendation.youtubeLink,
                score:0
            };
        });

        const result = await recommendationService.getById(1);

        expect(result).toBeInstanceOf(Object);
        expect(result.id).toBe(1);
        expect(result.name).toBe(recommendation.name);
        expect(result.youtubeLink).toBe(recommendation.youtubeLink);
        expect(result.score).toBe(0)
    });

    it("should return last ten recommendations", async () => {
        const testArr = [
            {
                id:1,
                name:"test2",
                youtubeLink:"https://www.youtube.com/watch?v=chwyjJbcs1Y",
                score:10
            },
            {
                id:2,
                name:"test1",
                youtubeLink:"https://www.youtube.com/watch?v=chwyjJbcs1Y",
                score:20
            },
            {
                id:3,
                name:"test3",
                youtubeLink:"https://www.youtube.com/watch?v=chwyjJbcs1Y",
                score:5
            }
        ];

        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(():any => {
            return testArr;
        });

        const result = await recommendationService.get();

        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(testArr.length);
        result.forEach(rec => {
            expect(rec).toHaveProperty('id');
            expect(rec).toHaveProperty('name');
            expect(rec).toHaveProperty('youtubeLink');
            expect(rec).toHaveProperty('score');
        });
        expect(result[result.length-1]).toEqual(testArr[testArr.length-1]);
    });

    it("should return specified amount of recommendations ordered by score", async () => {
        const testArr = [
            {
                id:1,
                name:"test2",
                youtubeLink:"https://www.youtube.com/watch?v=chwyjJbcs1Y",
                score:10
            },
            {
                id:2,
                name:"test1",
                youtubeLink:"https://www.youtube.com/watch?v=chwyjJbcs1Y",
                score:20
            },
            {
                id:3,
                name:"test3",
                youtubeLink:"https://www.youtube.com/watch?v=chwyjJbcs1Y",
                score:5
            }
        ];

        jest.spyOn(recommendationRepository, "getAmountByScore").mockImplementationOnce(():any => {
            return [
                {
                    id:2,
                    name:"test1",
                    youtubeLink:"https://www.youtube.com/watch?v=chwyjJbcs1Y",
                    score:20
                },
                {
                    id:1,
                    name:"test2",
                    youtubeLink:"https://www.youtube.com/watch?v=chwyjJbcs1Y",
                    score:10
                },
                {
                    id:3,
                    name:"test3",
                    youtubeLink:"https://www.youtube.com/watch?v=chwyjJbcs1Y",
                    score:5
                }
            ];
        });

        const result = await recommendationService.getTop(testArr.length);

        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(testArr.length);
        result.forEach(rec => {
            expect(rec).toHaveProperty('id');
            expect(rec).toHaveProperty('name');
            expect(rec).toHaveProperty('youtubeLink');
            expect(rec).toHaveProperty('score');
        });
        expect(result[0]).toEqual({
            id:2,
            name:"test1",
            youtubeLink:"https://www.youtube.com/watch?v=chwyjJbcs1Y",
            score:20
        });
        expect(result[result.length-1]).toEqual({
            id:3,
            name:"test3",
            youtubeLink:"https://www.youtube.com/watch?v=chwyjJbcs1Y",
            score:5
        });
    });

    it("should return random recommendation", async () => {
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(():any => {
            return [
                {
                    id:1,
                    name:"test1",
                    youtubeLink:"https://www.youtube.com/watch?v=chwyjJbcs1Y",
                    score:10
                },
                {
                    id:2,
                    name:"test2",
                    youtubeLink:"https://www.youtube.com/watch?v=chwyjJbcs1Y",
                    score:-4
                },
            ]
        });

        const result = await recommendationService.getRandom();

        expect(result).toBeInstanceOf(Object);
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('youtubeLink');
        expect(result).toHaveProperty('score');
    });

    it("should fail to return random recommendation", () => {

        jest.spyOn(recommendationRepository, "findAll").mockImplementation(():any => {
            return []
        });
        
        jest.spyOn(recommendationService, "getByScore").mockImplementationOnce(():any => {
            return [];
        });

        const result = recommendationService.getRandom();

        expect(result).rejects.toEqual({ 
            type: 'not_found', 
            message: "" 
        });
    })
})