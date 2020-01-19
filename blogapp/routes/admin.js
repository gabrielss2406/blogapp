const express = require('express');
const router = express.Router();
const mongoose = require("mongoose")
require("../models/Categoria")
require("../models/Post")
const Categoria = mongoose.model("categorias");
const Post = mongoose.model("posts");
const {eAdmin} = require("../helpers/eAdmin")

router.get('/',eAdmin, (req,res) => {//arrow function como callback
    res.render("admin/index")
})
router.get('/categorias',eAdmin, (req,res)=>{
    Categoria.find().sort({date: 'desc'}).then((categorias)=>{
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
})
router.post('/categorias/nova',eAdmin, (req,res)=>{
    var erros = []
    // verifica antes de enviar (nao enviado) - (undefined) - (valor nulo)
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }
    if(req.body.nome.length < 2){
        erros.push({texto: "Nome da categoria muito pequeno"})
    }
    //if erro final
    if(erros.length > 0){
        res.render("admin/addcategoria", {erros: erros})
    }else{
        const newCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(newCategoria).save().then(()=>{
            req.flash("success_msg","Categoria criada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro ao salvar a categoria, tente novamente!")
            res.redirect("/admin/categorias")
        })
    }
})
router.get('/categorias/add',eAdmin, (req,res)=>{
    res.render("admin/addcategoria")
})
router.get('/categorias/edit/:id',eAdmin, (req,res)=>{
    Categoria.findOne({_id:req.params.id}).then((categoria)=>{
        res.render("admin/editcategorias",{categoria: categoria})
    }).catch((err)=>{
        req.flash("error_msg","Essa categoria não existe")
        res.redirect("/admin/categorias")
    })
})
router.post("/categorias/edit",eAdmin,(req,res)=>{
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido na edição"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido na edição"})
    }
    if(!req.body.id || typeof req.body.id == undefined || req.body.id == null){
        erros.push({texto: "Erro ao atribuir ID na edição"})
    }
    if(req.body.nome.length < 2){
        erros.push({texto: "Nome da categoria muito pequeno na edição"})
    }
    //if erro final
    if(erros.length > 0){
        res.render("admin/categorias", {erros: erros})
    }else{
    Categoria.findOne({_id: req.body.id}).then((categoria)=>{
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(()=>{
            req.flash("success_msg","Categoria editada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro interno ao salvar a edição da categoria")
            res.redirect("/admin/categorias")
        })
        
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao editar a categoria")
        res.redirect("/admin/categorias")
    })
    }
})
router.post("/categorias/deletar",eAdmin,(req,res)=>{
    Categoria.deleteOne({_id:req.body.id}).then(()=>{
        req.flash("success_msg","Categoria deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err)=>{
        req.flash("error_msg","Erro ao deletar a categoria!")
        res.redirect("/admin/categorias")
    })
})
router.get("/posts",eAdmin,(req,res)=>{
    Post.find().populate("categoria").sort({date:"desc"}).then((posts)=>{
        res.render("admin/posts",{posts: posts})
    }).catch((err)=>{
        req.flash("error_msg","Erro ao listar as postagens : "+err)
        res.redirect("/admin")
    })
})
router.get("/posts/add",eAdmin,(req,res)=>{
    Categoria.find().then((categorias)=>{
        res.render("admin/addpost", {categorias: categorias})
    }).catch((err)=>{
        req.flash("error_msg","Erro ao carregar o formulário!")
        res.redirect("/admin")
    })
})
router.post("/posts/add",eAdmin,(req,res)=>{
    var erros = []
    // verifica antes de enviar (nao enviado) - (undefined) - (valor nulo)
    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({texto: "Titulo inválido"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }
    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({texto: "Descricao inválida"})
    }
    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
        erros.push({texto: "Conteudo inválido"})
    }
    if( req.body.categoria == "0"){
        erros.push({texto: "Categoria inválida, registre uma categoria"})
    }
    //if erro final
    if(erros.length > 0){
        res.render("admin/posts", {erros: erros})
    }else{
        const newPost = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }

        new Post(newPost).save().then(()=>{
            req.flash("success_msg","Post criado com sucesso!")
            res.redirect("/admin/posts")
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro ao criar o post, tente novamente!")
            res.redirect("/admin/posts/add")
        })
    }
})
router.get("/posts/edit/:id",eAdmin,(req,res)=>{
    Post.findOne({_id:req.params.id}).then((posts)=>{

        Categoria.find().then((categorias)=>{
            res.render("admin/editposts",{posts: posts, categorias: categorias})
        }).catch((err)=>{
            req.flash("error_msg","Esse ao listar as categorias do editar posts")
            res.redirect("/admin/posts")
        })

    }).catch((err)=>{
        req.flash("error_msg","Esse post não existe")
        res.redirect("/admin/posts")
    })
})
router.post("/posts/edit",eAdmin,(req,res)=>{
    var erros = []
    // verifica antes de enviar (nao enviado) - (undefined) - (valor nulo)
    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({texto: "Titulo inválido"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }
    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({texto: "Descricao inválida"})
    }
    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
        erros.push({texto: "Conteudo inválido"})
    }
    if(!req.body.id || typeof req.body.id == undefined || req.body.id == null){
        erros.push({texto: "Erro ao atribuir ID na edição"})
    }
    if( req.body.categoria == "0"){
        erros.push({texto: "Categoria inválida, registre uma categoria"})
    }
    //if erro final
    if(erros.length > 0){
        erros.push({texto: "OBS: Erros referentes a edição."})
        res.render("admin/posts", {erros: erros})
    }else{
        Post.findOne({_id: req.body.id}).then((posts)=>{
            posts.titulo = req.body.titulo
            posts.slug = req.body.slug
            posts.descricao = req.body.descricao
            posts.conteudo = req.body.conteudo
            posts.categoria = req.body.categoria

            posts.save().then(()=>{
                req.flash("success_msg","Post editado com sucesso!")
                res.redirect("/admin/posts")
            }).catch((err)=>{
                req.flash("error_msg","Houve um erro interno ao salvar a edição do post")
                res.redirect("/admin/posts")
            })
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro ao editar o post")
            res.redirect("/admin/posts")
        })
    }
})
router.post("/posts/deletar",eAdmin,(req,res)=>{
    Post.deleteOne({_id: req.body.id}).then(()=>{
        req.flash("success_msg","Post deletado com sucesso!")
        res.redirect("/admin/posts")
    }).catch((err)=>{
        req.flash("error_msg","Erro ao deletar o post")
        res.redirect("/admin/posts")
    })
})

module.exports = router;