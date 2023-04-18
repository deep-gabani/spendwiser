import { MongoClient } from "mongodb";


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email } = req.body;
    let response;

    const client = await MongoClient.connect("mongodb+srv://deep:lCGV26tOJv6T6BpT@spendwiser.ywcbuvt.mongodb.net/?retryWrites=true&w=majority");
    const db = client.db("spendwiser");
    const collection = db.collection("waitlist");

    const existingUser = await collection.findOne({ email: email });
    if (existingUser) {
      response = {
        message: "Yo! You are already in the waitlist."
      };
    } else {
      await collection.insertOne({ name, email });
      response = {
        message: 'Yay! You are added to the waitlist.'
      };
    }

    client.close();


    res.status(200).json(response);
  }
}
