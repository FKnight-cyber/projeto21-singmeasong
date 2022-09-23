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
})