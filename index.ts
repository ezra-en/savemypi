const conversationID = process.env.CONVERSATION_ID;
const cookie = process.env.COOKIE;

if (!conversationID || !cookie) {
  console.log(
    `You didn't make your own .env. Copy and paste the .env.example file and rename it when you place your details in it.`
  );
} else if (
  conversationID === "xxxxxxxxxxxxxxxxxxxxx" ||
  cookie ==
    "__Host-session=xxxxxxxxxxxxxxxxxxxxx; __cf_bm=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
) {
  console.log(
    "You've copied the .env.example and made your own .env, but you haven't changed the details from the placeholder ones. Do me a favor and check that you haven't placed your details into the .env.example, yeah?"
  );
} else {
  console.log(
    `Starting export of conversation ${conversationID}. This will take some time in order to not run afoul of rate limits (two seconds per request.)\nCookie: ${cookie}`
  );
  fetchNext(0);
}

let savedTimestamp;
async function fetchNext(index: number, prevCursor?: string) {
  let res: Response;
  if (index === 0 && prevCursor === undefined) {
    res = await fetch(
      `https://pi.ai/api/chat/history?conversation=${conversationID}`,
      {
        headers: {
          Cookie: cookie,
        },
      }
    );
    console.log(`Fetching first set of messages...`);
  } else {
    res = await fetch(
      `https://pi.ai/api/chat/history?conversation=${conversationID}&cursor=${encodeURIComponent(
        prevCursor
      )}`,
      {
        headers: {
          Cookie: cookie,
        },
      }
    );
  }

  const data = await res.json();
  if (index === 0) {
    savedTimestamp = data.messages[0].sentAt;
    console.log(savedTimestamp);
  }
  if (data.messages.length === 0) {
    console.log(
      "WARNING: You don't appear to have any messages in this chunk. It might be a good idea to refresh and re-copy your cookie string as this happens if your session is invalid."
    );
  }

  await Bun.write(
    `./saved/${conversationID}-${encodeURIComponent(
      savedTimestamp
    )}/history${index}.json`,
    JSON.stringify(data)
  );
  console.log(`next: ${data.cursor}, index: ${index}`);
  if (data.cursor != null) {
    const i = index + 1;
    setTimeout(() => fetchNext(i, data.cursor), 2000);
  } else {
    console.log(
      `Your conversation since ${savedTimestamp} has been exported, a total of ${
        index + 1
      } file${
        index + 1 === 1 ? "" : "s"
      }. \nPlease check your final file (./saved/${conversationID}-${encodeURIComponent(
        savedTimestamp
      )}/history${index}.json) to ensure we did not accidentally encounter a TooManyRequests error and fail to save your full history.`
    );
  }
}
// TODO: implement delta with sid, maybe sqlite db?
// TODO: implement conversations support. unclear how to find the root conversation programmatically, but the https://pi.ai/api/conversations endpoint does list the threads
