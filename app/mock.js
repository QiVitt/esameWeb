const {ObjectId} = require("mongodb");

(async function(){
    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    const db = require("./db");
    await db.connect();
    const User = await db.getOrCreateCollection("user",function (collection){
        collection.createIndex({username:1}, {unique:true})
    })
    const Messaggi = await db.getOrCreateCollection("messaggi",function (collection){
        collection.createIndex({creationDate:1})
        collection.createIndex({utente:1,})
    })
    const Followers = await db.getOrCreateCollection("followers",function (collection){
        collection.createIndex({segue:1,utente:1},{unique:true})
    })
    const Likes = await db.getOrCreateCollection("likes",function (collection){
        collection.createIndex({userId:1,messageId:1},{unique:true})
    })
    const { faker } = require('@faker-js/faker/locale/it');
    let usernameNoDups =[];
    let idList = [];
    let msgList=[];
    for (let i =0;i<10000; i++){

        let user = {
            nome: faker.person.firstName(),
            cognome: faker.person.firstName(),
            bio: faker.person.bio(),
            password: faker.internet.password()
        }
        do{
            user.username = faker.internet.userName({ firstName: user.nome, lastName: user.cognome})
        }while (usernameNoDups.includes(user.username))
        usernameNoDups.push(user.username);
        await User.insertOne(user);
        let postCount = randomIntFromInterval(10,50);
        for (let j = 0;j<postCount;j++){
            let msg = {
                utente: user._id,
                creationDate: new Date(),
                msg: faker.lorem.text()
            };
            await Messaggi.insertOne(msg);
            msgList.push(msg._id)
        }
        let followCount = randomIntFromInterval(0,Math.min(idList.length-1,100));
        let pickedIndex = [];
        for (let j = 0;j<followCount;j++){
            let ind = 0;
            do {
                ind=randomIntFromInterval(0,idList.length-1)
            }while (pickedIndex.includes(ind))
            pickedIndex.push(ind)
            const newFollow = {
                utente: user._id,
                segue: idList[ind],
            };
            await Followers.insertOne(newFollow);
        }
        let likesCount = randomIntFromInterval(0,Math.min(msgList.length-1,100));
        pickedIndex = [];
        for (let j = 0;j<likesCount;j++){
            let ind = 0;
            do {
                ind=randomIntFromInterval(0,msgList.length-1)
            }while (pickedIndex.includes(ind))
            pickedIndex.push(ind)
            const newLike = {
                userId: user._id,
                messageId: msgList[ind],
            };
            await Likes.insertOne(newLike);
        }
        idList.push(user._id)
        console.log("Mock: ",i,"of",10000, parseInt((i/10000)*100)+"%")
    }
    process.exit(0)
})();