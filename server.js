// MySQL + Node.js 접속 코드
var mysql = require('mysql'); 
//require : 라이브러리 가져오는거임!!
// MySQL 라이브러리 가져올거야 -> 항상 왼쪽에 이런식으로 변수로 받아줌. 이 변수가 MySQL의 객체가 됨,


//mysql객체를 통해서 접속을 한번 해볼게요!
var conn = mysql.createConnection({
    host : "127.0.0.1",  
    user : "root",
    password : "123456",
    database : "myboard",
    port : 3306
    //요안에다가 설정해주시면됨.(MySQL접속하기위한 설정?)
});

// 만약 접속을 못하면 conn은 널값이 들어감.

conn.connect();
//  conn이 널값이면 에러날거임.
// 내 서버에서 mySQL연동하는 코드는 위에가 다임!!

const dotenv = require('dotenv').config();



//몽고DB 접속 코드
var mongodbclient = require('mongodb').MongoClient; 
const url = process.env.DB_URL; 
//process가 env에 접근해서 DB_URL 읽어오겠다!
const ObjId = require('mongodb').ObjectId; //이거 추가해주셈.

let mydb; // 변수하나 선언하셈
mongodbclient.connect(url)   //접속하는 코드임.
    .then(client => {
        mydb = client.db('myboard');   
        
         
         app.listen(process.env.PORT, function(){
            console.log("포트 8080 서버 대기중...")
            //앱.리슨을 잘라내서 여기다 붙여넣기 해줌.
         }) 
    })
    .catch(err =>{
        console.log(err);
    })
    //실패하면 캐치로 넘어감.

const express = require('express');
const { MongoClient } = require('mongodb');
// 익스프레스 라이브러리를 가져와서 익스프레스 라이브러리의 객체를 하나 얻어온거. 
const app = express();
// 익스프레스 객체를 함수의 형태로 사용할수 있는데 app이라는 변수에 전달함! 왜이렇게 쓰냐하면 물어보면 안되고 익스프레스만든사람이 정한거임.

let imagepath = '';

const sha = require('sha256'); 


//아래는 템플릿엔진 설정하는방법(아무위치에나 적어도됨)
app.set('view engine', 'ejs');
//두번째전달인자에는 어떤 엔진쓸건지(우리는 ejs쓸거임).

//app.use(express.static("public"));
//퍼블릭 안에 있는 파일들을 url에 붙여주기만 하면 해당 파일이나 내용을 가져올수 잇음.
//public폴더랑 연결시켜주는거임.
//스태틱파일(이미지,css)(바뀌지 않는 데이터들 = 정적데이터들)을 익스프레스에 연결해주는거임.
//이렇게 하면 http://localhost:8080/poem.txt 입력하면 poem.txt에 작성한게 뜸!
app.use("/public", express.static("public")); 

app.use('/', require('./routes/post.js'));
//미들웨어 추가 해주셔야함
app.use('/', require('./routes/auth.js'));
app.use('/', require('./routes/add.js'));


//cookie-parser 미들웨어 추가
let cookieParser = require('cookie-parser');

app.use(cookieParser('fewkjlfjsdklfjdskl3232')); //아무거나 넣으셈



//쿠키 라우터 만듦
app.get('/cookie', function(req, res){
    let milk = parseInt(req.signedCookies.milk) + 1000; 
    if(isNaN(milk)){   
        milk = 0;  
    }

    res.cookie('milk', milk, {signed : true}); //쿠키 생성  
    res.send('product : ' + milk + '원');  // 쿠키를 브라우저로 전송.
})

app.get('/clear', function(req, res){
    res.clearCookie('milk'); 
    res.send('쿠키가 제거되었습니다.');
})

//express-session 미들웨어 추가 
let session = require('express-session'); //이런식으로 리콰이어 하시구요 . session -> 함수포인터임!!!!! 
app.use(session({
    secret : 'fjkslfjdkslfjewkfjdks',
    resave : false,
    saveUninitialized : true
    // 세션사용할때 이렇게 만들어 놓고 사용함. 이게 기본셋팅임. 

}));//미들웨어 사용할땐 use함수사용함. / 이건 원리랄께 없고 이렇게 쓰라고 규정된거임.
//시크릿 : 세션 아이디를 암호화하기 위한 재료값. fewkjlfjsdklfjdskl3232랑 비슷함
//리세이브 : 세션을 접속할때마다 새로운 세션식별자의 발급여부를 결정함. 일반적으로는 false라고 적음. 세션을 접속할때마다 새로운 세션식별자의 발급여부를 발급하지 않겟따!
//세션을 사용하기 전까지 세션식별자를 발급하지 않도록 하겠다 -> 이게 일반적임


