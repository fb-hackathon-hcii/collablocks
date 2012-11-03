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