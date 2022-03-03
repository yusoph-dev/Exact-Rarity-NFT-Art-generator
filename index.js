"use strict";

const toCSV = require('json-2-csv');
const Filehound = require('filehound');
const basePath = process.cwd();
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
var sha1 = require('sha1');

const mainBuildDir = `${basePath}/build`;

if (!fs.existsSync(mainBuildDir)) {
    fs.mkdirSync(mainBuildDir);
}

var noOfFolder = fs.readdirSync(mainBuildDir).length;

// SET NO. OF NFT's TO GENERATE
var noOfnfts = 10;

const assets_main = Filehound.create()
    .path("assets_main")
    .directory()
    .findSync();

function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

function getFiles(dir, files_) {
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
};

var mainLayers = [];

// GET MAIN LAYERS
if (assets_main.length > 0){
    for (var i = 0; i < assets_main.length; i++){
        
        var layers = [];
        var fileNames = [];
        var files = getFiles(assets_main[i]);
        var total_percentage = 0;

        if (files.length > 0) {
            for (var j = 0; j < files.length; j++) {
                var filename = files[j].split('\\').pop().split('/').pop().replace(/\.[^/.]+$/, "");
                var completeFileName = path.basename(files[j]);

                if (filename != ''){
                    var rarity = Number(filename.split('#')[1]);
                    total_percentage += rarity;
                    var noOfOccurence = (Math.round((rarity / 100) * noOfnfts)).toFixed(2);

                    if (noOfOccurence > 0) {
                        for (var k = 1; k <= noOfOccurence; k++){
                            if(layers.length < noOfnfts){
                                layers.push(filename);
                                fileNames.push(completeFileName)
                            }
                        }
                    }
                }
            }

            if (layers.length < noOfnfts) {
                var noOfRandoms = (noOfnfts - layers.length);

                for (var l = 1; l <= noOfRandoms; l++) {
                    var randomLayer = files[Math.floor(Math.random() * files.length)];

                    var randomFileName = randomLayer.split('\\').pop().split('/').pop().replace(/\.[^/.]+$/, "");
                    var completeFileName = path.basename(randomLayer);

                    layers.push(randomFileName);
                    fileNames.push(completeFileName)
                }
            }
        }

        mainLayers.push({
            directory: assets_main[i],
            folder: assets_main[i].split('/')[1],
            layers: layers,
            completefilenames: fileNames,
        })

        // TEST DATA
        // console.log({
        //     directory: assets_main[i],
        //     folder: assets_main[i].split('/')[1],
            // layers: layers,
            // completefilenames: fileNames,
            // noOfLayers: layers.length,
        //     total_percentage: total_percentage
        // })
    }
}
// process.exit()

// COMBINE MAIN LAYERS TO SKINS
var finalLayers = [];

for(var m = 0; m < noOfnfts; m++){
    var layers_path = [];
    var layers_data = [];
    var part = [];
    var layer_names = [];
    var weights = [];
    for(var n = 0; n < mainLayers.length; n++){
        var weight = 100;


        var randomIndex = Math.floor(Math.random() * mainLayers[n]['completefilenames'].length);
        var randomLayer = mainLayers[n]['completefilenames'][randomIndex];
        var layerName = randomLayer.split('#')[0];
        var weight = parseFloat(randomLayer.split('#')[0].replace(".png", ""));

        // REMOVE LAYER FROM MAINLAYERS BANK DATA
        mainLayers[n]['completefilenames'].splice(randomIndex, 1);

        // PUSH CURRENT LAYERS
        layers_path.push(mainLayers[n]['directory'] + '/' + randomLayer);
        layers_data.push(mainLayers[n]['folder'] + '_' + randomLayer);
        part.push(mainLayers[n]['folder']);
        layer_names.push(layerName);
        weights.push(weight);
        

    }

    var currNftNo = zeroPad((m + 1), 4);
    var nft_name = 'snek' + '-' + currNftNo;
    // console.log(nft_name); // "0005"
    finalLayers[m] = {
                        'paths': layers_path,
                        'layers': layers_data,
                        'part': part,
                        'layer_name': layer_names,
                        'nft_name': nft_name,
                        'weights': weights
                    };
}


// FOLDER PREPARATIONS

const buildDir = `${basePath}/build/Edition ` + noOfFolder;
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
}

const buildImagesFolder = `${basePath}/build/Edition ` + noOfFolder + '/images';
fs.mkdirSync(buildImagesFolder);

const buildJsonFolder = `${basePath}/build/Edition ` + noOfFolder + '/json';
fs.mkdirSync(buildJsonFolder);



var _metadata = [];

// CREATE COMPOSITE AND BUILD IMAGES
if (finalLayers.length > 0) {

    for (var o = 0; o < finalLayers.length; o++) {

        var composite = [];
        var path_to_layer = finalLayers[o]['paths'];
        var part_layer = finalLayers[o]['part'];
        var layer_name = finalLayers[o]['layer_name'];
        var weights = finalLayers[o]['weights'];
        var nft_name = finalLayers[o]['nft_name'];
        var totalWeight = 0;
        var attributes = [];
        var nftNo = (o + 1);

        for (var p = 0; p < path_to_layer.length; p++) {
            if(p > 0){
                composite.push({
                    input: path_to_layer[p],
                    gravity: 'southeast'
                });
            }

            attributes.push({
                "trait_type": part_layer[p],
                "value": layer_name[p],
            });

            totalWeight = parseFloat(totalWeight + weights[p])
        }

        try {
            f3(finalLayers, o, noOfFolder, composite, nft_name)

            async function f3(finalLayers, o, noOfFolder, composite, nft_name) {
                var y = await sharp(finalLayers[o]['paths'][0])
                                .composite(composite)
                                .toFile('build/Edition ' + noOfFolder + '/images/' + finalLayers[o]['nft_name'] + '.png');
                if(y){
                    await console.log('\x1b[36m%s\x1b[0m', 'Generating ' + nft_name + ' ...');
                }
            }

            let newDna = layer_name.join();

            // CREATE INDIVIDUAL JSON FILES
            var singleData = {
                name: nft_name,
                description: nft_name + " description.",
                external_url: "https://NewUriToReplace/" + nftNo,
                image: "ipfs://NewUriToReplace/" + nftNo + ".png",
                dna: sha1(newDna),
                edition: noOfFolder,
                date: new Date().getTime(),
                total_weight: totalWeight,
                compiler: 'Exact Rarity NFT Art generator',
                attributes: attributes,
                // background_color: 'f0f0f0',
                // animation_url: '',
                // youtube_url: '',
            };

            fs.writeFile('build/Edition ' + noOfFolder + '/json/' + nftNo + '.json', JSON.stringify(singleData, null, 4), function (err) {
                if (err) throw err;
            });

            _metadata.push(singleData);

        } catch (err) {
            console.log(err);
        }

    }


    // CREATE MAIN METADATA FILES 
    (async () => {
        try {
            const csv = await toCSV.json2csvAsync(_metadata);
            fs.writeFileSync('build/Edition ' + noOfFolder + '/json/_metadata.csv', csv);
        } catch (err) {
            console.log(err);
        }
    })();
    
    fs.writeFile('build/Edition ' + noOfFolder + '/json/_metadata.json', JSON.stringify(_metadata, null, 4), function (err) {
        if (err) throw err;
        console.log('\x1b[33m%s\x1b[0m', 'NFT MINTING HAS BEEN COMPLETED');
    });

}