//라우터 추가
app.get('/session', function(req, res){
    if(isNaN(req.session.milk)){
        req.session.milk = 0;
    }

    req.session.milk = req.session.milk + 1000;     
    res.send("session : " + req.session.milk + "원");
    
})




//body-parser 라는 미들웨어 추가함
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
//바디파서 사용할수 있는 상태가 됨! 





// '/book' 요청 시 처리 코드   (http://localhost:8080/book)
app.get('/book', function(req, res){
    console.log("도서 목록 관련 페이지입니다."); //처리코드는 여기에!! 
    res.send("도서 목록 관련 페이지입니다.");
}) 
//겟함수에 첫번째 전달인자는 요청url들어감. '/book' -> 이게 이벤트임
//이벤트 발생하면 이벤트 리스너에 의해 연결된애가 콜백함수 
//두번째 전달인자엔 콜백함수들어감. 콜백함수에는 두개의 전달인자. 첫번째 전달인자는 요청, 두번째전달인자는 응답.
// 요 이벤트가 발생되면 콜백함수가 실행됨(콘솔로그 찍힘)

//res라는 파라미터에 여러가지함수? 잇단듯 send보낸다 리스폰스로 클라이언트에 보내겟다? 메시지를?
//클라이언트 뷰 영역에 입력한 메시지가 표시된단듯???
// 위 3문장이 라우터 만든거라는듯??

app.get('/', function(req, res){
    // res.sendFile(__dirname + '/index.html');
    //__dirname : 서버라는 폴더의 위치를 나타내는거임.
    res.render("index.ejs", {user : null});
})




   

app.post('/save', function(req, res){
    console.log(req.body.title);
    console.log(req.body.content);
    console.log(req.body.someDate);
    
    //몽고DB에 데이터 저장하기
    mydb.collection('post').insertOne( //mydb는 -> 해당 데이터베이스(myboard)까지 온거임
        {
            title : req.body.title,
            content : req.body.content,  //컨텐츠라는 키값으로 ~  
            date : req.body.someDate,
            path : imagepath
        }).then(result => {
            console.log(result);
            console.log('데이터 추가 성공');
        })

//성공하면 then에서 처리함.
//리절트로 입력하고나서 결과값이 들어감!!


//     let sql = "INSERT INTO post (title, content, created) values(?, ?, NOW())";
// let params = [req.body.title, req.body.content];
// conn.query(sql, params, function(err, result){
//     if(err) throw err;
//     console.log("데이터 추가 성공");
// }); 

    // res.send('데이터 추가 성공');   
    res.redirect('/list'); //저장 누르면 리스트로 이동!
})

app.post('/delete', function(req, res){
    console.log(req.body._id);// {_id : '652caa7dc9a37ee19b3c0dc9' -> 얘 자체는 문자열임.}
    req.body._id = new ObjId(req.body._id);
    //기존에 문자열로 돼잇던 애를 오브젝트 아이디로 탈바꿈시켜서 다시 자기 자신에게 덮어??주는듯?
    console.log(req.body._id);
    //insertOne(데이터 한개 추가할때),insertMany(데이터 여러개 추가할때) 
    //deleteOne, deleteMany
    mydb.collection('post').deleteOne(req.body) //deleteOne(요기다가 삭제할대상)
    .then(result=>{
        console.log('삭제완료');
        res.status(200).send(); //상태코드 200보내주면
    })
    //mydb.collection('post').-> 포스트위치의 콜렉션 위치까지 접근하고
    .catch(err =>{
        console.log(err); //들어온 에러메시지를 출력하고 싶으면 이렇게함.
        res.status(500).send();
    })
})

app.get('/content/:id', function(req, res){
    console.log(req.params.id);  //url파라미터 가져오는 방법임!!
    //파람스는 파라미터들을 얘기함. 리퀘스트의 파람스라는 파라미터들이 담겨잇는 공간안에 내가 원하는건 아이디를 갖고 오고싶다!
    
    req.params.id= new ObjId(req.params.id);//오브젝트 아이디 형식으로 바뀜
    mydb.collection("post")
    .findOne({ _id : req.params.id })   //아이디를 찾는거임. 찾는함수임
    .then((result)=>{  // 찾는게 있다면 then으로 감.
        console.log(result);
        res.render('content.ejs', {data : result}); //content.ejs에서 넘겨준 data 사용할수 있음.
        //data가 콘텐츠ejs로 넘어감. data라는 애를 통해 title(data.title)이랑 content(data.title) 접근가능함
    })    
})

app.get('/edit/:id', function(req, res){
   console.log(req.params.id); 

   req.params.id= new ObjId(req.params.id);//오브젝트 아이디 형식으로 바뀜
   mydb.collection("post")
   .findOne({ _id : req.params.id })   //해당 아이디가 내부에 있는지 확인하는거임.
   .then((result)=>{  // 찾는게 있다면 then으로 감.
       console.log(result);
       res.render('edit.ejs', {data : result}); 
   })   
})

