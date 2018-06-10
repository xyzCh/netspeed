
const St = imports.gi.St;
const Main = imports.ui.main;
const gio=imports.gi.Gio;
const Mainloop=imports.mainloop;

let button,label,timer;
let lastdown=0,lastup=0;
let refeshtime=2;

function read(){
	let file=gio.file_new_for_path("/proc/net/dev");
	let inputStream=file.read(null);
	let dataInputStream=gio.DataInputStream.new(inputStream);
	let down=0,up=0;
	while(line=dataInputStream.read_line(null)){
		line=String(line);
		line=line.trim();
		let words=line.split(/\W+/);
		if(words.length<=3) break;
		if(words[0]!="face" && words[0]!="Inter" && words[0]!="lo" && !isNaN(parseInt(words[1]))){
			down+=parseInt(words[1]);
			up+=parseInt(words[9]);
		}
	}
	inputStream.close(null);
	if(lastdown==0)
		lastdown=down;
	if(lastup==0)
		lastup=up;
	
	let speeddown=(down-lastdown)/refeshtime/1024;
	let speedup=(up-lastup)/refeshtime/1024;
	
	let netspeed="";
	if(speeddown==0)
		netspeed="0 ᴷ᜵ₛ";
	else if(speeddown<10)
		netspeed=speeddown.toFixed(2)+" ᴷ᜵ₛ";
	else if(speeddown<100)
		netspeed=speeddown.toFixed(1)+" ᴷ᜵ₛ";
	else if(speeddown<1000)
		netspeed=Math.floor(speeddown)+" ᴷ᜵ₛ";
	else{
		speeddown=speeddown/1024;
		if(speeddown<10)
			netspeed=speeddown.toFixed(2)+" ᴹ᜵ₛ";
		else if(speeddown<100)
			netspeed=speeddown.toFixed(1)+" ᴹ᜵ₛ";
		else if(speeddown<1000)
			netspeed=Math.floor(speeddown)+" ᴹ᜵ₛ";
	}
	label.set_text(netspeed);
	lastdown=down;
	lastup=up;

	return true;

}

function init() {
    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: false,
                          x_fill: true,
                          y_fill: false,
                          track_hover: false });
    label = new St.Label({style_class: 'helloworld-label',text:"0 ᴷ᜵ₛ"});
    button.set_child(label);
}

function enable() {
    Main.panel._rightCorner._button.get_children()[0].insert_child_at_index(button, 0);
	timer=Mainloop.timeout_add_seconds(refeshtime,read);
}

function disable() {
    Main.panel._rightCorner._button.get_children()[0].remove_child(button);
	Mainloop.source_remove(timer);
}
