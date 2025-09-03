// const { createClient } = require("redis")

// async function main(){
//     const client = createClient() 

//     client.on('error', (err) => console.error('Redis Client Error', err))

//     await client.connect();
//     await client.set("framework", "Nodejs + redis");
//     const value = await client.get("framework");

//     console.log("value from redis", value)

//      await client.hSet("Object", { obj1: "1", obj2: "2"})
//     const object = await client.hGetAll("Object")
//     console.log(object)

//     await client.lPush("tasks", "task1")
//     await client.lPush("tasks", "task2");
//     console.log(await client.lRange("tasks", 0, -1));
//     await client.sAdd("tags", "redis", "nodejs", "redis")
//     console.log(await client.sMembers("tags"))
//     await client.set("counter", 0)
//     await client.incr("counter")
//    console.log( await client.get("counter"))
// const visits = await client.incr("visit")
// console.log(visits)

// await client.hSet("user:1", { name: "Alice", age: "25", city: "Paris"})
// console.log(await client.hGetAll("user:1"))
// console.log(await client.hGet("user:1", "name"))

// await client.hSet("book:1", {title: "Redis Essentials", author: "John Doe", year: "2023"})
// console.log(await client.hGet("book:1", "title"))
// console.log(await client.hGetAll("book:1"))
// await client.sAdd("tags", "redis", "nodejs", "backend");
//   await client.sAdd("tags", "redis");
// console.log(await client.sMembers("tags"))
//     await client.quit();
// }

// main()

// exports.module = main