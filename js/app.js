/*--------------------------------------------------------------------------
 * Memory Game
 *
 * Created      : 06/02/2014
 * Modified     : 01/03/2014
 * Version      : 0.1
 * Developer : Ivo Pereira
---------------------------------------------------------------------------*/

if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function () { };

var app = {

	// Game variables
	clicks: 0,

	// Objects to be cached
	divIdMainTable: 'memory_match',
	divIdScreenMenu: 'menu',
	divIdScreenShare: 'share',
	buttonIdNewGame: 'new_game',
	buttonIdResetGame: 'reset_game',
	divIdTimer: 'timer',

	// Default settings
	defaultBackImage: './img/default.png',
	cardClass: 'class',
	debugMode: false, // turn this on to see some magic in the console :)
	
	// API Endpoint
	cardsCollectionURI: './listCards.php',
	cardsCollectionURICallback: 'app.cardsCollection.selectRandomCards',
	
	// Table settings
	tableHeight: 3,
	tableWidth: 6,
	timerEffectMs: 1000,
	
	// Timer
	timerObject: null,
	timerSeconds: 0,
	hideTimer: null,
	
	// Card storage
	allCards: null,
	tableCards: null,
	pairTableCards: null,
	selectedCard: null,
	totalCards: 0,
	totalSingleCards: 0,
	
	// Hand variables
	firstPick: null,
	secondPick: null,
	totalDiscovered: 0,
	
	init: function() {

		// let's get the object from that id, and grab it into a cross-browser solution to make this rule the world!
		document.getElementById(app.buttonIdNewGame).onclick = function(e) {
			if (!e) var e = window.event;

			app.helperFunctions.log('Começa o jogo');
			document.getElementById(app.divIdScreenMenu).style.display = "none";
		};


		
		document.getElementById(app.buttonIdResetGame).onclick = function(e) {
			if (!e) var e = window.event;

			app.helperFunctions.log('Recomeça o jogo');
			document.getElementById(app.divIdMainTable).innerHTML = "";
			document.getElementById(app.divIdScreenShare).style.display = "none";
			document.getElementById(app.divIdTimer).innerHTML = '00:00.000';
			app.totalDiscovered = 0;
			app.clicks = 0;
			app.timerSeconds = 0;
			// retrieve all cards collection
			app.cardsCollection.getCards();
		};

		// retrieve all cards collection
		app.cardsCollection.getCards();
		
	}, //init()
	
	
	cardsCollection: {
		
		
		
		getCards: function() {

			var fullURI = null;

			if (app.cardsCollectionURI) {
				fullURI = app.cardsCollectionURI;
				
				if(app.cardsCollectionURICallback) {
					fullURI += '?callback=' + app.cardsCollectionURICallback;
				} //if
			} //if

			if(fullURI === null) {
				app.helperFunctions.log('URI has not been specified.');
				return false;
			}

			var script = document.createElement("script");
			script.src = fullURI;
			document.getElementsByTagName("head")[0].appendChild(script);
			
		}, //getCards()
		
		
		
		
		
		selectRandomCards: function(cards) {
			
			if(cards) {
				
				app.allCards = app.helperFunctions.shuffle(cards);
				
				// now that we have got some cards, let's create the table
				app.table.create();

			} //if
			
		} //selectRandomCards()
		
		
		
		
	}, //cardsCollection
	
	
	
	
	table: {
		
		
		create: function() {
			
			var tableRows, tableColumns, row, column;
      
			if (!app.tableHeight || !app.tableWidth) {
				app.helperFunctions.log('Table size was not specified.');
				return false;
			} //if
			
			if (!app.helperFunctions.isInt( app.tableHeight ) || !app.helperFunctions.isInt( app.tableWidth )) {
				app.helperFunctions.log('Table size values are not integers.');
				return false;
			} //if
			
			
			// use the dimensions provided to create the table
			tableRows = parseInt(app.tableHeight);
			tableColumns = parseInt(app.tableWidth);
			
			
			app.totalCards = tableRows * tableColumns;
			app.totalSingleCards = app.totalCards / 2;
			
			
			
			// let's take the number of single cards - the cards we need - from the cards collection
			app.tableCards = app.allCards.slice(0, app.totalSingleCards);
			
			// pure javascript array copy
			app.pairTableCards = app.tableCards.slice(0);
			// lets shuffle the pair cards array
			app.pairTableCards = app.helperFunctions.shuffle(app.pairTableCards);



			// before we start to build our table, let's preload some images to prevent some waiting time for user
			app.table.preloadImages();
			
			
			// build rows
			for(row = 1; row <= tableRows; row++) {
			
				var divRow = document.createElement("div");
				divRow.setAttribute('class', 'row');
				document.getElementById(app.divIdMainTable).appendChild(divRow);
				
				// build columns
				for(column = 1; column <= tableColumns; column++) {
					
					var divColumn = document.createElement("div");
					divColumn.setAttribute('class', 'column');
					
					// work-around for setting attribute on great browsers
					if(divColumn.getAttribute('className') !== null) { // "browsers", cof cof.
						divColumn.setAttribute('className','column')
					} else { // real browsers
						divColumn.setAttribute('class','column')
					}
					
					// create image to populate column
					var divCard = document.createElement("img");
					
					// distribute cards to the default images
					if (app.tableCards.length > 0 || app.pairTableCards.length > 0) {
					
						if (app.tableCards.length > 0) {
							app.selectedCard = app.tableCards.pop();
						} else if (app.pairTableCards.length > 0) {
							app.selectedCard = app.pairTableCards.pop();
						}
						
						// set card settings 
						//divCard.src = app.selectedCard.img;
						divCard.src = app.defaultBackImage;
						divCard.width = 128;
						divCard.height = 180;
						divCard.setAttribute('card-id', app.selectedCard.id);
						divCard.setAttribute('card-image', app.selectedCard.img);
						
					}

						
					divColumn.appendChild(divCard);

					// append column
					divRow.appendChild(divColumn);
					
				} //for column

			}//for row

			
			// event handlers time!
			app.table.createEventHandlers();
			
			
			
		}, //createTable()
		
		
		
		
		preloadImages: function() {

			var img, card;

			// preload default image
				img=new Image();
				img.src=app.defaultBackImage;

			for(card = 0; card<app.tableCards.length; card++) {
				img=new Image();
				img.src=app.tableCards[card].img;	
			} //for
			
			for(card = 0; card<app.pairTableCards.length; card++) {
				img=new Image();
				img.src=app.pairTableCards[card].img;				
			} //for	
			
		}, //preloadImages()
		
		
		
		
		createEventHandlers: function() {
			
			// cardClass
			var cards = document.getElementsByTagName('img'), card;
			
			// for each card let's add an event handler!
			for(card = 0; card<cards.length; card++) {
				if( Object.prototype.hasOwnProperty.call(cards, card) ){

					/** let's flip the card on click **/
					// if the browser does support addEventListener
					cards[card].onclick = function(e) {
						if (!e) var e = window.event;

						app.game.flipCard(this);

					};

					/** do not allow the user to drag the card **/
					cards[card].ondragstart = function() { return false; };
			
				} // if
			} // for
			
		} //createEventHandlers()
		
		
		
	}, //table
	
	
	
	
	
	
	
	
	game: {
		
		
		
		flipCard: function(cardObject) {
			

			// if a match was already found, we will not allow any action
			if (cardObject.getAttribute('card-match')) {
				return false;
			}

			// if there is a click, and we already have another two picks selected, let's clean them!
			if (app.firstPick !== null && app.secondPick !== null) {
				app.firstPick.src = app.defaultBackImage;
				app.secondPick.src = app.defaultBackImage;
				app.firstPick = null;
				app.secondPick = null;
				clearTimeout(app.hideTimer);
			}
			
			// if nothing has been selected
			if (app.firstPick === null && app.secondPick === null) {

				app.helperFunctions.log('let\'s select FIRST pick');
				app.firstPick = cardObject;
				app.helperFunctions.log(app.firstPick);
				app.helperFunctions.log(app.secondPick);
				app.helperFunctions.log('=============');
				cardObject.src = cardObject.getAttribute('card-image');
				
			} else if (app.firstPick !== null && app.secondPick === null) {

				if (app.firstPick === cardObject) {
					return false;
				}

				app.helperFunctions.log('let\'s select SECOND pick');
				app.secondPick = cardObject;

				app.helperFunctions.log(app.firstPick);
				app.helperFunctions.log(app.secondPick);
				app.helperFunctions.log('=============');
				cardObject.src = cardObject.getAttribute('card-image');
				
			} // if
				
			// now we have got two objects selected
			if (app.firstPick !== null && app.secondPick !== null) {

				// check if objects are different. if they have the same id, we've got a match
				if (app.firstPick !== app.secondPick && app.firstPick.getAttribute('card-id') === app.secondPick.getAttribute('card-id')) {

					// match found
					app.totalDiscovered += 1;

					app.firstPick.setAttribute('card-match', 'true');
					app.secondPick.setAttribute('card-match', 'true');

					// two picks have been used, reset!
					app.firstPick = null;
					app.secondPick = null;

				// the user did not find a match
				} else {

					var tempImage = {
						id1:  app.firstPick,
						id2:  app.secondPick
					};

					// they do not match
					app.hideTimer = setTimeout(function() {

						// two picks have been used, reset, to let the user make other selection!
						app.firstPick = null;
						app.secondPick = null;

						tempImage.id1.src = app.defaultBackImage;
						tempImage.id2.src = app.defaultBackImage;

						clearTimeout(app.hideTimer);

					}, app.timerEffectMs);
				} // if

			} // if values assigned

			// if it does reach here, add one more click
			app.clicks += 1;

			if (app.clicks === 1) {
				// when the player does the first click, start the timer
				app.timer.start();
			}
			
			if (app.totalDiscovered === app.totalSingleCards) {
				// finish the game when all pieces are found
				app.game.end();
			} // if

		}, // flipCard()

		end: function() {
			app.timer.stop();
			app.helperFunctions.log('Finished the game. Time to share?');
				
			var endTime;

			if(document.all){
				endTime = document.getElementById(app.divIdTimer).innerText;
				document.getElementById('twitter-timer').innerText = 'Pokémon Memory Master in: ' + endTime;
			} else {
				endTime = document.getElementById(app.divIdTimer).textContent;
				document.getElementById('twitter-timer').textContent = 'Pokémon Memory Master in: ' + endTime;
			}

			// update timer in twitter share button
			document.getElementById('button-twitter').innerHTML = app.helperFunctions.generateTwitterButton('Pokémon Memory Master in: ' + endTime);
			if(twttr) {
			      	twttr.widgets.load();
      			}
			document.getElementById(app.divIdScreenShare).style.display = "block";
		} // endGame()
		
	}, // game
	
	
	

	timer: {

		start: function() {
				app.helperFunctions.log('Timer started.');
				
				// tick every 1 second
				app.timer.tick(1);
		}, //start()

		stop: function() {
				app.helperFunctions.log('Timer stopped.');
				
				clearInterval(app.timerHandler);
		}, //stop()
		
		tick: function(interval) {

			if (app.helperFunctions.isInt(interval)) {
				app.timerHandler = setInterval( function() {
					
					function pad(number,length) {
						var str = '' + number;
						while (str.length < length)
							str = '0' + str;
						return str;
					}
					
					// add time
					app.timerSeconds += 5;
					
          				var milli, milliseconds, seconds, minutes;
          
					milli = app.timerSeconds;
					milliseconds = milli % 1000;
					seconds = Math.floor((milli / 1000) % 60);
					minutes = Math.floor((milli / (60 * 1000)) % 60);

					document.getElementById("timer").innerHTML = pad(minutes,2) + ":" + pad(seconds,2) + "." + pad(milliseconds,3);

				}, interval);
			} //if


		}

	}, // timer
	


	
	
	helperFunctions: {
		
		isInt: function(value) {
			return typeof value === 'number' && !isNaN(parseInt(value)) && isFinite(value); 
		}, //isInt()
		
		shuffle: function(o) {
			for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
			return o;
		}, //shuffle()
		
		log: function(message) {
			if (app.debugMode === true) {
				console.log(message);
			} //if
		}, //log()

		generateTwitterButton: function(text) {
			if (text) {
				return '<a href="https://twitter.com/share" class="twitter-share-button" data-text="' + text + '" data-lang="pt">Tweet</a>';
			}
		} //generateTwitterButton()
		
	} //helperFunctions
	
	
	
};

window.onload = app.init;
