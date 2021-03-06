	var container, stats;
	var camera, scene, renderer;
	var projector, plane;
	var mouse2D, mouse3D, ray, theta = 0,
	isShiftDown = false, isCtrlDown = false,
	target = new THREE.Vector3( 0, -400, 0 );
	var ROLLOVERED;

	var fps = 0
	var diff = 0.4
	var iter = 0
	

	var blockSize = 50;
	var blockHeight = 25;
	var size = 16; 

	var grid = new Array(size);
	for (var i = 0; i <= size; i++)
	{
		grid[i] = new Array(size);
		for (var k = 0; k < size; k++)
		{
			grid[i][k] = new Array();
		}
	}
	
	function init() {
	
		container = document.createElement( 'div' );
		document.body.appendChild( container );
	
		camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000 );
		camera.position.y = 800;
		camera.position.x = 100;
		camera.position.z = 100;
		camera.lookAt( target );
	
		scene = new THREE.Scene();
	
		// Grid				
		var geometry = new THREE.Geometry();
		
		var coordSize = size/2*blockSize;
		
		for ( var i = - coordSize; i <= coordSize; i += blockSize ) 
		{
			geometry.vertices.push( new THREE.Vector3( - coordSize, 0, i ) );
			geometry.vertices.push( new THREE.Vector3(   coordSize, 0, i ) );
	
			geometry.vertices.push( new THREE.Vector3( i, 0, - coordSize ) );
			geometry.vertices.push( new THREE.Vector3( i, 0,   coordSize ) );
		}
	
		var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } );
	
		var line = new THREE.Line( geometry, material );
		line.type = THREE.LinePieces;
		scene.add( line );
	
		projector = new THREE.Projector();
	
		plane = new THREE.Mesh( new THREE.PlaneGeometry( 1000, 1000 ), new THREE.MeshBasicMaterial() );
		plane.rotation.x = - Math.PI / 2;
		plane.visible = false;
		scene.add( plane );
	
		mouse2D = new THREE.Vector3( 0, 10000, 0.5 );
		ray = new THREE.Ray( camera.position, null );
	
		// Lights
	
		var ambientLight = new THREE.AmbientLight( 0x606060 );
		scene.add( ambientLight );
	
		var directionalLight = new THREE.DirectionalLight( 0xffffff );
		directionalLight.position.x = 0.6270936985508198;
		directionalLight.position.y = 0.18486881118173537;
		directionalLight.position.z = 0.7566881893422849;
		directionalLight.position.normalize();
		scene.add( directionalLight );
	
		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setSize( window.innerWidth, window.innerHeight );
	
		container.appendChild(renderer.domElement);
	
		window.addEventListener( 'resize', onWindowResize, false );
		
		// todo: remove, temporary blocks
		//testAddBlock();
	}
	
	function onWindowResize() {
	
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	
		renderer.setSize( window.innerWidth, window.innerHeight );
	
	}
	
	
	function addBlock(x, y, color, id)
	{
		
		var z = grid[x][y].length;
		
		var block = new Block(x, y, z, color, 1, id);
		animateAddBlock(block);


//		voxelBlock.id = id;
//		grid[x][y].push(voxelBlock);
	}
	
	function Block(x, y, z, color, blockHeight, id)
	{
		this.x = x;
		this.y = y;
		this.z = z;
		this.color = color;
		this.blockHeight = blockHeight;
		this.id = id;
				
		this.createNewVoxel = function() {
			var material = new THREE.MeshLambertMaterial( { vertexColors: THREE.FaceColors, transparent: false } );
			material.opacity = .75;
		
			var geometry = new THREE.CubeGeometry( blockSize, this.blockHeight, blockSize);
	
			for ( var i = 0; i < geometry.faces.length; i ++ ) {
				geometry.faces[ i ].color.setHex( color );
			}

			var voxel = new THREE.Mesh( geometry, material );
			voxel.position.y = this.blockHeight * this.z  + 25;  // this is the z-axis				
			voxel.position.x = blockSize * (this.x - size/2) + 25;  
			voxel.position.z = blockSize * (this.y - size/2) + 25;
			voxel.matrixAutoUpdate = false;
			voxel.updateMatrix();
			this.currentVoxel = voxel;
			return voxel;		
		};
		
		this.currentVoxel = this.createNewVoxel();

	}

	
	function animateAddBlock(block)
	{
		var animationId = requestAnimationFrame(
			function(callback, element) {
				animateAddBlock(block);
			}
		);
		
		if ((block.blockHeight % blockHeight) == 0)
		{
			cancelAnimationFrame(animationId);
			var voxelBlock = block.currentVoxel;
			voxelBlock.id = block.id;
			grid[block.x][block.y].push(voxelBlock);
			console.log(scene);
		}
		else
		{
			scene.remove(block.currentVoxel);
//			block.currentVoxel.scale.y += 5;
			block.blockHeight += 1;
			scene.add(block.createNewVoxel());
		}
	}
	
	// sorry whoever has to read this =(
	function removeBlock(x, y, id)
	{
		var blockCandidates = grid[x][y];
		var untouchedBlocks = new Array();
		var blocksToShift = new Array();
		
		var blockFound = false;
		
		for (var i = 0; i<blockCandidates.length; i++)
		{
			if (blockCandidates[i].id == id)
			{
				scene.remove(blockCandidates[i]);
				blockFound = true;
			}
			else if (blockFound)
			{
				blocksToShift.push(blockCandidates[i]);
			}
			else 
			{
				untouchedBlocks.push(blockCandidates[i]);
			}
		}
		
		// shift blocks down a layer in the scene
		for (var i = 0; i<blocksToShift.length; i++)
		{
			scene.remove(blocksToShift[i]);
			blocksToShift[i].position.y -= blockHeight;
			blocksToShift[i].updateMatrix();
			scene.add(blocksToShift[i]);
		}
		
		grid[x][y] = untouchedBlocks.concat(blocksToShift);
	}
	
	function save() {
		window.open( renderer.domElement.toDataURL('image/png'), 'mywindow' );
	}
	
	
	function animate() {
		requestAnimationFrame( animate );
		render();
	}

	function render() {
		iter++
		if(iter > 125)
		{
			diff = -diff
			iter = -125
		}
		theta += diff
	
		camera.position.x = 1400 * Math.sin( theta * Math.PI / 360 );
		camera.position.z = 1400 * Math.cos( theta * Math.PI / 360 );
		camera.lookAt( target );
		
		renderer.render( scene, camera );
	}
	
	/*
	 * TEST FOR ADDING BLOCKS
	 */
	 
	function testAddBlock()
	{
		// addBlock(0, 0, color, id)
		addBlock(0,0, 0x00ff80, 0);
		addBlock(0,0, 0x00ff80, 1);
		addBlock(15,15, 0x000000, 2);
		addBlock(15,15, 0xffffff, 6);
		addBlock(15,15, 0x000000, 2);
		addBlock(15,15, 0xffffff, 6);
		addBlock(15,15, 0x000000, 2);
		addBlock(15,15, 0xffffff, 6);
		addBlock(15,15, 0x000000, 2);
		addBlock(15,15, 0xffffff, 6);
		addBlock(15,15, 0x000000, 2);
		addBlock(15,15, 0xffffff, 6);
		addBlock(15,15, 0x000000, 2);
		addBlock(15,15, 0xffffff, 6);
		addBlock(15,15, 0x000000, 2);
		addBlock(15,15, 0xffffff, 6);
		addBlock(15,15, 0x000000, 2);
		addBlock(15,15, 0xffffff, 6);
		addBlock(15,15, 0x000000, 2);
		addBlock(15,15, 0xffffff, 6);
		addBlock(15,15, 0x000000, 2);
		addBlock(15,15, 0xffffff, 6);
		addBlock(15,15, 0xffffff, 6);

		addBlock(0,0, 0x00ff80, 3);
		addBlock(0,0, 0x00ff80, 4);
	}
	
	
	function testRemoveBlock()
	{
		//removeBlock(x, y, id)
		removeBlock(15, 15, 2);
		removeBlock(15, 15, 6);
		removeBlock(15, 15, 5);
	}

	// wireframe functions

	function addMeshBlock(x,y,z, inColor)
	{
		var geometry = new THREE.CubeGeometry(blockSize, blockHeight, blockSize)

		var material = new THREE.MeshBasicMaterial( { color: inColor, wireframe: true, transparent: true, wireframeLinewidth: 1 } ); 

		var voxel = new THREE.Mesh( geometry, material );
		voxel.position.x = blockSize * (x-(size/2)) + 25;
		voxel.position.y = blockHeight * y + 25;
		voxel.position.z = blockSize * (z-(size/2)) + 25;
		voxel.matrixAutoUpdate = false;
		voxel.updateMatrix();
		//console.log(voxel);
		scene.add( voxel );

	}

	function createRandomColor()
	{
		var color = new THREE.Color(0xffffff)
		color.setRGB(Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2))
		return color
	}

	function coinToss()
	{
		var val = Math.random().toFixed(2)
		if(val > 0.5)
			return 1
		else
			return 0
	}

	visualizeLevel = function()
	{
		//addMeshBlock(0,0,0, createRandomColor())
		var levelColor = createRandomColor()
		var xbound = level['bounds']['x']
		//var zbound = inJSON['bounds']['y']
		var levelData = level['data']

		var x = z = prvx = 0
		for(var i=0;i<levelData.length;i++)
		{
			for (var h=0; h < levelData[i]; h++) {
				addMeshBlock(i % xbound, h, Math.floor(i/xbound), levelColor)
			}
		}

	}

	updateLevelName = function(name)
	{
		$('#level-name').text(name)
	}

	updateLevelName2 = function(name)
	{
		$('#level-name-2').text(name)
	}

	updateLevelProgress = function(progress)
	{

		$('#level-complete').css('width', progress + '%')
	}

	updateLevelProgress2 = function(progress)
	{

		$('#level-complete-2').css('width', progress + '%')
	}

	updateActivePlayers = function(delta)
	{
		var val = window.players
		console.log(val, delta)	
		if((val+delta) >= 0)
		{
			var num = val + delta
			window.players = num
			$('#active-players').text(num.toString())

			if(num == 3)
			{
				//activate the next level
				if(window.team == 'Pirates')
				{
					ss.rpc('game.activateNextLevel', 3, num, 'resultsteam1')
					ss.publish.all('clearInput')
				}
				else
					ss.rpc('game.activateNextLevel', 3, num, 'resultsteam2')
			}
		}
		else
		{
			var num = 0
			window.players = 0
			$('#active-players').text(num.toString())
		}
	}
	
		
