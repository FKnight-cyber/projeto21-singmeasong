/// <reference types="cypress" />
import chaiJsonSchema from 'chai-json-schema'; 
chai.use(chaiJsonSchema);

const URL = "http://localhost:3000"

beforeEach(() => {
	cy.resetDatabase();
});

describe('GET /', () => {
    it('should list the last ten recommendations', () => {
        cy.visit(`${URL}/`);

        cy.intercept("GET", "http://localhost:5000/recommendations").as("list");

        cy.request("GET","http://localhost:5000/recommendations");

        cy.wait("@list").then(interception => {
            expect(interception.response.body.length).to.be.below(11);
            expect(interception.response.statusCode).eq(200);
        });
    });
});

describe('GET /random', () => {
    it('should return a random recommendation', () => {
        cy.visit(`${URL}/`);

        cy.populateDatabase();

        cy.intercept("GET", "http://localhost:5000/recommendations/random").as("list");

        cy.get('[data-test-id="cy-random-rec"]').click();
        
        cy.request("GET", "http://localhost:5000/recommendations/random");

        cy.wait("@list").then(interception => {
            expect(interception.response.statusCode).eq(200);
            expect(interception.response.body).to.be.jsonSchema({
                "id":Number,
                "name":String,
                "youtubeLink":String,
                "score":Number
            });
        });;
    });
});

describe('GET /top', () => {
    it('should return 10 highest scored recommendations', () => {
        cy.visit(`${URL}/`);

        cy.populateDatabase();

        cy.intercept("GET", `http://localhost:5000/recommendations/top/10`).as("list");

        cy.get('[data-test-id="cy-top-recs"]').click();
        
        cy.request("GET", `http://localhost:5000/recommendations/top/10`);

        cy.wait("@list").then(interception => {
            expect(interception.response.statusCode).eq(200);
            expect(interception.response.body.length).to.be.below(11);
            expect(interception.response.body[0]).to.be.jsonSchema({
                "id":Number,
                "name":String,
                "youtubeLink":String,
                "score":Number
            });
        });
    });
});

describe('GET /top/:amount', () => {
    it('should return specified amount of recomendations ordered by score', () => {
        const amount = 3;

        cy.populateDatabase();

        cy.visit(`${URL}/top/${amount}`);

        cy.request("GET", `http://localhost:5000/recommendations/top/${amount}`).then(res => {
            expect(res.status).eq(200);
            expect(res.body.length).to.be.below(amount+1);
            expect(res.body[0]).to.be.jsonSchema({
                "id":Number,
                "name":String,
                "youtubeLink":String,
                "score":Number
            });
        });
    });
});

describe("GET /:id", () => {
    it("should return a recommendation specified by id", () => {
        cy.populateDatabase();

        cy.request("GET","http://localhost:5000/recommendations/random").then(res => {
            const id = res.body.id
            cy.request("GET", `http://localhost:5000/recommendations/${id}`).then(res => {

                cy.visit(`${URL}/${id}`);

                expect(res.status).eq(200);
                expect(res.body).to.be.jsonSchema({
                    "id":Number,
                    "name":String,
                    "youtubeLink":String,
                    "score":Number
                });
            });
        });    
    });

    it("should return not found when id isn't registered", () => {
        const id = 1002;

        cy.visit(`${URL}/${id}`);

        cy.request({
            method: "GET",
            url: `http://localhost:5000/recommendations/${id}`,
            failOnStatusCode: false
        }).then(res => {
            expect(res.status).eq(404)
        });    
    });
});

describe("POST /" , () => {
    it('create new recommendation', () => {
        cy.visit(`${URL}/`);

        cy.get('[data-test-id="cy-rec-name"]').type("Wake me up before you go go");
        cy.get('[data-test-id="cy-rec-link"]').type("https://www.youtube.com/watch?v=pIgZ7gMze7A");

        cy.intercept("POST", "http://localhost:5000/recommendations").as("create");

        cy.get('[data-test-id="cy-create-rec"]').click();

        cy.wait("@create").then((interception)=> {
            expect(interception.response.statusCode).eq(201);
        });
    });

    it('fails to register a recommendations with same name', () => {
        cy.visit(`${URL}/`);

        cy.populateDatabase();

        cy.get('[data-test-id="cy-rec-name"]').type("Wake me up before you go go");
        cy.get('[data-test-id="cy-rec-link"]').type("https://www.youtube.com/watch?v=pIgZ7gMze7A");

        cy.intercept("POST", "http://localhost:5000/recommendations").as("create");

        cy.get('[data-test-id="cy-create-rec"]').click();

        cy.wait("@create").then((interception)=> {
            expect(interception.response.statusCode).eq(409);
        });
    });
});

describe("POST /:id/upvote", () => {
    it("should increment given recommendation's score" , () => {
        cy.visit(`${URL}/`);

        cy.populateDatabase();

        cy.request("GET","http://localhost:5000/recommendations").then(res => {
            const id = res.body[0].id;
            const currentScore = res.body[0].score;

            cy.intercept("POST", `http://localhost:5000/recommendations/${id}/upvote`).as("upvote");

            cy.get(`[data-test-id=${"upvote" + id}]`).click();

            cy.wait("@upvote").then(interception => {
                expect(interception.response.statusCode).eq(200);

                cy.request("GET", `http://localhost:5000/recommendations/${id}`).then(res => {
                    expect(currentScore).eq(res.body.score-1);
                })
            });
        });
    });

    it("should return not found when id isn't registered" , () => {
        const id = 1002;

        cy.request({
            method:"POST",
            url: `http://localhost:5000/recommendations/${id}/upvote`,
            failOnStatusCode:false
        }).then(res => {
            expect(res.status).eq(404);
        });

    });
});

describe("POST /:id/downvote", () => {
    it("should decrement given recommendation's score" , () => {
        cy.visit(`${URL}/`);

        cy.populateDatabase();

        cy.request("GET","http://localhost:5000/recommendations").then(res => {
            const id = res.body[0].id;
            const currentScore = res.body[0].score;

            cy.intercept("POST", `http://localhost:5000/recommendations/${id}/downvote`).as("downvote");

            cy.get(`[data-test-id=${"downvote" + id}]`).click();

            cy.wait("@downvote").then(interception => {
                expect(interception.response.statusCode).eq(200);

                cy.request("GET", `http://localhost:5000/recommendations/${id}`).then(res => {
                    expect(currentScore).eq(res.body.score+1);
                })
            });
        });
    });

    it("should return not found when id isn't registered" , () => {
        const id = 1002;

        cy.request({
            method:"POST",
            url: `http://localhost:5000/recommendations/${id}/downvote`,
            failOnStatusCode:false
        }).then(res => {
            expect(res.status).eq(404);
        });

    });
});

