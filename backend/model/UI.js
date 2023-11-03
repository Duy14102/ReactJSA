const mongoose = require("mongoose");
const base64BgHero = require('../assets/base64BgHero')
const base64HeroCircle = require('../assets/base64HeroCircle')
const base64Image1 = require('../assets/base64Image1')
const base64Image2 = require('../assets/base64Image2')
const base64Image3 = require('../assets/base64Image3')
const base64Image4 = require('../assets/base64Image4')
const base64MenuCover = require('../assets/base64MenuCover')
const base64MenuPage = require('../assets/base64MenuPage')

const UISchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true
    },
    image: {
        type: Array
    },
    word: {
        up: {
            type: String
        },
        middle: {
            type: String
        },
        down: {
            type: String
        },
        time: {
            type: String
        },
    }
})

module.exports = mongoose.model.Menu || mongoose.model("UI", UISchema);

const GetUI = mongoose.model("UI");
const array = []
const array2 = []
const array3 = []
const arrayimage = { name: "bghero", url: base64BgHero }
const arrayimage2 = { name: "herocircle", url: base64HeroCircle }
const aboutImage1 = { name: "image1", url: base64Image1 }
const aboutImage2 = { name: "image2", url: base64Image2 }
const aboutImage3 = { name: "image3", url: base64Image3 }
const aboutImage4 = { name: "image4", url: base64Image4 }
const MenuImage = { name: "menucover", url: base64MenuCover }
const MenuImage2 = { name: "menupage", url: base64MenuPage }
array.push(arrayimage, arrayimage2)
array2.push(aboutImage1, aboutImage2, aboutImage3, aboutImage4)
array3.push(MenuImage, MenuImage2)
GetUI.create({ title: "Hero", image: array, "word.up": "Hi There!", "word.middle": "This Is EatCom", "word.down": "We hope you will have a great experience using our services. Have a good day!" }).catch(() => { })
GetUI.create({ title: "About", image: array2, "word.up": "We started from a small cart with a variety of rice dishes. Time passed and gradually more people got to know us and the name EatCom was born.", "word.middle": "We always feel lucky to have received support from everyone, EatCom always brings diners perfect rice dishes from delicious to clean and beautiful.Thank you for trusting and using our services", "word.down": "Enjoy your dishes, if something happens please report right away. And once again thank you!" }).catch(() => { })
GetUI.create({ title: "Menu", image: array3, "word.up": "Hello and thank you for using our service", "word.middle": "This is a menu containing a number of dishes that you can refer to before enjoying", "word.down": "We hope you have a great experience with our services. Have a nice day and enjoy the food" }).catch(() => { })
GetUI.create({ title: "Footer", "word.up": "18 Tam Trinh, Ha Noi, Viet Nam", "word.middle": "+012 345 67890", "word.down": "FreeFire@SDTHT.com", "word.time": "9AM - 10PM" }).catch(() => { })

