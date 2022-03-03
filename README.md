
# Exact Rarity NFT Art generator by Yusoph-Dev🔥

![](https://raw.githubusercontent.com/damascus08/Exact-Rarity-NFT-Art-generator/main/banner.gif)

## ASSETS USED FROM "https://nft-inator.com/"

Create generative art by using the sharp and node js. Before you use the generation engine, make sure you have node.js(v10.18.0) installed.

## Installation 🛠️

If you are cloning the project then run this first, otherwise you can download the source code on the release page and skip this step.

```sh
git clone https://github.com/damascus08/exact-nft-rarity.git
```

Go to the root of your folder and run this command if you have yarn installed.

```sh
yarn install
```

Alternatively you can run this command if you have node installed.

```sh
npm install
```

## Usage ℹ️

Create your different layers as folders in the 'assets_main' directory, and add all the layer assets in these directories. You can name the assets anything as long as it has a rarity weight attached in the file name like so: `example element#70.png`. You can optionally change the delimiter `#` to anything you would like to use.

Once you have all your layers, add #(any_number) on filename to add rarity, (per folder should be have a total of 100%).

The `noOfnfts` variable should be set with a value of greater than 0, change the value of this variable depending of the amount of nfts you want to generate. maximum number should be within your machine maximum storage capacity.

The `name` of each layer object represents the name of the folder (in `/assets_main/`) that the images reside in.

When you are ready, run the following command and your outputted art will be in the `build/Edition[#]/images` directory and the json in the `build/Edition[#]/json` directory:

```sh
npm run index.js
```

or

```sh
node index.js
```

The program will output all the images in the `build/Edition[#]/images` directory along with the metadata files in the `build/Edition[#]/json` directory. Each collection will have a `_metadata.json` file that consists of all the metadata in the collection inside the `build/Edition[#]/json` directory. The `build/Edition[#]/json` folder also will contain all the single json files that represent each image file. The single json file of a image will look something like this:

```json
{
  "dna": "d956cdf4e460508b5ff90c21974124f68d6edc34",
  "name": "#1",
  "description": "This is the description of your NFT project",
  "image": "https://NFT.SITE/nft/1.png",
  "edition": 1,
  "date": 1731990799975,
  "attributes": [
    { "trait_type": "background", "value": "baby-blue" },
    { "trait_type": "skin", "value": "abstract" },
    { "trait_type": "expression", "value": "angry" },
    { "trait_type": "clothes", "value": "astronaut-suit" },
    { "trait_type": "eyes", "value": "excited" },
    { "trait_type": "accessories", "value": "mace" },
    { "trait_type": "headgear", "value": "officer" }
  ],
  "compiler": "Exact Rarity NFT Art generator by Yusoph-Dev"
}
```

Hope you create some awesome artworks with this code 🔥
