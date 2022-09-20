import app from "../app";
import prisma from "../database";
import supertest from "supertest";
import recommendationFactory from "./factories/recommendationFactory";
import { number, string } from "joi";

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "recommendations"`;
});

describe('POST /recommendations/', () => {
    it('returns 201 when successfully insert a recommendation', async () => {
        const recommendation = recommendationFactory();

        const result = await supertest(app).post('/recommendations/').send(recommendation);

        expect(result.status).toBe(201);
    });

    it('returns 409 when try to inster a recommendation with same name', async () => {
        const recommendation = recommendationFactory();

        await supertest(app).post('/recommendations/').send(recommendation);

        const result = await supertest(app).post('/recommendations/').send(recommendation);

        expect(result.status).toBe(409);
    })
});

describe('POST /recommendations/:id/upvote', () => {
    it('returns 200 when successfully upvote', async () => {
        const recommendation = recommendationFactory();

        await supertest(app).post('/recommendations/').send(recommendation);

        const rec = await prisma.recommendation.findUnique({where:{name:recommendation.name}});

        const result = await supertest(app).post(`/recommendations/${rec.id}/upvote`).send();

        expect(result.status).toBe(200);
    });

    it("it returns 404 when there's no recommendation with informed ID", async () => {
        const result = await supertest(app).post(`/recommendations/999999999/upvote`).send();

        expect(result.status).toBe(404);
    });
});

describe('POST /recommendations/:id/downvote', () => {
    it('returns 200 when successfully downvote', async () => {
        const recommendation = recommendationFactory();

        await supertest(app).post('/recommendations/').send(recommendation);

        const rec = await prisma.recommendation.findUnique({where:{name:recommendation.name}});

        const result = await supertest(app).post(`/recommendations/${rec.id}/downvote`).send();

        expect(result.status).toBe(200);
    });

    it("it returns 404 when there's no recommendation with informed ID", async () => {
        const result = await supertest(app).post(`/recommendations/999999999/downvote`).send();

        expect(result.status).toBe(404);
    });

    it("removes recommendation when it's score is below -5", async () => {
        const recommendation = recommendationFactory();

        await supertest(app).post('/recommendations/').send(recommendation);

        const rec = await prisma.recommendation.findUnique({where:{name:recommendation.name}});

        for(let i = 0; i < 6; i++){
            await supertest(app).post(`/recommendations/${rec.id}/downvote`).send();
        };

        const result = await prisma.recommendation.findUnique({where:{name:recommendation.name}});

        expect(result).toBeNull();
    });
});

describe('GET /recommendations', () => {
    it('returns 10 last recommendations', async () => {
        const firstRec = recommendationFactory();
        await supertest(app).post('/recommendations/').send(firstRec);

        for(let i = 0; i < 10;i++){
            const recommendation = recommendationFactory();
    
            await supertest(app).post('/recommendations/').send(recommendation);
        };

        const result = await supertest(app).get('/recommendations/').send();

        expect(result.body).toBeInstanceOf(Array);
        expect(result.body.length).toBeLessThanOrEqual(10);
        expect(result.body.includes(firstRec)).toBe(false);
        result.body.forEach(rec => {
            expect(rec).toHaveProperty('id');
            expect(rec).toHaveProperty('name');
            expect(rec).toHaveProperty('youtubeLink');
            expect(rec).toHaveProperty('score');
        });
    });
});

describe('GET /recommendations:id', () => {
    it('returns a recommendation by ID', async () => {
        const recommendation = recommendationFactory();

        await supertest(app).post('/recommendations/').send(recommendation);

        const rec = await prisma.recommendation.findUnique({where:{name:recommendation.name}});

        const result = await supertest(app).get(`/recommendations/${rec.id}`).send();

        expect(result.body).toHaveProperty('id');
        expect(result.body).toHaveProperty('name');
        expect(result.body).toHaveProperty('youtubeLink');
        expect(result.body).toHaveProperty('score');
    });

    it("returns 404 when informed ID isn't found", async () => {
        const result = await supertest(app).get(`/recommendations/9999999999`).send();

        expect(result.status).toBe(404);
    });
});

describe('GET /recommendations/random', () => {
    it("returns a random recommendations", async () =>{
        const highScoreRecommendation = recommendationFactory();

        await supertest(app).post('/recommendations/').send(highScoreRecommendation);

        const rec = await prisma.recommendation.findUnique({where:{name:highScoreRecommendation.name}});

        for(let i = 0; i <= 10;i++){
            await supertest(app).post(`/recommendations/${rec.id}/upvote`).send();
        };

        for(let i = 0; i < 10;i++){
            const recommendation = recommendationFactory();
    
            await supertest(app).post('/recommendations/').send(recommendation);
        };

        const result = await supertest(app).get('/recommendations/random').send();

        //7 in 10 times result.body will be equal to highScoreRecommendation;

        expect(result.body).toHaveProperty('id');
        expect(result.body).toHaveProperty('name');
        expect(result.body).toHaveProperty('youtubeLink');
        expect(result.body).toHaveProperty('score');
    });

    it("returns 404 when there's no recommendations", async () => {
        const result = await supertest(app).get('/recommendations/random').send();

        expect(result.status).toBe(404);
    });
});


afterAll(async () => {
    await prisma.$disconnect();
})