$(document).ready(function() {
	init();
	animate();

	window.team = $(document)[0]['title']
	window.players = 0
	/*
	if(team == 'Pirates')
	{
		ss.rpc('game.subscribeTeam1', function(res){
		console.log('subscribed to team1 updates', res)
		})
	}
	else if(team == 'Ninjas')
	{
		ss.rpc('game.subscribeTeam2', function(res){
		console.log('subscribed to team2 updates', res)
		})	
	}
	*/

	ss.event.on('setBlock', function(options) {
		console.log('on setBlock', options)
		var t = Date.now()
		addBlock(options.x, options.y, options.color, options.id)
		//render()
		console.log('addblock:' + (Date.now() - t))
		
	});

	ss.event.on('removeBlock', function(options) {
	  removeBlock(options.x, options.y, options.id)
	});

	ss.event.on('newLevel', function(level) {
		console.log('new level!', level.name)
		window.level = level
		visualizeLevel()
		updateLevelName(level.name)
		updateLevelProgress(0)
	})

	ss.event.on('newLevel2', function(level) {
		console.log('new level!', level.name)
		window.level = level
		console.log(level)
		visualizeLevel()
		updateLevelName2(level.name)
		updateLevelProgress2(0)
	})

	ss.rpc('game.subscribeView', function(res){
		console.log('subscribed to updates', res)
	})

	ss.event.on('updatePlayers', function(delta) {
		console.log('updatePlayers event fired')
		console.log(delta)
		updateActivePlayers(delta)
	})

	/*
	setInterval(function(){
		console.log('fps: '+window.fps)
		fps=0
	}, 1000)
	*/


	

});

