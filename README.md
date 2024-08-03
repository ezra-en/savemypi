# savemypi

Save your Hey Pi AI conversation history for safekeeping.

## To install dependencies:

```bash
bun install
```

## To run:

1. Sign into https://pi.ai and open up Chromme Developer Tools (or your browser's equivalent).
2. Head to the **Network** tab and filter by `Fetch/XHR`. Refresh the Pi website so you get a fresh initial page load.
3. Look for a fetch request that looks like `history?conversation=xxxxxx...` This is the request we are looking to replicate, that `xxxxxx..` string is also your conversation ID.
4. Copy and paste `.env.example` and rename your copy `.env`. These are your details.
5. Copy and paste in your conversation ID into the `CONVERSATION_ID` env variable.
6. Click into the network request and under the **Headers** tab, scroll down to the bottom, you're looking for the `> Request Headers` section.
7. There should be a value there called `Cookie` that looks like `__Host-session=xxxxxx...; __cf_bm=xxxxxx...`.
8. Copy that whole Cookie string and paste it into the `COOKIE` env variable.
9. Now you may run the script. Your conversation history will be in `./saved/{conversationID}`, and in files positively incremented from the current point of your conversation backward.

```bash
bun run index.ts
```

## Limitations

I haven't figured out a way to start from a specific point yet, especially if your conversation is still ongoing with Pi. The cursors change everytime you continue the conversation so if you wanted to just fetch from your last cursor and get the delta, unless I figure out some fancy schmancy diffing algo, I can't say I'd be able to _only_ fetch the difference. There's a way to do it, but again I'd have to sort out duplicated messages and whatnot, I'm not sure whether it'd be worth it (unless this is going to be integrated into the main desktop app, and if so, Inflection, I am open for work ! 😁)

Threads are going to be a bit more complicated as they're considered independent conversations. There is an endpoint to fetch those conversations but then I'm not sure how I'd bring you back to the main conversation. It's implementable though.

This project was created using `bun init` in bun v1.1.17. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
