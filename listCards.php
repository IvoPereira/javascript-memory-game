<?php

$current_link = 'http://www.ivopereira.net/experiments/games/memory';

$card_names = array(
				'1-alakazam.jpg',
				'2-blastoise.jpg',
				'3-chansey.jpg',
				'4-charizard.jpg',
				'5-clefairy.jpg',
				'6-gyarados.jpg',
				'7-hitmonchan.jpg',
				'8-machamp.jpg',
				'9-magneton.jpg',
				'10-mewtwo.jpg',
				'11-nidoking.jpg',
				'12-ninetales.jpg',
				'13-poliwrath.jpg',
				'14-raichu.jpg',
				'15-venusaur.jpg',
				'16-zapdos.jpg',
				'17-beedrill.jpg',
				'18-dragonair.jpg',
				'19-dugtrio.jpg',
				'20-electabuzz.jpg',
				'21-electrode.jpg',
				'22-pidgeotto.jpg',
				'23-arcanine.jpg',
				'24-charmeleon.jpg',
				'25-dewgong.jpg',
				'26-dratini.jpg',
				'27-farfetchd.jpg',
				'28-growlithe.jpg',
				'29-haunter.jpg',
				'30-ivysaur.jpg',
				'31-jynx.jpg',
				'32-kadabra.jpg',
				'33-kakuna.jpg',
				'34-machoke.jpg',
				'35-magikarp.jpg',
				'36-magmar.jpg',
				'37-nidorino.jpg',
				'38-poliwhirl.jpg',
				'39-porygon.jpg',
				'40-raticate.jpg',
				'41-seel.jpg',
				'42-wartortle.jpg',
				'43-abra.jpg',
				'44-bulbasaur.jpg',
				'45-caterpie.jpg',
				'46-charmander.jpg',
				'47-diglett.jpg',
				'48-doduo.jpg',
				'49-drowzee.jpg',
				'50-gastly.jpg',
				'58-pikachu.jpg'
			  );

$data = array();

for($i=0; $i < count($card_names); $i++) {
	//add each card to the array
	$data[] = array(
				'id'	=>	$i,
				'img'	=>	$current_link . '/img/' . $card_names[$i]
			  );
} // for

$data = json_encode($data);

if(!empty($_GET) && array_key_exists('callback', $_GET)){

    header('Content-Type: text/javascript; charset=utf8');
    header('Access-Control-Allow-Origin: http://www.ivopereira.net/');
    header('Access-Control-Max-Age: 3628800');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

    $callback = $_GET['callback'];
    echo $callback.'('.$data.');';

}else{
	
    // normal JSON string
    header('Content-Type: application/json; charset=utf8');

    echo $data;

}