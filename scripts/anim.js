let amountOfColors = 18; // Or "participants"

let container = document.getElementById('chat-container');
let lineWidth = 500;
let profileImgWidth = 60;
let textWidth = lineWidth - 20 - profileImgWidth - 10;
let chats = [];

let demotext = "おれあぽすげぇおれあぽすげぇおれあぽすげぇおれあぽすげぇおれあぽすげぇおれあぽすげぇおれあぽすげぇおれあぽすげぇおれあぽすげぇおれあぽすげぇおれあぽすげぇおれあぽすげぇおれあぽすげぇおれあぽすげぇおれあぽすげぇ";
let demoname = 'れあぽおれあぽおれあぽ'
let demoimgurl = "https://yt4.ggpht.com/ytc/AKedOLTN9TOxEF4KIA3jpTo0OtAKG2_Bv3ikYvAQ9-Bpjg=s64-c-k-c0x00ffffff-no-rj"

function createElement(opts = {}) {
	let ele = document.createElement('div');

	if ('class' in opts) {
		if (!Array.isArray(opts.class)) {
			opts.class = [opts.class];
		}
		ele.classList.add(...opts.class);
	}

	if ('innerhtml' in opts) {
		ele.innerHTML += opts.innerhtml;
	}

	return ele;
}

function createImageElement(opts = {}) {
	let img = document.createElement('img')

	for (let opt in opts) {
		if (opt == 'class') {
			img.classList.add(opts.class);
		} else if (opt == 'src') {
			img.src = opts[opt];
		} else {
			img.setAttribute(opt, opts[opt])
		}
	}
	return img;
}

function addChat() {
	let chat = new Chat();
	chats.push(chat);
	setTimeout(() => chat.loop(), 200);
	return chat;
}

class Chat {
	constructor() {
		this.ele = createElement({
			class: 'chat'
		});
		this.lines = [];
		this.anim = null;
		container.appendChild(this.ele);
	}
	addLine() {
		let l = new Line();
		this.lines.push(l);
		this.ele.appendChild(l.ele.lineContainer);
		return l;
	}
	removeOldest() {
		let maxCount = Math.ceil(window.innerHeight / 1080 * 12);
		if (this.lines.length > maxCount) {
			let oldest = this.lines.splice(0, this.lines.length - maxCount);
			oldest.forEach(n => this.ele.removeChild(n.ele.lineContainer));
		}
	}
	loop() {
		if (this.anim) {
			this.stopLoop();
		}
		this.addLine();
		this.removeOldest();
		this.anim = setTimeout(() => this.loop(), 1200);
	}
	stopLoop() {
		clearTimeout(this.anim);
		this.anim = null;
	}
}

class Line {
	constructor() {
		this.pickColor();
		this.setupElements();
		this.animateIn();
	}

	pickColor() {
		this.hue = Math.floor(
			Math.random() * amountOfColors) * (360 / amountOfColors);
		this.color = `hsl(${this.hue}, 90%, 50%)`;
		this.profileImgColor = `hsl(${this.hue}, 40%, 55%)`;
		return this.hue;
	}

	setupElements() {
		let ele = this.createElement();
		this.ele = ele;
		// ele.name.style.width = this.name * (textWidth / 2) + 'px';
		ele.texts.forEach((n, i, arr) => {
			let w = textWidth;
			if (i === arr.length - 1) {
				w = Math.max(0.2, (this.textCount - i)) * textWidth;
			}
			n.style.width = w + 'px';
		});
		ele.name.style.backgroundColor = this.color;
		ele.profileImg.style.backgroundColor = null;
	}

	animateIn() {
		let delay = 35; // Some times it won't animate correctly without this
		let ele = this.ele;
		setTimeout(() => {
			ele.lineContainer.style.opacity = 1;
			ele.lineContainer.style.maxHeight = '200px';
			ele.lineContainer.style.transform = 'translateX(0px) scale(1)';
		}, delay);

		let otherEleList = [ele.profileImg, ele.name, ...ele.texts];

		if ('img' in ele) {
			otherEleList.push(ele.img);
		} else if ('richBody' in ele) {
			otherEleList.push(ele.richBody);
		}

		delay += 40;

		otherEleList.forEach((e, i) => {
			setTimeout(() => {
				e.style.opacity = 1;
				e.style.transform = 'translateY(0px)';
			}, delay += 50);
		});

		ele.texts.forEach((n, i, arr) => setTimeout(() => n.style.opacity = 1, 70 * (i + 3) + delay));
	}

	createElement() {
		let lineContainer = createElement({
			class: 'line-container'
		});
		let line = createElement({
			class: 'line'
		});

		let profileImg = createElement({
			class: 'profile-img'
		});
		profileImg.appendChild(
			createImageElement({
				class: 'profile-photo',
				src: demoimgurl
			})
		);

		let body = createElement({
			class: 'body'
		});
		let name = createElement({
			class: 'name',
			innerhtml: demoname
		});
		let texts = [];
		// let img = createElement({ class: 'img' });
		// let richBody = createElement({ class: 'rich-body' });

		body.appendChild(name);
		for (let i = 0; i < (this.textCount || 1); i++) {
			let text = createElement({
				class: 'text',
				innerhtml: demotext
			});
			texts.push(text);
			body.appendChild(text);
		}
		line.appendChild(profileImg);
		line.appendChild(body);
		lineContainer.appendChild(line);
		let out = {
			lineContainer,
			line,
			profileImg,
			body,
			name,
			texts
		};

		// this.hasImg && (out.img = img) && body.appendChild(img);
		// this.hasRichBody && (out.richBody = richBody) && body.appendChild(richBody);

		return out;
	}
}

function loop() {
	chats.forEach(n => n.loop());
}

function stopLoop() {
	chats.forEach(n => n.stopLoop());
}

(() => addChat())();