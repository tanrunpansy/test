//创建路由器
//引入连接池
//导出路由器
const pool=require('../pool.js');
const express=require('express');
var router=express.Router();

//1.用户列表
router.get('/list',(req,res)=>{
	var obj=req.query;
    var $pno=parseInt(obj.pno);
	var $count=parseInt(obj.count);
	if(!$pno){
    $pno=1;
	}
	if(!$count){
		$count=10;
	}
	console.log($pno,$count);
var start=($pno-1)*$count;
pool.query('SELECT * FROM xz_laptop LIMIT ?,?',
	[start,$count],(err,result)=>{
	if(err) throw err;
    res.send(result);
	
	});

});

//2.商品详情
router.get('/detail',(req,res)=>{
	var obj= req.query;
var $lid=obj.lid;
if(!$lid){
  res.send({code:401,msg:'lid required'});
  return;
}
pool.query('SELECT * FROM xz_laptop WHERE lid=?',[$lid],
	(err,result)=>{
	if(err) throw err;
  if(result.length>0){
res.send({code:200,msg:'detail suc'});
}else{
	res.send({code:301,msg:'detail err'});
}
console.log(result);	
});
});



//3.商品删除
router.get('/delete',(req,res)=>{
	var obj= req.query;
var $lid=obj.lid;
if(!$lid){
  res.send({code:401,msg:'lid required'});
  return;
}
pool.query('DELETE FROM xz_laptop WHERE lid=?',[$lid],
	(err,result)=>{
if(err) throw err;
if(result.affectedRows>0){
	res.send({code:200,msg:'delete suc'});
	}else{
res.send({code:401,msg:'delete err'});
	}
});

});

//4.商品添加
router.post('/add',(req,res)=>{
	//获取数据
	//判断是否为空
	//执行SQL语句
	var obj=req.body;
	console.log(obj);
	var $code=400;
	for (var key in obj){
//console.log(key+'---'+obj[key]);
//判断属性值是否为空,key标题
    $code++;
if(!obj[key]){
res.send({code:$code,msg:key+' required'});
}
	}
pool.query('INSERT INTO xz_laptop SET ?',[obj],(err,result)=>{
	if(err) throw err;
	if(result.affectedRows>0){
	res.send({code:200,msg:'add suc'});
	}else{
res.send({code:401,msg:'add err'});
	}
});

});

//5.更改商品
router.post('/update',(req,res)=>{
var obj=req.body;
var $code=400;
	for (var key in obj){
$code++;
if(!obj[key]){
res.send({code:$code,msg:key+' required'});
}
	}
pool.query('UPDATE xz_laptop SET ? WHERE lid=?',
	[obj,obj.lid],(err,result)=>{
	if(err) throw err;
	if(result.affectedRows>0){
	res.send({code:200,msg:'update suc'});
	}else{
res.send({code:401,msg:'update err'});
	}
	console.log(result);
});


});

module.exports=router; 
