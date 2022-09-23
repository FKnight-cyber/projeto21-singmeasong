import prisma from "../database";
import { Request,Response } from "express";

export async function clearRecs(req:Request, res:Response){
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
    res.sendStatus(200);
}

export async function populateRecs(req:Request, res:Response){

    await prisma.recommendation.createMany({
        data:[
            {
                name: "Wake me up before you go go",
                youtubeLink: "https://www.youtube.com/watch?v=pIgZ7gMze7A",
                score: 1000
            },
            {
                name: "Itou Kanako - Fatima",
                youtubeLink: "https://www.youtube.com/watch?v=pb9k9NXZ1fY",
                score: 999
            },
            {
                name: "鈴木雅之 『怪物",
                youtubeLink: "https://www.youtube.com/watch?v=xA_4ZFe1TME",
                score: 998
            },
            {
                name: "鈴木雅之『DADDY ! DADDY ! DO ! ",
                youtubeLink: "https://www.youtube.com/watch?v=2Od7QCsyqkE",
                score: 997
            },
            {
                name: "YOASOBI「怪物」Official Music Video　(YOASOBI - Monster)",
                youtubeLink: "https://www.youtube.com/watch?v=dy90tA3TT1c",
                score: 996
            },
            {
                name: "Liar Mask",
                youtubeLink: "https://www.youtube.com/watch?v=hEvLtFnbF7c",
                score: -1000
            },
            {
                name: "Steins;Gate Opening Theme - Hacking to the Gate (Full Version)",
                youtubeLink: "https://www.youtube.com/watch?v=ZGM90Bo3zH0",
                score: 0
            },
            {
                name: "Shoko Nakagawa - Sorairo Days",
                youtubeLink: "https://www.youtube.com/watch?v=PKRUKalbx3s",
                score: 10
            },
            {
                name: "Happiness",
                youtubeLink: "https://www.youtube.com/watch?v=wi8sbvZ0CQE",
                score: 5
            },
            {
                name: "【Ado】阿修羅ちゃん",
                youtubeLink: "https://www.youtube.com/watch?v=cyq5-StPISU",
                score: 8
            },
            {
                name: "【鈴木愛理がAdo「新時代」を熱唱‼】「ONE PIECE FILM RED」主題歌をカバー!!【アニソン神曲カバーでしょdeショー‼】",
                youtubeLink: "https://www.youtube.com/watch?v=KW5ufvUzlgo",
                score: 9999999999999
            },
        ]
    });

    res.sendStatus(200);
}