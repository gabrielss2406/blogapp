// Carregando Módulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const app = express();
    const admin = require('./routes/admin')
    const users = require('./routes/users')
    const mongoose = require('mongoose')
    const path = require('path')//modulo para diretorios
    const session = require('express-session')
    const flash = require('connect-flash')
    const moment = require('moment')
    require("./models/Post")
    require("./models/Categoria")
    const Post = mongoose.model("posts");
    const Categoria = mongoose.model("categorias");
    const passport = require("passport")
    require("./config/auth")(passport)
    const db = require("./config/db")
// Configurações
    // Session
        app.use(session({
            secret: "node",
            resave: true,
            saveUninitialized: true
        }))

        app.use(passport.initialize())
        app.use(passport.session())

        app.use(flash())
    // Middleware
        app.use((req,res,next)=>{
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash('error_msg')
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null
            next()
        })
    // BodyParser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json())
    // Handlebars
        app.engine('handlebars', handlebars({
            defaultLayout: 'main',
            helpers: {
                formatDate: (date) => {
                    return moment(date).format('DD/MM/YYYY HH:mm:ss')
                }   
            }
        }))

        app.set('view engine', 'handlebars');
    // Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect(db.mongoURI, {
            useNewUrlParser: true
        }).then(()=>{
            console.log("Conectado ao mongo com sucesso")
        }).catch((err)=>{
            console.log("Erro ao conectar ao mongo: "+err)
        })
    // Public Static
        app.use(express.static(path.join(__dirname,"public")))
// Rotas
    app.use("/admin", admin)//rotas com prefixo
    app.use("/users", users)

    app.get("/", (req,res)=>{
        Post.find().populate("categoria").sort({date:"desc"}).limit(10).then((posts)=>{
            res.render('index',{posts: posts})
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro interno")
            res.redirect("/404")
        })
    })
    app.get("/post/:slug",(req,res)=>{
        Post.findOne({slug: req.params.slug}).then((post)=>{
            if(post){
                res.render("postagem/index",{post: post})
            }else{  
                req.flash("error_msg","Esse post não exite!")
                res.redirect("/")
            }
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro interno!")
            res.redirect("/")
        })
    })
    app.get("/404",(req,res)=>{
        res.send("Erro 404")
    })
    app.get("/categorias",(req,res)=>{
        Categoria.find().then((categoria)=>{
            res.render("categorias/index",{categoria: categoria})
        }).catch((err)=>{
            req.flash("error_msg","Erro ao listar as categoria")
            res.redirect("/")
        })
    })
    app.get("/categorias/:slug",(req,res)=>{
        Categoria.findOne({slug: req.params.slug}).then((categoria)=>{
            if(categoria){
                
                Post.find({categoria: categoria._id}).then((posts)=>{
                    res.render("categorias/posts",{posts: posts,categoria: categoria})
                }).catch((err)=>{
                    req.flash("error_msg","Erro ao listar os posts da categoria")
                    res.redirect("/categorias")
                })

            }else{
                req.flash("error_msg","Essa categoria não existe")
                res.redirect("/categorias")
            }
        }).catch((err)=>{
            req.flash("error_msg","Erro ao listar os posts da categoria")
            res.redirect("/categorias")
        })
    })
    
// Outros
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});