const express = require("express")
const router = express.Router();
const mongoose = require("mongoose")
require("../models/User")
const User = mongoose.model("users")
const bcrypt = require("bcryptjs")
const passport = require("passport")

router.get("/registry",(req,res)=>{
    res.render("users/registry")
})
router.post("/registry",(req,res)=>{
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido!"})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email inválido!"})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha inválida!"})
    }
    if(req.body.senha.length < 7){
        erros.push({texto: "Senha muita curta (menor que 7 digitos)"})
    }
    if(req.body.senha != req.body.senha2){
        erros.push({texto: "As senhas são diferentes, tente novamente!"})
    }

    if(erros.length > 0){
        res.render("users/registry",{erros: erros})
    }else{

        User.findOne({email: req.body.email}).then((user)=>{
            if(user){
                req.flash("error_msg","Já existe uma conta cadastrada com esse email me nosso sistema")
                res.redirect("/users/registry")
            }else{
                const newUser = new User({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })
                
                bcrypt.genSalt(10, (erro,salt)=>{
                    bcrypt.hash(newUser.senha, salt, (erro,hash)=>{
                        if(erro){
                            req.flash("error_msg","Houve um erro durante o salvamento do usuário")
                            res.redirect("/")
                        }else{
                            newUser.senha = hash
                            newUser.save().then(()=>{
                                req.flash("success_msg","Usuario registrado com sucesso!")
                                res.redirect("/")
                            }).catch((err)=>{
                                req.flash("error_msg","Houve um erro ao criar o usuario, tente novamente!")
                                res.redirect("/users/registry")
                            })
                        }
                    })
                })

            }
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro interno")
            res.redirect("/")
        })
    }
})
router.get("/login",(req,res)=>{
    res.render("users/login")
})
router.post("/login",(req,res,next)=>{//next pq autenticação
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req,res,next)
})
router.get("/logout",(req,res)=>{
    req.logout()
    req.flash("success_msg","Deslogado com sucesso!")
    res.redirect("/")
})
module.exports = router