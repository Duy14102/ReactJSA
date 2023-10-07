// Connect to MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/MongoReact', {
    useNewUrlParser: true,
    useUnifiedTopology: true
},).then(() => console.log('Connected To MongoDB')).catch((err) => { console.error(err); });

// Backed and express
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
console.log("App listen at port 3000");
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(bodyParser.text({ limit: '200mb' }));
app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {
    resp.send("App is working");
});

app.listen(3000);

// Register
const bcrypt = require("bcrypt");
const User = require("./model/Users");
const getUserD = mongoose.model("Users");

app.post("/Register", (request, response) => {
    // hash the password
    bcrypt
        .hash(request.body.password, 10)
        .then((hashedPassword) => {
            // create a new user instance and collect the data
            const user = new User({
                email: request.body.email,
                password: hashedPassword,
                fullname: request.body.fullname,
                phonenumber: request.body.phone,
                role: 1,
            });

            // save the new user
            user
                .save()
                // return success if the new user is added to the database successfully
                .then((result) => {
                    console.log(result);
                    response.status(201).send({
                        message: "User Created Successfully",
                        fullname: user.fullname,
                    });
                })
                // catch error if the new user wasn't added successfully to the database
                .catch((error) => {
                    response.status(500).send({
                        message: "Error creating user",
                        error,
                    });
                });
        })
        // catch error if the password hash isn't successful
        .catch((e) => {
            response.status(500).send({
                message: "Password was not hashed successfully",
                e,
            });
        });
});

// Add Admin
app.post("/AddAdmin", (request, response) => {
    // hash the password
    bcrypt
        .hash(request.body.password, 10)
        .then((hashedPassword) => {
            // create a new user instance and collect the data
            const user = new User({
                email: request.body.email,
                password: hashedPassword,
                fullname: request.body.fullname,
                role: 2,
            });

            // save the new user
            user
                .save()
                // return success if the new user is added to the database successfully
                .then(() => {
                    response.status(201).send({
                        message: "User Created Successfully",
                        fullname: user.fullname,
                    });
                })
                // catch error if the new user wasn't added successfully to the database
                .catch((error) => {
                    response.status(500).send({
                        message: "Error creating user",
                        error,
                    });
                });
        })
        // catch error if the password hash isn't successful
        .catch((e) => {
            response.status(500).send({
                message: "Password was not hashed successfully",
                e,
            });
        });
});

// Login
const jwt = require('jsonwebtoken');

app.post("/Login", (request, response) => {
    // check if email exists
    User.findOne({ email: request.body.email })

        // if email exists
        .then((user) => {
            // compare the password entered and the hashed password found
            bcrypt
                .compare(request.body.password, user.password)

                // if the passwords match
                .then((passwordCheck) => {

                    // check if password matches
                    if (!passwordCheck) {
                        return response.status(400).send({
                            message: "Passwords does not match",
                            error,
                        });
                    }

                    //   create JWT token
                    const token = jwt.sign(
                        {
                            userId: user._id,
                            userEmail: user.email,
                            userRole: user.role,
                        },
                        "RANDOM-TOKEN",
                        { expiresIn: "24h" }
                    );
                    //   return success response
                    response.status(200).send({
                        message: "Login Successful",
                        email: user.email,
                        token,
                        fullname: user.fullname,
                        role: user.role,
                    });
                })
                // catch error if password does not match
                .catch((error) => {
                    response.status(400).send({
                        message: "Passwords does not match",
                        error,
                    });
                });
        })
        // catch error if email does not exist
        .catch((e) => {
            response.status(404).send({
                message: "Email not found",
                e,
            });
        });
});

//Add address user cart
app.post("/AddAddressUser", async (req, res) => {
    try {
        getUserD.updateOne({ _id: req.body.id }, {
            $push: {
                address: req.body.address
            }
        }).then(() => {
            res.send("success")
        }).catch((err) => {
            console.log(err);
        })
    } catch (e) {
        console.log(e);
    }
})

//Remove address user
app.post("/RemoveAddressUser", (req, res) => {
    try {
        getUserD.updateOne({ _id: req.body.userid }, {
            $pull: {
                address: req.body.address
            }
        }).then(() => {
            res.send("success")
        }).catch((err) => {
            console.log(err);
        })
    } catch (e) {
        console.log(e);
    }
})

