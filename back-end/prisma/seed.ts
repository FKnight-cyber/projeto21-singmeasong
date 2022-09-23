import prisma from "../src/database";

export async function main() {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
    
    await prisma.recommendation.createMany({
        data:[
            {
                name: "Wake me up before you go go",
                youtubeLink: "https://www.youtube.com/watch?v=pIgZ7gMze7A",
                score: 1000
            },
            {
                name: "Itou Kanako - Fatima",
                youtubeLink: "https://www.youtube.com/watch?v=FcOKUTnti1o&list=RDGMEMXdNDEg4wQ96My0DhjI-cIg&index=8",
                score: 999
            },
            {
                name: "鈴木雅之 『怪物",
                youtubeLink: "https://www.youtube.com/watch?v=xA_4ZFe1TME&list=RDGMEMXdNDEg4wQ96My0DhjI-cIg&index=1",
                score: 998
            },
            {
                name: "鈴木雅之『DADDY ! DADDY ! DO ! ",
                youtubeLink: "https://www.youtube.com/watch?v=2Od7QCsyqkE&list=RDGMEMXdNDEg4wQ96My0DhjI-cIg&index=2",
                score: 997
            },
            {
                name: "YOASOBI「怪物」Official Music Video　(YOASOBI - Monster)",
                youtubeLink: "https://www.youtube.com/watch?v=dy90tA3TT1c&list=RDGMEMXdNDEg4wQ96My0DhjI-cIg&index=3",
                score: 996
            },
            {
                name: "Liar Mask",
                youtubeLink: "https://www.youtube.com/watch?v=hEvLtFnbF7c&list=RDGMEMXdNDEg4wQ96My0DhjI-cIg&index=4",
                score: -1000
            },
            {
                name: "Steins;Gate Opening Theme - Hacking to the Gate (Full Version)",
                youtubeLink: "https://www.youtube.com/watch?v=ZGM90Bo3zH0&list=RDGMEMXdNDEg4wQ96My0DhjI-cIg&index=5",
                score: 0
            },
            {
                name: "Shoko Nakagawa - Sorairo Days",
                youtubeLink: "https://www.youtube.com/watch?v=ZGM90Bo3zH0&list=RDGMEMXdNDEg4wQ96My0DhjI-cIg&index=6",
                score: 10
            },
            {
                name: "Harmony of One's Heart",
                youtubeLink: "https://www.youtube.com/watch?v=ZGM90Bo3zH0&list=RDGMEMXdNDEg4wQ96My0DhjI-cIg&index=7",
                score: 5
            },
            {
                name: "【Ado】阿修羅ちゃん",
                youtubeLink: "https://www.youtube.com/watch?v=ZGM90Bo3zH0&list=RDGMEMXdNDEg4wQ96My0DhjI-cIg&index=9",
                score: 8
            },
            {
                name: "YOASOBI「ハルジオン」Official Music Video",
                youtubeLink: "https://www.youtube.com/watch?v=ZGM90Bo3zH0&list=RDGMEMXdNDEg4wQ96My0DhjI-cIg&index=10",
                score: 555
            },
        ]
    });
};

main().catch(e => {
    console.log(e);
    process.exit(1);
}).finally(() => {
    prisma.$disconnect();
});