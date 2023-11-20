const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const app=express();
require("dotenv").config();

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

mongoose.set("strictQuery",false);
mongoose.connect(process.env.MONGO_URL);

const wikiSchema={
    title:String,
    content:String
};
const Article=mongoose.model("Article",wikiSchema);

//Requests targetting all article
app.route("/articles")
.get(function(req,res){
    Article.find(function(err,foundArticles){
        if(!err){
            //console.log(foundArticles);
            res.send(foundArticles);
        }
        else{
            //console.log(err);
            res.send(err);
        }
    });
})
.post(function(req,res){
    const newArticle=new Article({
        title:req.body.title,
        content:req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send("Succefully added new article to articles");
        }else{
            res.send(err);
        }
    });
})
.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Succefully deleted all articles");
        }else{
            res.send(err);
        }
    });
});
//Requests targetting a specific article
app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
        if(!err){
            res.send(foundArticle);
        }else{
            res.send(err);
        }
    });
})
.put(function(req,res){
    Article.updateOne({title:req.params.articleTitle},{title:req.body.title,content:req.body.content},{overwrite:true},function(err){
        if(!err){
            res.send("Successfully updated the specific article");
        }
            res.send(err);
    });
})
.patch(function(req,res){
    Article.updateOne({title:req.params.articleTitle},{title:req.body.title},function(err){
        if(!err){
            res.send("Successfully updated the piece of specific article");
        }
    });
})
.delete(function(req,res){
    Article.deleteOne({title:req.params.articleTitle},function(err){
        if(!err){
            res.send("Successfully deleted the specific article");
        }else{
            res.send(err);
        }
    });
})
app.listen(3000,function(req,res){
    console.log("Server is running on port 3000");
})