app.post('/edit', function(req, res){ 

    console.log(req.body.id);
    req.body.id = new ObjId(req.body.id);  //오브젝트아이디의 형식으로 바꿔준 후에 다시 집어 넣음.

    console.log(req.body.content);
    //몽고DB에 데이터 저장하기
    mydb.collection('post').updateOne({_id : req.body.id},
        {$set : {title : req.body.title, content : req.body.content, date : req.body.someDate}}//업데이트칠 내용 여기다 여기다 적어주셈}
        //데이터 하나를 업데이트할때 업데이트원 함수 사용함
       //업데이트 할때는 기준이 되는 유니크한 값이 기준이 되어야함(id가 기준이 되어야함)
       //첫번째 전달인자에 유니크한 아이디값 넣어주고 
       //$set 얘를 키값으로 씀.
        ).then(result => {
            console.log(result);
            console.log('수정완료');
            res.redirect('/list');    //주로 리스폰스로 send(html파일 보내주는거),render(특정 ejs파일을 보내주는거)했는데, redirect('url요청경로') 
            //res.redirect('/list'); -> 너가 지금 수정을 했으면 수정버튼 눌렀어 완료되면 리스트쪽으로 가는게 맞음.
        }) 
        .catch(err =>{
            console.log(err);
        });
})




app.post('/login', function(req, res){ 
    // 1. 브라우저에서 입력한 id, pw 가져오기

    console.log('아이디 : ' + req.body.userid);  
    console.log('비밀번호 : ' + req.body.userpw);  

    // 2. DB에서 id, pw가져오기 
    //몽고DB에 데이터 저장하기
    mydb.collection('account')
    .findOne({userid : req.body.userid }) //아이디 검사.
    .then(result => {
        if(result.userpw == sha(req.body.userpw)){ //result.userpw 는 암호화된 패스워드임. / req.body.userpw는 평문임
            req.session.user = req.body;
            console.log('새로운 로그인');
            res.render('index.ejs', { user : req.session.user}) 
        }else{
            res.send('비밀번호가 틀렸습니다.');
        }   
    })   
    .catch(err =>{
        res.send('아이디를 찾지 못했습니다.');
    })
})

app.get('/logout', function(req, res){ 
    console.log('로그아웃');
    req.session.destroy(); //현재 세션정보를 파괴해라!  
    res.render('index.ejs', { user : null})
})

app.get('/signup', function(req, res){ 
    res.render('signup.ejs');
})

// 사인업으로 요청햇을때 사인업.ejs가 보여져야함

app.post('/signup', function(req, res){ 
    console.log(req.body.userid);  // 바디파서 이용함
    console.log(sha(req.body.userpw)); 
    console.log(req.body.usergroup); 
    console.log(req.body.useremail); 

mydb.collection('account')
.insertOne({
    userid : req.body.userid,
    userpw : sha(req.body.userpw),
    usergroup : req.body.usergroup,
    useremail : req.body.useremail
    })
.then(result => {
    console.log('회원가입 성공');
    })
res.redirect('/');
})


//멀터라이브러리 설치햇으니까 가져온다고 함.
let multer = require('multer'); //이렇게 멀터 라이브러리 가져옴.

let storage = multer.diskStorage({ //memortStorage()
    destination : function(req, file, done){
        done(null, './public/image')
    },
    filename : function(req, file, done){
        done(null, file.originalname)
    }
})
//디스크스토리지라는 함수 안에서 설정해줘야함.
//destination : 대상이라는 뜻
//스토리지라는 변수사용할때 멀트를 통해 셋팅된 형태 이용하시게 될거임
// 데스티네이션 : 업로드할 파일 경로 설정하는거임 / 설정하지 않으면 기본경로 사용하게 될거고
// 파일네임 : 폴더 안에 저장될 파일 이름? / 오리지널네임이라고 하면 그이름 그대로 된단듯????

let upload = multer({storage : storage});
//멀터를 이용해서 방금 설정한 스토리지를 가져올거임


app.post('/photo', upload.single('picture'), function(req, res){
    console.log('서버에 파일 첨부하기');
    console.log(req.file.path);
    imagepath = '\\' + req.file.path; //  \\public\image\javascript.png
    //윈도우에선 폴더구분자 : \ 사용함
})
//upload.single('picture') -> 미들웨어임.
//req에 파일이라는 속성있고.

app.get('/search', function(req, res){
    console.log(req.query); 
    mydb.collection('post')
    .find({title:req.query.value}).toArray()
    .then((result)=>{
        console.log(result);
        res.render('sresult.ejs', {data : result});
        // 데이터라는 키값으로 리절트를 넘겨줌.
    })
})