//Get User Data
app.get("/GetAllUser", async (req, res) => {
    const sort = { role: -1 }
    try {
        const getuser = await getUserD.find().sort(sort);
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}
        results.total = getuser.length
        results.pageCount = Math.ceil(getuser.length / limit)

        if (end < getuser.length) {
            results.next = {
                page: page + 1
            }
        }
        if (start > 0) {
            results.prev = {
                page: page - 1
            }
        }

        results.result = getuser.slice(start, end)
        res.send({ results });
    } catch (e) {
        console.log(e);
    }
})

//Get Detail User
app.get("/GetDetailUser", async (req, res) => {
    try {
        const getMenuDetail = await getUserD.findOne({ _id: req.query.userid })
        res.send({ data: getMenuDetail });
    } catch (e) {
        console.log(e);
    }
})

//Update User
app.post("/UpdateUser", async (req, res) => {
    const { base64 } = req.body;
    try {
        User.findOne({ _id: req.body.updateid }).then(async (user) => {
            var hashed = ""
            if (req.body.updatepassword) {
                const compare = await bcrypt.compare(req.body.updatepassword, user.password)
                if (compare) {
                    hashed = user.password
                } else {
                    hashed = await bcrypt.hash(req.body.updatepassword, 10)
                }
            } else {
                hashed = user.password
            }
            getUserD.updateOne({ _id: req.body.updateid },
                {
                    email: req.body.updateemail,
                    password: hashed,
                    fullname: req.body.updatefullname,
                    phonenumber: req.body.updatephone,
                    userimage: base64
                }
            ).then(() => {
                res.send({ data: "Updated" })
            }).catch((err) => {
                res.send({ data: err })
            })
        })
    } catch (e) {
        console.log(e);
    }
})

// Add Menu
const Menu = require('./model/Menu');
app.post("/UploadMenu", (request, response) => {
    const { base64 } = request.body;
    // create a new user instance and collect the data
    const menu = new Menu({
        foodname: request.body.foodname,
        foodprice: request.body.foodprice,
        foodquantity: request.body.foodquantity,
        foodcategory: request.body.foodcategory,
        fooddescription: request.body.fooddescription,
        foodimage: base64
    });

    // save the new user
    menu
        .save()
        // return success if the new user is added to the database successfully
        .then((result) => {
            response.status(201).send({
                message: "User Created Successfully",
            });
        })
        // catch error if the new user wasn't added successfully to the database
        .catch((error) => {
            response.status(500).send({
                message: "Error creating user",
                error,
            });
        });
});

// Add Order
const Order = require('./model/Order');
app.post("/UploadOrder", (req, res) => {
    const order = new Order({
        user: req.body.user,
        phonenumber: req.body.phonenumber,
        address: req.body.address,
        paymentmethod: req.body.paymentmethod,
        shippingfee: req.body.shippingfee,
        status: 1,
        orderitems: req.body.orderitems
    })

    order.save()
        .then((result) => {
            res.status(201).send({
                message: result._id
            });
        })
        .catch((error) => {
            res.status(500).send({
                message: "Error creating user",
                error,
            });
        })
})

//Get Order
const getThisOrder = mongoose.model("Orders");
app.get("/GetThisOrder", async (req, res) => {
    try {
        const getIt = await getThisOrder.find({ _id: req.query.id })
        res.send({ data: getIt });
    } catch (e) {
        res.status(500).send({
            message: "Error",
        });
    }
})

//Get Order UserPanel
app.get("/GetOrderUserPanel", async (req, res) => {
    try {
        const datad = await getThisOrder.find({ user: { $elemMatch: { id: req.query.id } } })
        res.send({ data: datad })
    } catch (e) {
        console.log(e);
    }
})

//Get all order
app.get("/GetAllOrder", async (req, res) => {
    const filter = { datetime: -1 }
    try {
        const getOrder = await getThisOrder.find({}).sort(filter)
        res.send({ data: getOrder })
    } catch (e) {
        console.log(e);
    }
})

