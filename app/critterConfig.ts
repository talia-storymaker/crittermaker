interface topType {
  name: string;
  sleeves: "long" | "short" | "none";
  type: "shirt" | "dress";
}

const catVillagers = [
  "ankha",
  "bob",
  "felicity",
  "kabuki",
  "katt",
  "kid-cat",
  "kiki",
  "kitty",
  "lolly",
  "merry",
  "mitzi",
  "moe",
  "monique",
  "olivia",
  "punchy",
  "purrl",
  "raymond",
  "rosie",
  "rudy",
  "stinky",
  "tabby",
  "tangy",
  "tom",
];

const acnhTops: topType[] = [
  { name: "argyle-sweater", sleeves: "long", type: "shirt" },
  { name: "athletic-jacket", sleeves: "long", type: "shirt" },
  { name: "blossom-tee", sleeves: "short", type: "shirt" },
  { name: "bulldog-jacket", sleeves: "long", type: "shirt" },
  { name: "dazed-dress", sleeves: "short", type: "dress" },
  { name: "dreamy-sweater", sleeves: "long", type: "shirt" },
  { name: "flapper-dress", sleeves: "none", type: "dress" },
  { name: "kabuki-actor-yukata", sleeves: "long", type: "dress" },
  { name: "kung-fu-tee", sleeves: "short", type: "shirt" },
  { name: "loose-fall-dress", sleeves: "long", type: "dress" },
  { name: "madras-plaid-shirt", sleeves: "short", type: "shirt" },
  { name: "old-school-jacket", sleeves: "long", type: "shirt" },
  { name: "palatial-tank-dress", sleeves: "none", type: "dress" },
  { name: "retro-dress", sleeves: "short", type: "dress" },
  { name: "simple-parka", sleeves: "long", type: "shirt" },
  { name: "snowy-sweater", sleeves: "long", type: "shirt" },
  { name: "sweetheart-dress", sleeves: "short", type: "dress" },
  { name: "tweed-dress", sleeves: "long", type: "dress" },
  { name: "visual-punk-dress", sleeves: "short", type: "dress" },
  { name: "waistcoat", sleeves: "none", type: "shirt" },
];

export const critterConfig = {
  eyes: { label: "Eyes", options: catVillagers },
  mouth: { label: "Mouth", options: catVillagers },
  tops: { label: "Tops", options: acnhTops },
} as const;

export type EyeVariant = (typeof critterConfig.eyes.options)[number];
export type MouthVariant = (typeof critterConfig.mouth.options)[number];
export type TopVariant = (typeof critterConfig.tops.options)[number];
