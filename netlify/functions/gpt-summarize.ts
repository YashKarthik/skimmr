import * as dotenv from 'dotenv';
import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { Configuration, OpenAIApi } from "openai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { eventNames } from 'process';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

const headers = {
  "Access-Control-Allow-Origin": "*",
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST'
};

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(10, "20 s"),
});

const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {

  if (event.httpMethod != "POST") {
    // most likely a OPTIONS request (preflight)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Use POST request to send data'})
    }
  }

  const question = event.body;

  // Exit if the selected text is useless.
  if (question === undefined || question.length < 7) {
    console.log('QUESTION TOO SHORT:', question)
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ message: "Please select text to summarize." }),
    }
  }

  // Upstash rate-limiter
  const identifier = "api";
  console.log('asking ratelimiter')
  const success = ratelimit.limit(identifier)
    .then(e => { return e})
    .catch(e => { console.log('Error in upstash fetch:', e) })

  if (!success) {
    return {
      statusCode: 429,
      headers: headers,
      body: JSON.stringify({ message: "Woah! Slow down." }),
    }
  }

  try {
    const summarized = await openai.createCompletion({
      model: "text-curie-001",
      prompt: `List the key points from this text: """${question}"""`,
      max_tokens: 100,
      temperature: 0,
    });

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ message: summarized.data.choices[0].text }),
    }
  } catch (e) {
    console.log("ERROR has occured", e.response);
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ message: "Looks like there's been little hiccup in the system. Try again after a while. If it's still broken, DM me on twitter @_yashkarthik" }),
    };
  }
};

export { handler };