//Update status order
app.post("/UpdateStatusOrder", (req, res) => {
    try {
        getThisOrder.updateOne({ _id: req.query.id }, {
            status: req.query.status
        }).then(() => {
            res.send({ data: "Updated" })
        }).catch((err) => {
            console.log(err);
        })
    } catch (e) {
        console.log(e);
    }
})

//Deny Order status
app.post("/DenyOrder", (req, res) => {
    try {
        getThisOrder.updateOne({ _id: req.query.id }, {
            denyreason: req.query.reason,
            status: req.query.status
        }).then(() => {
            res.send({ data: "Updated" })
        }).catch((err) => {
            console.log(err);
        })
    } catch (e) {
        console.log(e);
    }
})

//Get Menu
const getThisMenu = mongoose.model("Menu");
app.get("/GetThisMenu", async (req, res) => {
    try {
        const getIt = await getThisMenu.find({ foodcategory: req.query.Name });
        res.send({ data: getIt });
    } catch (e) {
        console.log(e);
    }
})

//Get Cart Item
app.get("/GetCartItem", async (req, res) => {
    try {
        const getIt = await getThisMenu.find({ foodname: req.query.name });
        res.send({ data: getIt, quantity: req.query.quantity });
    } catch (e) {
        console.log(e);
    }
})

//Get Menu 4 Admin
app.get("/GetAdminMenu", async (req, res) => {
    try {
        const getIt = await getThisMenu.find({});
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}
        results.total = getIt.length
        results.pageCount = Math.ceil(getIt.length / limit)

        if (end < getIt.length) {
            results.next = {
                page: page + 1
            }
        }
        if (start > 0) {
            results.prev = {
                page: page - 1
            }
        }

        results.result = getIt.slice(start, end)
        res.send({ results });
    } catch (e) {
        console.log(e);
    }
})
//Get Detail Menu
app.get("/GetDetailMenu", async (req, res) => {
    try {
        const getMenuDetail = await getThisMenu.findOne({ foodname: req.query.foodid })
        res.send({ data: getMenuDetail });
    } catch (e) {
        console.log(e);
    }
})

//Get Search
app.get("/GetSearch", async (req, res) => {
    try {
        const regex = new RegExp(req.query.foodSearch, 'i')
        const getSearch = await getThisMenu.find({ foodname: regex })
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}
        results.total = getSearch.length
        results.pageCount = Math.ceil(getSearch.length / limit)

        if (end < getSearch.length) {
            results.next = {
                page: page + 1
            }
        }
        if (start > 0) {
            results.prev = {
                page: page - 1
            }
        }

        results.result = getSearch.slice(start, end)
        res.send({ results });
    } catch (e) {
        console.log(e);
    }
})

//Get Category Menu
app.get("/GetCategoryMenu", async (req, res) => {
    try {
        const getIt = await getThisMenu.find({ foodcategory: req.query.category });

        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}
        results.total = getIt.length
        results.pageCount = Math.ceil(getIt.length / limit)

        if (end < getIt.length) {
            results.next = {
                page: page + 1
            }
        }
        if (start > 0) {
            results.prev = {
                page: page - 1
            }
        }

        results.result = getIt.slice(start, end)
        res.send({ results });
    } catch (e) {
        console.log(e);
    }
})

//Delete Menu
app.post("/DeleteMenu", async (req, res) => {
    try {
        getThisMenu.deleteOne({ _id: req.query.deleteid }).then(() => {
            res.send({ data: "Deleted" })
        }).catch((err) => {
            res.send({ data: err })
        })
    } catch (e) {
        console.log(e);
    }
})

//Update Menu
app.post("/UpdateMenu", async (req, res) => {
    const { base64 } = req.body;
    try {
        getThisMenu.updateOne({ _id: req.body.updateid },
            {
                foodname: req.body.updatename,
                foodprice: req.body.updateprice,
                foodquantity: req.body.updatequantity,
                foodcategory: req.body.updatecategory,
                fooddescription: req.body.updatedescription,
                foodimage: base64
            }
        ).then(() => {
            res.send({ data: "Updated" })
        }).catch((err) => {
            res.send({ data: err })
        })
    } catch (e) {
        console.log(e);
    }
})