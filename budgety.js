var Budgetcontroller=(function(){
    var Expenses=function(id,description,value){
        this.id=id,
        this.description=description,
        this.value=value,
        this.percentage=-1
    };
    Expenses.prototype.calculatepercentage=function(totalincome){
        if(totalincome>0){
        this.percentage=Math.round((this.value/totalincome)*100);}
        else{
            this.percentage=-1;
        }
    };
    Expenses.prototype.getpercentages=function(){
        return this.percentage;
    }
    var Incomes=function(id,description,value){
        this.id=id,
        this.description=description,
        this.value=value
    };
    var calculatetotal=function(type){
        var sum=0;
        data.allItems[type].forEach(function(cur){
            sum+=cur.value;
        });
        data.total[type]=sum;
    }
    var data={
        allItems:{
            exp:[],
            inc:[]
        },
        total:{
            exp:0,
            inc:0
        },
        budgets:0,
        percentage:-1
    };
    return{
        addItems:function(type,des,val){
            var newitem,Id;
            if(data.allItems[type].length>0){
                Id=data.allItems[type][data.allItems[type].length-1].id+1;
            }
            else{
                Id=0;
            }
            if(type==='exp'){
                newitem=new Expenses(Id,des,val);
            }
            else{
                newitem=new Incomes(Id,des,val);
            }
            data.allItems[type].push(newitem);
            return newitem;
        },
        budgetcalc:function(){
            //calculate total inc and exp
            calculatetotal('exp');
            calculatetotal('inc');
            //calculate budget
             data.budgets=data.total.inc-data.total.exp;
            //calculate percentage
            if(data.total.inc>0){
            data.percentage=Math.round((data.total.exp/data.total.inc)*100);}
            else{
                data.percentage=-1;
            }
        },
        calcpercentage:function(){
            data.allItems.exp.forEach(function(cur){cur.calculatepercentage(data.total.inc);});
        },
        getper:function(){
            var allperc=data.allItems.exp.map(function(cur){return cur.getpercentages();});
            return allperc;
        },
        DItem:function(type,id){
            var Ids,Index;
            Ids=data.allItems[type].map(function(current){return current.id;});
            Index=Ids.indexOf(id);
            if(Index!==-1){
                data.allItems[type].splice(Index,1);
            }
        },
        getbudget:function(){
            return{
                budgets:data.budgets,
                totalinc:data.total.inc,
                totalexp:data.total.exp,
                percentage:data.percentage
            };
        },
        testing:function(){
            console.log(data);
        }
    };
})();


