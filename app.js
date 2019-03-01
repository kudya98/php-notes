
class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {   user:{logged:false,name:undefined}, screen:{scale1: false,scale2:false,scale3:false,scale4:false}, data: [],status:{selected:false, id_client:undefined,id_server:undefined,changed:false}}
		this.updatePredicate = this.updatePredicate.bind(this);
	}


          
loadData() {
	    let formData = new FormData();
		formData.append('user', this.state.user.name);
		fetch('json.php',{ 
		method: "POST",
		body:formData
		})
			.then(response => response.json())
			.then(data => {
				this.setState({data: data });
		})
			.catch(err => console.error(err))
	}



   confirmDialog(msg,action,context) {
  return new Promise(function (resolve, reject) {
	if (action=='save'&&!context) return reject('Not changed')
    let confirmed = window.confirm(msg);
    return confirmed ? resolve('Потверждено') : reject('Отклонено');
  });
 }
 

  delete_note(id_client,id_server) {
	  var formData = new FormData();
		formData.append('id', id_server);
		this.confirmDialog('Удалить заметку?','delete',this.state.status.changed)
		.then(()=>
		fetch('delete.php',{method: 'POST', body:formData})
		.then(setTimeout(() =>{this.loadData();console.log('Заметка удалена')},80))
		.catch(err => console.error(this.props.url, err.toString())))
		.catch(err=>console.log(err));
		
	}
	check_session(){
		fetch('check_session.php',{method: 'GET'})
			.then(response => response.json())
			.then((data)=>this.setState({user:{logged:data.logged,name:data.name}}))
			.then(setTimeout(() =>{this.loadData()},50))
		
	}
	componentDidMount() {
		this.check_session();
		this.updatePredicate();
				this.loadData();
		this.interval = setInterval(() => this.loadData(), 1000);
		 setInterval( () => {this.setState({curTime : new Date().toLocaleString()})},1000)
	  window.addEventListener("resize", this.updatePredicate);
	}
	componentWillUnmount(){
		 window.removeEventListener("resize", this.updatePredicate);
}
   updatePredicate() {
    this.setState({screen:{ scale1:window.innerWidth>1299,scale2: (window.innerWidth>979&&window.innerWidth<1300),scale3:(window.innerWidth>659&&window.innerWidth<980),scale4:window.innerWidth<660 }});
  }

	
	change_color(e){
		if ($('.color.selected').css('flex-grow')==1){
		e.currentTarget.childNodes.forEach(function(element) {
			element.classList.remove("selected")
			});	
		e.target.className+=' selected';
		$('.color').css('flex-grow','0');
		$('.color.selected').css('flex-grow','2');
		let clr1 = ['GreenYellow', 'LightBlue', 'White'];
		if(clr1.includes($('.color.selected').attr('id'))) 
			$("#note_closeup_content").css('color','black'); 
			else $("#note_closeup_content").css('color','white');
		$("#note_closeup_content").css('background-color',$('.color.selected').attr('id'));
			let newState = Object.assign({}, this.state);
		newState.status.selected=true;
		newState.status.changed=true;
		this.setState(newState);
		} else 
		{	
		$('.color').css('flex-grow','1');
		}
	}
	note_closeup_mouseover(e){
		if(e.target.id!=='delete_note'){
		e.currentTarget.style.border ='3px solid blue';
		e.currentTarget.childNodes[1].style.borderTop ='3px solid blue';
		} else{
			e.target.parentElement.parentElement.childNodes[1].style.borderTop ='3px solid red';
			e.target.parentElement.parentElement.style.border ='3px solid red';
		}
		
	}
	note_closeup_mouseout(e){
	
		if(e.target.id!=='delete_note'){
	e.currentTarget.style.border ='3px solid rgb(83, 39, 0)';
		e.currentTarget.childNodes[1].style.borderTop ='3px solid rgb(83, 39, 0)';
		} else{
		e.target.parentElement.parentElement.childNodes[1].style.borderTop ='3px solid  rgb(83, 39, 0)';
		e.target.parentElement.parentElement.style.border ='3px solid  rgb(83, 39, 0)';
		}
		
	}
	note_closeup(e,id_client,id_server,color,background_color){
		if(e.target.id!='delete_note'){
		if(id_client!== undefined) this.setState({status:{ changed:false,selected:true,id_client:id_client,id_server:id_server}}); else this.setState({status:{ changed:false,selected:true,id_client:undefined,id_server:undefined}});
		$("body").css("overflowY", "hidden");
		$(".note").css("filter", "blur(4px)");
		$("#add_note").css("filter", "blur(4px)");
		$("#note_closeup_background").css("display", "block");
		$("#note_closeup").css("display", "flex");
		if(id_client!== undefined){
		$("#note_closeup_info").css("display", "block");
		$("#note_closeup_colors").css("display", "flex");
		$("#note_closeup_content").css('color',color);
		$("#note_closeup_content").css('background-color',background_color);
		$("#note_closeup_title").val(this.state.data[id_client].title);
		$("#note_closeup_content").val(this.state.data[id_client].content);
		$('#'+background_color).addClass('selected');
		$('.color').css('flex-grow','1');
		$("#note_closeup_info").html(
		'<em>'+'Создано пользователем: '+ this.state.data[id_client].user+
		'<br>Дата создания: '+  this.state.data[id_client].create_date+
		'<br>Дата последнего изменения: '+  this.state.data[id_client].change_date+
		'</em>');
	
		} else {
		$("#note_closeup_title").val('Новая заметка');
		$("#note_closeup_content").val('');
		$("#note_closeup_content").css('color','black');
		$("#note_closeup_content").css('background-color','GreenYellow');
		$('#GreenYellow').addClass('selected');
				$("#note_closeup_colors").css("display", "flex");
		$('.color').css('flex-grow','1');
		}
		}
	}
