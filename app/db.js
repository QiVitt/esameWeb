const {MongoClient} = require('mongodb');
const url = "mongodb://mongosrv";
const client = new MongoClient(url);

let _db=null;
async function waitSomeSecs(){
    return new Promise(function (resolve){
        setTimeout(function (){resolve()},10)
    })
}
module.exports = {
    connect: async () => {
        await client.connect();
        _db = client.db("social");
    },
    getOrCreateCollection: async (name, onFirstCreation) => {
        while (_db === null){
            await waitSomeSecs()
        }
        let collections = await _db.listCollections().toArray();
        let found = false;
        for (let collection of collections){
            if(collection.name === name) found=true;
        }
        if (!found){
            await _db.createCollection(name)
            onFirstCreation(_db.collection(name))
        }
        return _db.collection(name)
    }
};