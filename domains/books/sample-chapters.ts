export type Citation = { label: string; body: string };
export type SampleBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "citation"; label: string; body: string };

export type SampleChapter = {
  bookSlug: string;
  bookTitle: string;
  bookSubtitle: string;
  epigraph: string;
  epigraphAttribution: string;
  blocks: SampleBlock[];
};

export const SAMPLE_CHAPTERS: SampleChapter[] = [
  {
    bookSlug: "the-sonship-of-jesus",
    bookTitle: "The Sonship of Jesus",
    bookSubtitle: "Investigations in the Quran & Bible",
    epigraph:
      "Except men talk, the Truth will never be heard or revealed; and until Truth comes, ignorance & lies can never be dispelled.",
    epigraphAttribution: "The Author",
    blocks: [
      { type: "paragraph", text: "Four lines of evidence, drawn from the Quran and the Bible together, for who Jesus truly is." },
      { type: "paragraph", text: "SONSHIP speaks to who Jesus was on the earth and who he is in heaven. The Sonship of Jesus is indispensable to Christianity. It is central, it is key, it is fundamental and a foundational cornerstone as far as Christianity is concerned. But crucial and pivotal as Jesus' sonship is to Christians and Christianity, it is vehemently rejected and opposed by Muslims and Islam." },
      { type: "paragraph", text: "A few weeks from when I first openly shared on this subject I heard a Juma'at message on it, a message in which the Islamic scholar eloquently referenced Quran 19 verse 88: \"They say God has begotten a Son.\" \"You have uttered a grievous thing\" — verse 89 concludes." },
      { type: "paragraph", text: "On a personal level I have had to respond to a number of Muslims on social media platforms on this same subject matter, and the debate goes on, unending. Matter of fact it is that debate that I seek to temper. It is the debate that birthed this message, this book; and I am hoping that going through this will put a considerable amount of ice on the arguments and light up the darkness in men's hearts." },
      { type: "citation", label: "Quran · 19:34–35, 88", body: "This was Jesus, Son of Mary: a true account they contend about. It does not behove God to have a son. Too immaculate is He! When He decrees a thing He has only to say: Be, and it is." },
      { type: "citation", label: "Quran · 19:88–92", body: "They say: God has begotten a son. You have uttered a grievous thing, which would cleave the skies asunder, rent the earth, and split the mountains. For they have attributed a son to Ar-Rahman, when it does not behove the Merciful to have a son." },
      { type: "paragraph", text: "As we see clearly, these verses of the Quran contend that God is \"too immaculate\" to beget a Son, and that it \"does not behove Him to have a son.\"" },
      { type: "citation", label: "Luke · 1:31–32, 35", body: "And, behold, thou shalt conceive in thy womb, and bring forth a son, and shalt call his name Jesus. He shall be great, and shall be called the Son of the Highest: and the Lord God shall give unto him the throne of his father David... And the angel answered and said unto her, The Holy Ghost shall come upon thee, and the power of the Highest shall overshadow thee: therefore also that holy thing which shall be born of thee shall be called the Son of God." },
      { type: "paragraph", text: "Did you see that? Here the angel, in announcing Jesus' birth, was unambiguously clear as to who He would be — \"the Son of God.\"" },
      { type: "citation", label: "Luke 1:35 · Literal Bible", body: "The Holy Spirit will come upon you, and the power of the Most High will overshadow you; and for that reason the Holy Child shall be called the Son of God." },
      { type: "paragraph", text: "Let's back up a bit and consider Quran chapter 19, verses 4 to 6 — the account of Zachariah praying and asking God for a son:" },
      { type: "citation", label: "Quran · 19:4–6", body: "And said, O my Lord, my bones decay, my head is white and hoary, yet in calling you, O Lord, I have never been deprived. But I fear my relatives after me; and my wife is barren. So grant me a successor as a favour from You who will be heir to me, and heir to the house of Jacob; and make him obedient to You, O Lord." },
      { type: "paragraph", text: "The reasons for this request, as seen from the verses, are primarily: He is old and passing on from this world. He doesn't trust his relatives. He needed his own blood to manage his estate after he is gone." },
      { type: "paragraph", text: "Now, if having a Son is just for inheriting — so that your name continues, so your lineage doesn't end, someone to sustain and keep your legacy alive — if having a Son is for these reasons, then God would have no need of a Son. For unlike Zachariah, God is eternal. He never grows old, He doesn't die. He is ever and everlasting." },
      { type: "paragraph", text: "This said, the question now becomes: why did God have a Son, if to go by what we said already, He doesn't have need of one? Please hold on to that thought — we will get to it in a bit. For the moment, let's see quickly four Truths that unveil Jesus as the Son of God." },
      { type: "paragraph", text: "Some time ago I heard a pastor say, \"don't go into arguments with a Muslim about Jesus being the Son of God, just ask if he will accept Jesus as Savior.\" I thought to myself — why would anyone accept a thing without knowing exactly what it is they are accepting? Even as Christians, why accept Jesus if you don't have the conviction in your heart that he is the Son of God as he claims he is, or that he is truly who the Bible says he is?" },
      { type: "paragraph", text: "Please hear this: if Jesus being the Son of God is a lie, or something that isn't a certainty, then Christianity as a whole is without foundation, without substance, and quite frankly aseptic." },
      { type: "citation", label: "1 Peter · 3:15", body: "But sanctify the Lord God in your hearts: and be ready always to give an answer to every man that asketh you a reason of the hope that is in you with meekness and fear." },
      { type: "paragraph", text: "To be \"ready always\" you first need to KNOW and be certain about it. To be clear, you don't go quarreling — the verse didn't say to do that; it says instead to \"answer with meekness.\" So no quarrel, no fighting or fussing; but never shy away from a debate. Apostle Paul in Acts 17:2 and 17 debated to make God known. In verse 23 of that same chapter he said, \"For as I passed by, and beheld your devotions, I found an altar with this inscription, To The Unknown God. Whom therefore ye ignorantly worship, him declare I unto you.\"" },
      { type: "paragraph", text: "So my friend, if you can show Muslims these Truths from the Bible — good. If you can show them from the Quran which they bear and believe in, as we are doing through this book, even better. Like Paul, use their object of creed — what they are familiar with, that which they handle and build their beliefs on — to expose to them that which is covered, and unriddle for them the obscure." },
      { type: "heading", text: "Truth I — God's Seed" },
      { type: "paragraph", text: "The Seed always determines the Tree, does it not? Yes! The ground has no power to influence or change that. The ground doesn't determine what crop it brings forth — the seed determines what comes up, one hundred percent. A mango seed, for instance, taken from Nigeria to Sweden and planted, cannot suddenly spring forth as an apple tree because of a change of soil and geography. It cannot. Sweden's soil cannot say, \"because of the weather conditions prevailing here, growing apple suits me better than growing mango, so although a mango seed was planted inside me I will bring it forth as an apple tree.\" That cannot happen anywhere on God's earth, absolutely nowhere. So you must agree, as every man would, that the seed must always, always bring forth its own kind, regardless of the soil in which it is planted." },
      { type: "paragraph", text: "That established, flip in your Bible if you will to Leviticus chapter 15, verses 16 to 18, and also verse 32:" },
      { type: "citation", label: "Leviticus · 15:16–18, 32", body: "And if any man's seed of copulation go out from him, then he shall wash all his flesh in water... This is the law of him that hath an issue, and of him whose seed goeth from him, and is defiled therewith." },
      { type: "paragraph", text: "Notice that here the Bible refers to man's sperm as Seed. Now let's proceed to Leviticus 12:2:" },
      { type: "citation", label: "Leviticus · 12:2", body: "Speak unto the children of Israel, saying, If a woman have conceived seed, and born a man child: then she shall be unclean seven days." },
      { type: "paragraph", text: "\"Conceived seed.\" That is what I wanted you to see — the woman is a receiver of Seed, more like the ground or soil that takes in seed. This I believe is the reason why productive women are said to be fertile, like a fruitful land. Tracing genealogy through the Father is further attestation that he is the seed-bearer; the man pours himself into the woman, much like planting seed into the ground — so she receives and brings forth the seed planted in her." },
      { type: "paragraph", text: "I must acknowledge here that the woman, like the soil, makes input too — the mango's size may change, taste may differ, the tree may come up stunted. Certain of her characteristics will show in the child for sure, but ultimately the tree — the child, in this case — that comes forth is of the seed that is planted inside her." },
      { type: "paragraph", text: "So again: a mango seed will always come forth as a mango tree. Now, a man's seed — say Joseph's seed — inside of Mary would mean that what she is bringing forth is of that seed, a man's child, Joseph's child. But since the Quran agrees with the Bible's position that Mary didn't get pregnant by a man's seed but because God pronounced her pregnant and she became so, that Word of God that made her pregnant becomes the Seed inside her — and what she brought forth is therefore of that seed: the Son of God!" },
      { type: "paragraph", text: "Is this clear enough? Does this show Jesus as God's Son? I absolutely believe it does. Just as surely as a mango seed will always bring forth a mango tree, God's seed — His Word, in this case — will always bring forth God's Tree: God's Son. This seed-and-tree typification is Truth Number One that reveals Jesus as the Son of God to us — Jesus is of God's seed, God's Word, and that makes him God's Son." },
    ],
  },
];