var Uicontroller=(function(){
    var domstring={
        typestring:'.addtype',
        desstring:'#description',
        valstring:'#number',
        enbtn:'.btn',
        incomelist:'.income__list',
        expenselist:'.expense__list',
        totalis:'#ti',
        totales:'#te',
        bshow:'.numberbudget',
        per:'.per',
        perc:'.perc',
        datelabel:'.date'
    };
var formateNum=function(num,type){
        var numSplit,int,dec;
        num=Math.abs(num);
        num=num.toFixed(2);
        numSplit=num.split('.');
        int=numSplit[0];
        if(int.length>3){
            int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
        }
        dec=numSplit[1];
        return (type==='exp'?'-':'+')+' '+int+'.'+dec;
    };
    return {
                getinput :function(){
                                       return{
                                                type:document.querySelector(domstring.typestring).value,
                                                description:document.querySelector(domstring.desstring).value,
                                                val:parseFloat(document.querySelector(domstring.valstring).value)
                                             };
                                   },
                Listview:function(obj,type){
                                        var html,newhtml,element;
                                        if(type==='inc'){
                                            element=domstring.incomelist;
                                        html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="ival">%value%</div><div class="delet"><button class="item__delete--btn">X</button></div></div></div>';}
                                        else{
                                            element=domstring.expenselist;
                                        html=' <div class="item clearfix" id="exp-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="eval">%value%<div class="perc">%per%</div></div><div class="delet"><button class="item__delete--btn">X</button></div></div></div>';}
                                        newhtml=html.replace('%id%',obj.id);
                                        newhtml=newhtml.replace('%des%',obj.description);
                                        newhtml=newhtml.replace('%value%',formateNum(obj.value,type));
                                        document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);
                                   },
                clearfield:function(){
                                        var fields,fieldsarr;
                                        fields=document.querySelectorAll(domstring.desstring+','+domstring.valstring);
                                        fieldsarr= Array.prototype.slice.call(fields);
                                        fieldsarr.forEach(function(current,index,array){
                                            current.value="";
                                        });
                                        fieldsarr[0].focus();
                },
                displaybudget:function(obj){
                                        var type;
                                        obj.budgets > 0 ? type='inc':type='exp';
                                        document.querySelector(domstring.bshow).innerHTML=formateNum(obj.budgets,type);
                                        document.querySelector(domstring.totalis).textContent=formateNum(obj.totalinc,'inc');
                                        document.querySelector(domstring.totales).innerHTML=formateNum(obj.totalexp,'exp');
                                        if(obj.percentage>0){
                                        document.querySelector(domstring.per).innerHTML=obj.percentage+"%";}
                                        else{
                                            document.querySelector(domstring.per).innerHTML="";   
                                        }
                },
                displaypercentage:function(percentage){
                                        var fields=document.querySelectorAll(domstring.perc);
                                        var nodeListforeach=function(list,callback){
                                            for(var i=0;i<list.length;i++){
                                                callback(list[i],i);
                                            }
                                        };
                                        nodeListforeach(fields,function(current,index){
                                            if(percentage[index]>0){
                                                current.textContent=percentage[index]+"%";
                                            }
                                            else{
                                                current.textContent="-";
                                            }
                                        });
                },
                displayDate:function(){
                                        var now,month,months,year,day; 
                                        now=new Date();
                                        year=now.getFullYear();
                                        month=now.getMonth();
                                        //day=now.getDay();
                                        months=['January','February','March','April','May','June','July','August','September','October','November','December'];
                                        document.querySelector(domstring.datelabel).textContent=months[month]+" "+year;
                },
                DUitem:function(selectorid){
                                        var el;
                                        el=document.getElementById(selectorid);
                                        el.parentNode.removeChild(el);
                },
                Domset:function(){
                                        return domstring;
              }
           };

})();


var Controller=(function(Budgetctrl,Uictrl){
    var setupeventlistener=function(){
        var dom=Uictrl.Domset();
        document.querySelector(dom.enbtn).addEventListener('click',ctrlAdd);
        document.addEventListener('keypress',function(event){
            if(event.keyCode===13||event.which===13)
            ctrlAdd();
        });
        document.querySelector('.bottom').addEventListener('click',deleteitem);
    }
    var updatebudget=function(){
         //1.budget control
         Budgetctrl.budgetcalc();
         //2.Return bc
        var budget=Budgetctrl.getbudget(); 
        //3.display budget
        Uictrl.displaybudget(budget);
        
    }
   var updatepercentage=function(){
       //1.update percentage in budget ctrl
       Budgetctrl.calcpercentage();
       //2.Read percentage
       var allp=Budgetctrl.getper();
       //3.display on ui
       Uictrl.displaypercentage(allp);
       console.log(allp);
   }
    var ctrlAdd=function(){
        var input,newitems;
        //1.get input field
         input=Uictrl.getinput();
        if(input.description!=""&&!isNaN(input.val)&&input.val>0){
        //2.add item budget controll
         newitems= Budgetctrl.addItems(input.type,input.description,input.val);
        //3.add item to ui
          Uictrl.Listview(newitems,input.type);
        //4. clear field
          Uictrl.clearfield();
        //5.budget control and display
        updatebudget();
        //6.update percentage of exp
        updatepercentage();
        }
        else{alert('Enter All field Currectly');}
     
    }
    var deleteitem=function(event){
        var itemId,splitId,type,Id;
        itemId= event.target.parentNode.parentNode.parentNode.id;
        if(itemId){
            splitId=itemId.split('-');
            type=splitId[0];
            Id=parseInt(splitId[1]);
            //1.delete from ds
            Budgetctrl.DItem(type,Id);
            //2.delete to ui
            Uictrl.DUitem(itemId);
            //3.Update budget
            updatebudget();
            //4.update percentage of exp
            updatepercentage();
        }

    }
    return{
        Init:function() {
            console.log('app start');
            Uictrl.displayDate();
            Uictrl.displaybudget({ budgets:0,
                totalinc:0,
                totalexp:0,
                percentage:-1});
            setupeventlistener();
        }
    };
   
})(Budgetcontroller,Uicontroller);
Controller.Init();