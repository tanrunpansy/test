//引入mysql连接池对象
const pool=require('../pool.js');
const express=require('express');
//创建空路由器
var router=express.Router();
//添加路由
//1.用户注册
router.post('/register',(req,res)=>{
	//获取post请求的数据
	var obj=req.body;
	console.log(obj);
//判断用户名是否正确
var $uname=obj.uname;
if (!$uname)
{
	res.send({code:401,msg:'uname required'});
	//阻止继续往后执行
	return;

}
var $upwd=obj.upwd;
if (!$upwd)
{
	res.send({code:401,msg:'upwd required'});
	//阻止继续往后执行
	return;

}	
  var $email=obj.email;
if (!$email)
{
	res.send({code:401,msg:'email required'});
	//阻止继续往后执行
	return;

}
var $phone=obj.phone;
if (!$phone)
{
	res.send({code:401,msg:'phone required'});
	//阻止继续往后执行
	return;
}
//执行SQL语句，将注册的数据插入到xz_user数据表中，
//成功响应({code:200,msg:'register suc'})
pool.query('INSERT INTO xz_user  SET ?',[obj],(err,result)=>{
if(err) throw err;
//console.log(result);
if(result.affectedRows>0){
	res.send({code:200,msg:'register success'});
}
});

});
//2.登录路由
router.post('/login',(req,res)=>{
	//获取post请求的数据
	var obj=req.body;
	console.log(obj);
var $uname=obj.uname;
if(!$uname){
res.send({code:401,msg:'uname required'});
	//阻止继续往后执行
	return;
}
var $upwd=obj.upwd;
if (!$upwd)
{
	res.send({code:402,msg:'upwd required'});
	//阻止继续往后执行
	return;
}	
//执行SQL语句，查看是否登录成功（使用用户名和密码两个条件能查询到数据）
pool.query('SELECT *FROM xz_user WHERE uname=? AND upwd=?',[$uname,$upwd],(err,result)=>{
	if(err) throw err;
	//判断查询的结果（数组）长度是否大于0；
	//如果大于0；说明查询到数据，有这个用户登录成功
if(result.length>0){
res.send({code:200,msg:'login suc'});
}else{
	res.send({code:301,msg:'login err'})
	}
//console.log(result);
});
});
//3.用户检索
router.get('/detail',(req,res)=>{
	var obj=req.query;
    var $uid=obj.uid;
	if(!$uid){
res.send({code:401,msg:'uid required'});
	//阻止继续往后执行
	return;
}
pool.query('SELECT *FROM xz_user WHERE uid=? ',[$uid],
(err,result)=>{if(err) throw err;
//如何判断是否检索到了用户
if(result.length>0){
res.send({code:200,msg:'detail suc'});
}else{
	res.send({code:301,msg:'detail err'});
}
console.log(result);
});

});


//4.用户修改
router.post('/update',(req,res)=>{
var obj= req.body;
var $uid=obj.uid;
var $phone=obj.phone;
var $gender=obj.gender;
var $user_name=obj.user_name;
var $email=obj.email;
if(!$uid){
res.send({code:401,msg:'uid required'});
return;
}
if(!$email){
res.send({code:401,msg:'email required'});
return;
}
if(!$phone){
res.send({code:401,msg:'phone required'});
return;
}
if(!$gender){
res.send({code:401,msg:'gender required'});
return;
}
if(!$user_name){
res.send({code:401,msg:'user_name required'});
return;
}
pool.query('UPDATE xz_user SET email=?,phone=?,gender=?,user_name=? WHERE uid=?',
[$email,$phone,$gender,$user_name,$uid],(err,result)=>{
if(err) throw err;
if(result.affectedRows>0){
	res.send({code:200,msg:'update success'});
}else{
res.send({code:301,msg:'update err'});
}

}); 
                                                              
});


//5.用户列表
router.get('/list',(req,res)=>{
var obj=req.query;
//将数据转为数值型
var $pno=parseInt(obj.pno);
var $count=parseInt(obj.count);
//设置默认值和每页数量为空，设置默认值
if(!$pno){
$pno=1;
}
if(!$count){
$count=3;
}
//计算开始查询的值
var  start=($pno-1)*$count;
//执行SQL语句，返回商品列表数据
pool.query('SELECT * FROM xz_user LIMIT ?,?',
	[start,$count],(err,result)=>{
if(err) throw err;
res.send(result);
});

});

//6.用户删除
router.get('/delete',(req,res)=>{
	var obj=req.query;
	var $uid=parseInt(obj.uid);
if(!$uid){
res.send({code:401,msg:'uid required'});
return;
}
pool.query('DELETE FROM xz_user WHERE uid=?',[$uid],(err,result)=>{
	if(err) throw err;
	if(result.affectedRows>0){
	res.send({code:200,msg:'delete success'});
}else{
res.send({code:301,msg:'delete err'});
}
});
});



//导出路由器
module.exports=router;