const mongoose = require("mongoose");
const Product = require('./models/Product');
const products=[
    {
        name:"OnePlus Nord CE4 Lite 5G ",
        img:"https://m.media-amazon.com/images/I/61Io5-ojWUL._AC_UL480_FMwebp_QL65_.jpg",
        price:17999,
        desc:"OnePlus Nord CE4 Lite 5G (Super Silver, 8GB RAM, 128GB Storage"
    },
    {
        name:"Samsung Galaxy S24 Ultra 5G AI",
        img:"https://m.media-amazon.com/images/I/81vxWpPpgNL._AC_UL480_FMwebp_QL65_.jpg",
        price:131999,
        desc:"Samsung Galaxy S24 Ultra 5G AI Smartphone (Titanium Gray, 12GB, 512GB Storage"
    },
    {
        name:"ZEBRONICS THUNDER Bluetooth",
        img:"https://m.media-amazon.com/images/I/618-45t0P5L._SY450_.jpg",
        price:799,
        desc:"ZEBRONICS THUNDER Bluetooth 5.3 Wireless Headphones with 60H Backup, Gaming Mode,Comfortable Earcups, Call Function(Black)",
    },
    {
        name:"JioTag Air",
        img:"https://m.media-amazon.com/images/I/316sdRiF3ML._AC_UL480_FMwebp_QL65_.jpg",
        price:1499,
        desc:"JioTag Air for iOS|Apple Find My Network Item Finder| Worldwide Tracking for Keys, Wallets, Luggage, Pets, Gadgets and More|1+1 Year Battery| No SIM Needed|120db Sound| BT 5.3",
    },
    {
        name:"Acnos 6 Colours Luminous",
        img:"https://m.media-amazon.com/images/I/71p0rvXWCiL._AC_UL480_FMwebp_QL65_.jpg",
        price:280,
        desc:"Acnos 6 Colours Luminous LED Display Fashionable Children Kids Digital Watches Waterproof Sports Square Electronic Led Watch for Kids Boy Baby Girls Digital Watch for Kids",
    },
    {
        name:"ABULLET 113 Lightweight,Comfortable",
        img:"https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/w/9/d/8-bullet-113-8-action-white-sky-green-original-imagw5wvhaafhb3a.jpeg?q=70",
        price:998,
        desc:"BULLET 113 Lightweight,Comfortable,Trendy,Running, Breathable,Gym Lace-Up Walking Shoes For Men  (White, Blue , 8"
,
    },
    {
        name:"Puma Asteride Sneaker",
        img:"https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/o/b/r/-original-imah4zhpecbuegzv.jpeg?q=70",
        price:1569,
        desc:"Puma Asteride Sneakers For Men  (Black , 9)",
    },
    {
        name:"Dual Time Analog Watch",
        img:"https://rukminim2.flixcart.com/image/612/612/xif0q/watch/c/b/c/-original-imagtduahzwakzzs.jpeg?q=70",
        price:3229,
        desc:"Dual Time Analog Watch - For Men LC07881.346",
    },
    {
        name:"Analog Watch",
        img:"https://rukminim2.flixcart.com/image/612/612/xif0q/watch/t/h/z/-original-imagsyksyjfpaz3n.jpeg?q=70",
        price:3199,
        desc:"Analog Watch - For Men LC07530.451",
    }
]

async function seedDB(){
    await Product.insertMany(products);
    console.log("data seeded successfully");
}

module.exports= seedDB;