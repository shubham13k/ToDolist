const express=require("express");
const bodyParser=require("body-parser");
const date= require(__dirname+"/date.js");
const mongoose=require("mongoose");
const _ =require("lodash");

const app= express();
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});

const itemSchema={
    name: String
};

const Item= mongoose.model("Item",itemSchema);

const item1= new Item({
    name:"Welcome to Your ToDo list"
});
const item2= new Item({
    name:"Hit + to add Item"
});
const item3= new Item({
    name:"Hit to delete that item"
});

const defaultItems= [item1,item2,item3];

const listSchema={
    name:String,
    items:[itemSchema]
};

const List=mongoose.model("List",listSchema);



// Item.insertMany(defaultItems,function(err){
//     if(err){
//         console.log(err);
//     }
// })

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}))

app.get("/",function(req,res){
    Item.find({},function(err,result){
        if(result.length ===0){
            Item.insertMany(defaultItems,function(err){
    if(err){
        console.log(err);
    }
});
        res.redirect("/")}
        else{
        if(err){
            console.log(err);
        }
        else{
            res.render("list",{listTitle:"Today", newListItems:result} )

        }}

    })})

app.get("/:customListName",function(req,res){
    const customListName=_.capitalize(req.params.customListName);
    List.findOne({name: customListName},function(err,foundList){
        if(err){
            console.log(err)
        } else{
            if(!foundList){
                //create list
                const list= new List({
                    name: customListName,
                    items:defaultItems
                })
                list.save();
                res.redirect("/"+customListName);
            } else{
                res.render("list",{listTitle:foundList.name, newListItems:foundList.items})
            }
        }
    })
    
})

app.post("/",function(req,res){
    let itemName=req.body.newItem;
    let listName=req.body.list;

    const item4=new Item({
        name: itemName,
    });

    if(listName==="Today"){
        item4.save();
        res.redirect("/");
    } else{
        List.findOne({name: listName},function(err,foundList){
            foundList.items.push(item4);
            foundList.save();
            res.redirect("/"+listName);
        })
    }
});

app.post("/delete",function(req,res){

    const checkedItemId=req.body.checkbox;
    const listName=req.body.listName;

    if(listName==="Today"){

    Item.findByIdAndRemove(checkedItemId,function(err){
        console.log(err)
    });
    res.redirect("/");
}else{
    List.findOneAndUpdate({
        name:listName
    },{
        $pull: {items: {_id: checkedItemId}}
    },function(err,foundList){
        if(!err){
            res.redirect("/"+listName);
        }
    })
}


})


app.get("/about",function(req,res){
    res.render("about")
})
app.listen(3000,function(){
    console.log("server has started");
})