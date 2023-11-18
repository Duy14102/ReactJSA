const mongoose = require("mongoose");

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
const arrayimage = { name: "e4onxrx7hmgzmrbel9jk", url: "https://res.cloudinary.com/dlev2viy9/image/upload/v1700307517/UI/e4onxrx7hmgzmrbel9jk.webp" }
const arrayimage2 = { name: "oh2rwdomomeno4sgguhf", url: "https://res.cloudinary.com/dlev2viy9/image/upload/v1700307518/UI/oh2rwdomomeno4sgguhf.png" }
const aboutImage1 = { name: "k9axej6qza2mzsp8lwvj", url: "https://res.cloudinary.com/dlev2viy9/image/upload/v1700307518/UI/k9axej6qza2mzsp8lwvj.webp" }
const aboutImage2 = { name: "ixdn78iskyewdqszx4rf", url: "https://res.cloudinary.com/dlev2viy9/image/upload/v1700307518/UI/ixdn78iskyewdqszx4rf.webp" }
const aboutImage3 = { name: "ucvurntwkq3pgbvq8scl", url: "https://res.cloudinary.com/dlev2viy9/image/upload/v1700307517/UI/ucvurntwkq3pgbvq8scl.webp" }
const aboutImage4 = { name: "irnkhvizbt88rhedgys2", url: "https://res.cloudinary.com/dlev2viy9/image/upload/v1700307517/UI/irnkhvizbt88rhedgys2.webp" }
const MenuImage = { name: "lsneuszzbne2v2iyecaj", url: "https://res.cloudinary.com/dlev2viy9/image/upload/v1700307517/UI/lsneuszzbne2v2iyecaj.webp" }
const MenuImage2 = { name: "lwur9bwvniiygtyu6daf", url: "https://res.cloudinary.com/dlev2viy9/image/upload/v1700307517/UI/lwur9bwvniiygtyu6daf.webp" }
array.push(arrayimage, arrayimage2)
array2.push(aboutImage1, aboutImage2, aboutImage3, aboutImage4)
array3.push(MenuImage, MenuImage2)
GetUI.create({ title: "Hero", image: array, "word.up": "Hi There!", "word.middle": "This Is EatCom", "word.down": "We hope you will have a great experience using our services. Have a good day!" }).catch(() => { })
GetUI.create({ title: "About", image: array2, "word.up": "We started from a small cart with a variety of rice dishes. Time passed and gradually more people got to know us and the name EatCom was born.", "word.middle": "We always feel lucky to have received support from everyone, EatCom always brings diners perfect rice dishes from delicious to clean and beautiful.Thank you for trusting and using our services", "word.down": "Enjoy your dishes, if something happens please report right away. And once again thank you!" }).catch(() => { })
GetUI.create({ title: "Menu", image: array3, "word.up": "Hello and thank you for using our service", "word.middle": "This is a menu containing a number of dishes that you can refer to before enjoying", "word.down": "We hope you have a great experience with our services. Have a nice day and enjoy the food" }).catch(() => { })
GetUI.create({ title: "Footer", "word.up": "18 Tam Trinh, Ha Noi, Viet Nam", "word.middle": "+012 345 67890", "word.down": "FreeFire@SDTHT.com", "word.time": "9AM - 10PM" }).catch(() => { })