note_changed(e){
	let statusCopy = JSON.parse(JSON.stringify(this.state.status));
	statusCopy.changed=true;
	this.setState({status:statusCopy})
}

	 save(e) {
    if (e.target.id == 'note_closeup_background') {
        var formData = new FormData();
       if (this.state.status.id_client!==undefined) formData.append('id', this.state.status.id_server); else formData.append('id', -1);
        formData.append('title', $("#note_closeup_title").val());
        formData.append('content', $("#note_closeup_content").val());
		formData.append('background_color', $('.selected').attr('id'));
			formData.append('user', this.state.user.name);
		let clr1 = ['GreenYellow', 'LightBlue', 'White'];
		if(clr1.includes($('.color.selected').attr('id'))) 
			formData.append('color', 'black');
		else formData.append('color', 'white');
        this.confirmDialog('Сохранить заметку?','save',this.state.status.changed||this.state.status.id_client==undefined).then(() =>
                fetch('update.php', {
                    method: 'POST',
                    body: formData
                })
                .then(console.log('Сохранено'))
                .then(() => {
                    $("body").css("overflow", "auto");
						$("body").css("paddingRight", "0");
                    $(".note").css("filter", "blur(0px)");
                    $("#add_note").css("filter", "blur(0px)");
                    $("#note_closeup_background").css("display", "none");
                    $("#note_closeup").css("display", "none");
					$("#note_closeup_info").css("display", "none");
					$(".color").removeClass("selected");
                    this.setState({
                        status: {
                            selected: false,
                            id_client: undefined,
                            id_server: undefined,
							changed:false,
                        }
                    });
                })
				.then(setTimeout(() =>{this.loadData()},80))
                .catch(err => console.error(this.props.url, err.toString())))
            .catch(err => {
				               console.log(err);
                        $("body").css("overflow", "auto");
							$("body").css("paddingRight", "0");
                $(".note").css("filter", "blur(0px)");
                $("#add_note").css("filter", "blur(0px)");
                $("#note_closeup_background").css("display", "none");
                $("#note_closeup").css("display", "none");
				$("#note_closeup_info").css("display", "none");
				$(".color").removeClass("selected");
                this.setState({
                    status: {
                        selected: false,
                        id_client: undefined,
                        id_server: undefined,
						changed:false,
                    }
                });
				setTimeout(() =>{this.loadData()},80);
            });
		
    }
}
	
