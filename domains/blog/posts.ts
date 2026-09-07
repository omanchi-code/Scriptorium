export type BlogPost = {
  slug: string;
  title: string;
  category: string; // must match a slug in domains/knowledge/taxonomy.ts
  excerpt: string;
  content: string;
  publishedAt: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "the-god-seed",
    title: "God's Seed",
    category: "theology",
    excerpt:
      "Every seed produces after its own kind, no exceptions — a simple rule of nature that turns out to be one of the clearest ways to understand what it means for Jesus to be called the Son of God.",
    publishedAt: "2026-09-04",
    content: `# A Mango Seed Never Grows Into an Apple Tree

Plant a mango seed in Nigeria, and you get a mango tree. Plant that same seed in Sweden, and the soil doesn't get a vote. It can't decide that the local climate suits apples better. It can't override what's already written into the seed. Seeds don't negotiate with soil — they just produce after their own kind, every time, everywhere, no exceptions.

It's such an obvious rule of nature that we rarely think about it. But it turns out this one principle — *the seed determines the tree, not the ground it's planted in* — might be one of the clearest windows we have into who Jesus actually is.

## An Old Debate, A New Angle

If you've ever talked with a Muslim friend about Jesus, you've probably run into Quran 19:88–92. It's blunt: calling God a Father, saying He "has begotten a Son," is described there as "a grievous thing" — something that would "cleave the skies asunder." Many Muslims hold this verse the way Christians hold John 3:16. It's foundational. It's non-negotiable.

And on the other side, Luke's gospel is just as direct. The angel tells Mary, point blank, that the child she'll carry "shall be called the Son of God." No hedging. No metaphor disclaimer.

So you've got two sacred texts that seem to flatly disagree. Usually, this is where the conversation stalls — everyone retreats to their own book and nobody moves.

But there's a third way into this: instead of starting with the conclusion ("Son of God" — yes or no), start with the *mechanics*. What does the word "seed" actually mean in Scripture? And once you know that, what does it tell you about how Jesus came to be?

## What "Seed" Actually Means

This isn't a poetic stretch. The Bible uses the word "seed" literally, repeatedly, for human conception. Leviticus talks about a man's "seed of copulation." Leviticus 12 describes a woman who has "conceived seed." The pattern is consistent throughout: the man is the seed-bearer. The woman receives the seed — more like soil receiving what's planted in it. That's not me reading something in; it's just how the text uses the word.

So here's the question worth sitting with: if Mary conceived without a man — which, notably, *both* the Bible and the Quran agree on — then whose seed was planted in her?

Not a man's. The text is clear on that point in both traditions. What was "planted," according to Luke, was the Word and Spirit of God overshadowing her. That's the seed.

## Which Means...

If a seed always produces after its own kind — and nothing in nature suggests otherwise — then God's seed can only produce one thing: God's own kind. Not a prophet. Not a especially holy man. A Son, in the most literal sense the analogy can bear.

A mango seed cannot produce an apple tree no matter where you plant it. And God's Word, planted in Mary, could not produce anything less than what it inherently was.

## Why This Matters Beyond the Debate

It would be easy to leave this as a clever argument-winner for online debates with Muslim friends — and it does function that way. But there's a second layer here that's worth sitting with personally, whether you've ever debated anyone or not.

John's gospel says, "as many as received Him, to them gave He power to become the *sons* of God." Same word. Same principle. If God's seed in Mary could only produce a Son — what happens when that same Word takes root in you?

The mango tree doesn't get a vote in what it becomes. But you're not soil. You get to choose what gets planted.

---

*This is one of four lines of evidence explored in* The Sonship of Jesus: Investigations in the Quran & Bible. Available at https://omanchi-job-agbo.selstack.com/ or https://omanchi-job-agbo.netlify.app/.`,
  },
];
