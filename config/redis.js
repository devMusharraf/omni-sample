const redis = require("redis");

const client = redis.createClient({
  url: "redis://localhost:6379"
});

client.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  await client.connect();

  
})();

async function setKey  (key, data) {
await client.set(key, JSON.stringify(data))
return data

}


async function getKey(key) {
  const result = await client.get(key);
  return result ? JSON.parse(result) : null; 
}


async function addToRedis(key, data) {
  await client.lPush(key, JSON.stringify(data));
  return data;
}

async function getFromRedis(key){
  console.log(key ,'----');
  const items = await client.lRange(key, 0, -1);

  return items.map(i => JSON.parse(i))
}
module.exports = {
  client, setKey, getKey, addToRedis, getFromRedis
};