login(){
		$.ajax({
  type: "POST",
  url: "login.php",
  data: { login: $( "input[name='uname']" ).val(), password: $( "input[name='psw']" ).val() },
   success: (result)=> {
	   if (result) result = JSON.parse(result);
        if (result.error) {
            alert(result.error.msg);
			return false;
        }
			 this.setState({user:{logged:true,name:result.user.login}});
			   	this.loadData();
    }
})
}
logout(){
	$.ajax({
  method: "POST",
  url: "logout.php",
   success: ()=> {
	   this.setState({user:{logged:false,name:'Гость'}});
	   	this.loadData();
   }
})
}
registration(){
	$.ajax({
  type: "POST",
  url: "registration.php",
  data: { login: $( "input[name='uname']" ).val(), password: $( "input[name='psw']" ).val() },
   success: (result)=> {
	   if (result) result = JSON.parse(result);
        if (result.error) {
            alert(result.error.msg);
        }
		
			   	this.loadData();
    }
})
}
render() {
	
	const isLargeDesktop = this.state.screen.scale1;
	const isDesktop = this.state.screen.scale2;
	const isTablet = this.state.screen.scale3;
	const isMobile = this.state.screen.scale4;
	const notes ={display:'flex',   alignItems:'flex-start',justifyContent:'flex-start',flexWrap:'wrap',margin:'auto',marginTop:'20px',width:'1280px'};
	const note = { flexWrap: 'nowrap',userSelect:'none',cursor: 'pointer',width:'290px',height:'290px',backgroundColor:'rgb(244, 244, 0)',border:'3px solid rgb(83, 39, 0)',borderRadius:'35px 0 0 0',margin:'50px 0 0 20px'};
	const note_title = {marginTop:'8px',position:'relative',fontWeight:'900',fontSize:'26px',textAlign :'left',paddingLeft:'16px',height:'40px'};
	const note_content = {wordBreak:'break-all',overflow:'hidden',whiteSpace:'pre-wrap',fontSize:'20px',height:'239px',backgroundColor:'rgb(255, 255, 255)',borderTop:'3px solid rgb(83, 39, 0)'};
	const delete_note={padding:'0',position:'absolute',fontSize:'30px',width:'40px',height:'40px',color:'red',right:'25px',top:'-5px',backgroundColor:'rgb(244, 244, 0',textAlign :'center'};
	
	
	const note_closeup_background= {cursor: 'pointer',zIndex:'999',display:'none',left:'0',top:'0',width:'100%',height:'100%',position:'fixed',backgroundColor:'rgba(35,35,35,0.2)'};
	const note_closeup={display:'flex',flexWrap: 'nowrap',flexDirection: 'column',left:'0',right:'0',margin:'200px auto',maxWidth:'600px',width:'60%',minWidth:'300px',position:'fixed ',backgroundColor:'rgb(255, 255, 255)',border:'1px solid black'};
	const note_closeup_title= {backgroundColor:'rgb(244, 244, 222)',display:'inline-block',width:'99%',height:'50px',textAlign :'center',fontSize:'34px',borderBottom:'1px solid rgb(111, 111, 111)'};
	const note_closeup_content = {wordBreak:'break-all',whiteSpace:'pre-wrap',overflowY:'auto',overflowX:'hidden',display:'inline-block',width:'99%',height:'400px',fontSize:'26px'};
	const note_closeup_info={cursor: 'auto',padding:'0',display:"none",width:'100%',height:'auto',textAlign :'right',borderTop:'1px solid rgb(111,111,111)'};
	const note_closeup_colors={ alignItems:'flex-start',cursor: 'auto',padding:'0',display:"none",width:'100%',height:'30px',borderTop:'1px solid rgb(111,111,111)'};
	const color={ flexGrow: '1',flexBasis: '0',cursor: 'pointer',width:'auto',height:'30px'}
	

	
	const header={ borderRadius: '0 0 54px 54px',display:'flex',justifyContent:'center',width:'100%',height:'40px',position:'fixed',left:'0',top:'0',backgroundColor:'rgb(99,99,99)'}
	const login_input={padding:'5px 0',fontSize:'22px'}
	const header_info={padding:'5px 10px',color:'white',fontSize:'22px'}
	
	if (isDesktop){
		notes.width='960px';
	}
	if (isTablet){
		notes.width='640px';
		notes.marginTop='50px';
	}
	
	if (isMobile) {
		notes.margin='';
		notes.width= (parseInt(window.innerWidth)-30)+"px";
		note_content.overflowX='hidden';
		note.width='100%';
		note_title.fontSize='22px';
		 note.maxWidth='none';
		 note.margin='6px 0 0 0';
		 note.borderRadius='0';
		header.display='none';
	}
	if(this.state.user.logged){
		$( "input[name='uname']" ).hide();
		$( "input[name='psw']" ).hide();
		$( "button[name='login']" ).hide();
		$( "button[name='logout']" ).show();
	} else{
		$( "button[name='logout']" ).hide();
		$( "input[name='uname']" ).show();
		$( "input[name='psw']" ).show();
		$( "button[name='login']" ).show();
	}
    return <div> 
			<div style = {header}>
				<div style={header_info}>{this.state.user.name}</div>
			  <form>
			    <input maxlength='12' style={{...login_input,...{width:'180px'}}} type="text" placeholder="Логин" name="uname"></input>
				<input maxlength='12' style={{...login_input,...{width:'180px'}}} type="password" placeholder="Пароль" name="psw"></input>
				<button style={login_input} onClick={()=>this.login()} name="login" type="button">Войти</button>
				<button style={login_input}  onClick={()=>this.registration()}name="login" type="button">Регистрация</button>
				<button style={login_input}  onClick={(e)=>this.note_closeup(e)} name="newnote" type="button">Новая заметка</button>
				<button style={login_input} onClick={()=>this.logout()}  name="logout"type="button">Выйти</button>
				 </form>
			</div>
			
			<div id ="note_closeup_background" style = {note_closeup_background} onClick={(e)=>this.save(e)}>
				 <div style = {note_closeup}>
					<input type="text"  rows="1" onKeyPress={(e)=>{this.note_changed(e)}}  onKeyDown={(e)=>this.note_changed(e)}  maxlength="14" id="note_closeup_title" style={note_closeup_title}></input>
					<textarea onKeyPress={(e)=>this.note_changed(e)}  onKeyDown={(e)=>this.note_changed(e)} id="note_closeup_content"  style={note_closeup_content}></textarea>
									<div id="note_closeup_info" style={note_closeup_info}></div>
					<div id="note_closeup_colors" style={note_closeup_colors} onClick={(e)=>this.change_color(e)}>
					<div  className='color' style={{...color,...{backgroundColor:"GreenYellow"}}} id="GreenYellow"></div>
					<div  className='color' style={{...color,...{backgroundColor:"LightBlue"}}} id="LightBlue"></div>
					<div  className='color' style={{...color,...{backgroundColor:"Navy"}}} id="Navy"></div>
					<div  className='color' style={{...color,...{backgroundColor:"White"}}} id="White"></div>
					<div  className='color' style={{...color,...{backgroundColor:"DarkGreen"}}} id="DarkGreen"></div>
					</div>
				</div>		
			</div>
			<div id="notes_list" style = {notes} >
			 
      { this.state.data.map((item, i) => {
				return <div  className ='note' id={item.id} style={note} 	onClick={(e)=>{this.note_closeup(e,i,item.id,item.color,item.background_color)}} onMouseOver={(e)=>this.note_closeup_mouseover(e)}  onMouseOut={(e)=>this.note_closeup_mouseout(e)} >
					<div  className="note_title"   style={note_title}>{item.title}
					<div  onClick={()=>{this.delete_note(i,item.id);}} id='delete_note' onMouseOver={(e)=>this.note_closeup_mouseover(e)}  onMouseOut={(e)=>this.note_closeup_mouseout(e)}  style={delete_note}>{String.fromCharCode(10006)}</div>
					</div>
					<div className="note_content"   style={{...note_content,...{color:item.color,backgroundColor:item.background_color}}} >{item.content}</div>
				</div>
        })
      }
			</div>
	 
	  </div>
  }
}
			
ReactDOM.render(<App/>, document.getElementById('app'));




