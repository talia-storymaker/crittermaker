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
  "tom"
];

export const critterConfig = {
  eyes: { label: "Eyes", options: catVillagers },
  mouth: { label: "Mouth", options: catVillagers },
} as const;

export type EyeVariant = typeof critterConfig.eyes.options[number];
export type MouthVariant = typeof critterConfig.mouth.options[number];
