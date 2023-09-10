const express = require('express');
const jwt = require('jsonwebtoken');
const JWT_TOKEN = "7p5jyZTfniX6YUFJrvb3tTw9Wq";
const url = require('url');

const db = require('./db')
const {ObjectId} = require("mongodb");
let User = null, Messaggi = null, Followers = null, Likes = null;
(async function () {
    User = await db.getOrCreateCollection("user",function (collection){
        collection.createIndex({username:1}, {unique:true})
    })
    Messaggi = await db.getOrCreateCollection("messaggi",function (collection){
        collection.createIndex({creationDate:1})
        collection.createIndex({utente:1,})
    })
    Followers = await db.getOrCreateCollection("followers",function (collection){
        collection.createIndex({segue:1,utente:1},{unique:true})
    })
    Likes = await db.getOrCreateCollection("likes",function (collection){
        collection.createIndex({userId:1,messageId:1},{unique:true})
    })
})()
const router = express.Router();
router.use(async (req, res, next) => {
    let url = req.url.split("/")
    if (url[2] === "social") {
        const token = req.cookies.access_token;
        if (token) {
            jwt.verify(token, JWT_TOKEN, async (err, decoded) => {
                if (err) {
                    res.sendStatus(500)
                } else {
                    let user = await User.findOne({'_id': new ObjectId(decoded.id)})
                    if (user) {
                        delete user.password;
                        req.user = user;
                    }
                }
                next();
            })
            return;
        }
    }
    next();
})
router.delete('/api/social/like/:idMessage', async (req, res) => {
    if (! req.hasOwnProperty("user")) return res.sendStatus(403)
    const userId = req.user._id;
    const messageId = req.params.idMessage;

    try {
        const existingLike = await Likes.findOne({
            userId: new ObjectId(userId),
            messageId: new ObjectId(messageId),
        });

        if (existingLike) {
            await Likes.deleteOne({_id:existingLike._id});

            res.status(200).json({message: 'User has unliked the message'});
        } else {
            res.status(404).json({error: 'Like does not exist'});
        }
    } catch (error) {
        console.error('Error deleting like:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});
router.post('/api/social/like/:idMessage', async (req, res) => {
    if (! req.hasOwnProperty("user")) return res.sendStatus(403)
    const userId = req.user._id;
    const messageId = req.params.idMessage;

    try {
        const existingLike = await Likes.findOne({
            userId: new ObjectId(userId),
            messageId: new ObjectId(messageId),
        });

        if (existingLike) {
            res.status(400).json({error: 'User has already liked the message'});
        } else {
            const newLike = {
                userId: new ObjectId(userId),
                messageId: new ObjectId(messageId),
            };

            await Likes.insertOne(newLike);
            res.status(201).json({ message: 'User has liked the message' });
        }
    } catch (error) {
        console.error('Error creating like:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});
router.get('/api/social/like/:idMessage', async (req, res) => {
    const messageId = req.params.idMessage;

    try {
        let existingLike = null;
        if (req.hasOwnProperty("user")){
            const userId = req.user._id;
            existingLike = await Likes.findOne({
                userId: new ObjectId(userId),
                messageId: new ObjectId(messageId),
            });
        }
        const countLikes = await Likes.count({
            messageId: new ObjectId(messageId),
        });
        res.json({like: existingLike !== null, count:countLikes});
    } catch (error) {
        console.error('Error creating like:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});
router.get('/api/social/followers/:id', async (req, res) => {
    const followeeId = req.params.id;

    try {
        let followers = await Followers.find({segue:new ObjectId(followeeId)}).toArray()
        followers=followers.map((follow)=>{
            return follow.utente
        })
        followers = await User.find({_id: {$in:followers}}).toArray();
        followers =followers.map((user)=>{
            delete user.password;
            return user;
        })
        let following = await Followers.find({utente:new ObjectId(followeeId)}).toArray()
        following = following.map((follow)=>{
            return follow.segue
        })
        following = await User.find({_id: {$in:following}}).toArray();
        following =following.map((user)=>{
            delete user.password;
            return user;
        })

        res.send({
            followers,
            following
        })
    } catch (error) {
        console.error('Error deleting follow relationship:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});
router.delete('/api/social/followers/:id', async (req, res) => {
    if (! req.hasOwnProperty("user")) return res.sendStatus(403)
    const followerId = req.user._id;
    const followeeId = req.params.id;

    try {
        const existingFollow = await Followers.findOne({
            utente: new ObjectId(followerId),
            segue: new ObjectId(followeeId)
        });

        if (existingFollow) {
            await Followers.deleteOne({_id:existingFollow._id});
            res.status(200).json({message: 'User has unfollowed the specified user'});
        } else {
            res.status(404).json({error: 'Follow relationship does not exist'});
        }
    } catch (error) {
        console.error('Error deleting follow relationship:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});
router.post('/api/social/followers/:id', async (req, res) => {
    if (! req.hasOwnProperty("user")) return res.sendStatus(403)
    const followerId = req.user._id;
    const followeeId = req.params.id;

    try {
        const existingFollow = await Followers.findOne({
            utente: new ObjectId(followerId),
            segue: new ObjectId(followeeId)
        });

        if (existingFollow) {
            res.status(400).json({error: 'User is already following the specified user'});
        } else {
            const newFollow = {
                utente: new ObjectId(followerId),
                segue: new ObjectId(followeeId),
            };

            await Followers.insertOne(newFollow);
            res.status(201).json({message: 'User is now following the specified user'});
        }
    } catch (error) {
        console.error('Error creating follow relationship:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});
router.get("/api/auth/signout", async (req, res) => {
    if (req.cookies.access_token) {
        res.clearCookie('access_token');
    }
    res.sendStatus(200)
});
router.get('/api/social/messages/:userId/:idMsg', async (req, res) => {
    const userId = req.params.userId;
    const messageId = req.params.idMsg;

    try {
        const message = await Messaggi.findOne({
            utente: new ObjectId(userId),
            _id: new ObjectId(messageId),
        });

        if (message) {
            res.status(200).json(message);
        } else {
            res.status(404).json({error: 'Message not found'});
        }
    } catch (error) {
        console.error('Error retrieving message:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});
router.get('/api/social/messages/:userId', async (req, res) => {
    const userId = req.params.userId;
    let offset = req.query.offset;
    if (typeof offset === "undefined" || offset === "") offset = "0"
    offset = parseInt(offset)
    try {
        const messages = await Messaggi.find({utente: new ObjectId(userId)}).sort({creationDate: -1}).limit(20).skip(offset).toArray();

        if (messages) {
            res.status(200).json(messages);
        } else {
            res.status(200).json([]);
        }
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});
router.post('/api/auth/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const nome = req.body.nome;
    const cognome = req.body.cognome;
    const bio = req.body.bio;
    let user_exists = await User.findOne({'username': username});
    if (user_exists) {
        return res.status(403).send({
            error: "Username già in uso"
        })
    }
    let user = {
        username: username,
        password: password,
        nome: nome,
        cognome: cognome,
        bio: bio
    }
    await User.insertOne(user)
    res.sendStatus(201);
})
router.post('/api/auth/signin', async (req, res) => {
    const username = req.body.username.toString();
    const password = req.body.password.toString();
    let user = await User.findOne({'username': username, 'password': password})
    if (user) {
        jwt.sign({id: user._id}, JWT_TOKEN, (err, token) => {
            if (err) {
                return res.sendStatus(500)
            }
            res.cookie("access_token", token, {
                httpOnly: true
            }).sendStatus(201);
        })
    } else {
        return res.status(403).send({
            error: "Username o password errati"
        })
    }
})
router.get('/api/social/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findOne({_id: new ObjectId(userId)});
        if (user) {
            let following = await Followers.count({utente: new ObjectId(userId)});
            let followers = await Followers.count({segue: new ObjectId(userId)});
            let me = null;
            if (req.hasOwnProperty("user")){
                me = await Followers.findOne({segue: new ObjectId(userId), utente: req.user._id})
            }
            delete user.password;
            user.following = following;
            user.followers = followers;
            user.hasMyFollow = me !== null;
            res.send(user);
        } else {
            res.status(404).json({error: 'User not found'});
        }
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});
router.get('/api/social/search', async (req, res) => {
    const users = await User.find({
        $expr: {
            $regexMatch: {
                input: {
                    $concat: ["$username", " ", "$nome", " ", "$cognome"]
                },
                regex: req.query.q,
                options: 'i'
            }
        }
    }).toArray();
    for (let user of users) {
        delete user.password;
    }
    res.send(users)
});
router.get('/api/social/whoami', async (req, res) => {
    if (! req.hasOwnProperty("user")) return res.sendStatus(403)
    res.send(req.user)
});
router.post("/api/social/messages", async (req, res) => {
    if (! req.hasOwnProperty("user")) return res.sendStatus(403)
    const message = req.body.message.toString();
    let msg = {
        utente: req.user._id,
        creationDate: new Date(),
        msg: message
    };
    await Messaggi.insertOne(msg)
    res.send(msg)
})
router.get("/api/social/feed", async (req, res) => {
    if (! req.hasOwnProperty("user")) return res.sendStatus(403)
    let offset = req.query.offset;
    if (typeof offset === "undefined" || offset === "") offset = "0"
    offset = parseInt(offset)
    let following = await Followers.find({utente: req.user._id}).toArray();
    let objectList = [req.user._id];
    for (let follow of following) {
        objectList.push(follow.segue)
    }

    let messages = await Messaggi.find({utente: {$in: objectList}}).sort({creationDate: -1}).limit(20).skip(offset).toArray();
    let users = {};
    for (let message of messages) {
        if (!users.hasOwnProperty(message.utente.toString())) {
            let user = await User.findOne({_id: message.utente});
            delete user.password;
            users[message.utente.toString()] = user;
        }
    }
    res.send({
        messages,
        users
    })
})
module.exports = router;