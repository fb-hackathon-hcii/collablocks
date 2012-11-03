//private functions

function addMeshBlockArray(x,y,z, inColor)
{
	var geometry = new THREE.CubeGeometry(blockSize, blockSize, blockSize)

	var material = new THREE.MeshBasicMaterial( { color: inColor, wireframe: true, transparent: true, wireframeLinewidth: 4 } ); 

	var voxel = new THREE.Mesh( geometry, material );
	voxel.position.x = blockSize * (x-gridx) + 25;
	voxel.position.y = blockSize * y + 25;
	voxel.position.z = blockSize * (z-gridz) + 25;
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

function createLevelOne(ingridx, ingridz, players)
{
	var levelColor = createRandomColor()

	var flag=0
	var data = []
	for(var x=0; x<ingridx; x++)
	{
		for(var z=0;z<ingridz;z++)
		{
			data[x] = []
			if((x==ingridx/2 || x==(ingridx/2)-1) && z==ingridz/2)
			{
				flag=1
				data[x][z] = players

			}
			else if((x==ingridx/2 || x==ingridx/2-1) && z==ingridz/2-1)
			{
				flag=1
				data[x][z] = players
			}
			else
			{
				flag=0
				data[x][z] = 0
			}

			/*
			if(flag == 1)
			{
				for(var i=0;i<players;i++)
				{
					addMeshBlockArray(x,i,z, levelColor)		
				}
			}
			*/

			flag=0

		}
	}

	var outData = []
	var z=0
	for(var i=0;i<ingridx;i++)
	{
		for(var j=0;j<ingridz;j++)
		{
			outData[z] = data[i][j]
			z++
		}
	}

	var jsonver = {
		name: 'level ONE',
		bounds: {x:ingridx, y:ingridz, v:players},
		data: outData
	}

	return jsonver
}

exports.generateLevelOneJSON = function(ingridx, ingridz, players)
{
	var flag=0
	var data = []
	for(var x=0; x<ingridx; x++)
	{
		for(var z=0;z<ingridz;z++)
		{
			data[x] = []
			if((x==ingridx/2 || x==(ingridx/2)-1) && z==ingridz/2)
			{
				flag=1
				data[x][z] = players

			}
			else if((x==ingridx/2 || x==ingridx/2-1) && z==ingridz/2-1)
			{
				flag=1
				data[x][z] = players
			}
			else
			{
				flag=0
				data[x][z] = 0
			}

			flag=0

		}
	}

	var outData = []
	var z=0
	for(var i=0;i<ingridx;i++)
	{
		for(var j=0;j<ingridz;j++)
		{
			outData[z] = data[i][j]
			z++
		}
	}

	var jsonver = {
		name: 'level ONE',
		bounds: {x:ingridx, y:ingridz, v:players},
		data: outData
	}

	return jsonver
}

exports.visualizeLevel = function(inJSON)
{
	var levelColor = createRandomColor()
	var xbound = inJSON['bounds'][x]
	var zbound = inJSON['bounds'][y]
	var levelData = inJSON['data']

	var x = z = prvx = 0
	for(var i=0;i<levelData.length;i++)
	{
		x = i%xbound

		if(prvx == x)
			z=0
		else
			z++

		for(var j=0;j<levelData[i];j++)
		{
			addMeshBlockArray(x,j,z, levelColor)	
		}

		prvx = x
	}
}