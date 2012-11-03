exports.generateTrainingJSON = function(ingridx, ingridz, players)
{
  var outData = []

  for(var x=0; x<ingridx; x++)
  {
    for(var z=0;z<ingridz; z++)
    {
      outData.push(0)
    }
  }

  var jsonver = {
    name: 'Training',
    bounds: {x:ingridx, y:ingridz, v:players},
    data: outData
  }

  return jsonver
}

exports.generateLevelOneJSON = function(ingridx, ingridz, players)
{
  var outData = []
  /*
  var data = []
  for(var x=0; x<ingridx; x++)
  {
    data[x] = []
    for(var z=0;z<ingridz;z++)
    {
      var outData = []
      //var data = []
      */
      for(var x=0; x<ingridx; x++)
      {
        //data[x] = []
        for(var z=0;z<ingridz;z++)
        {
          if((x==ingridx/2 || x==(ingridx/2)-1) && (z==ingridz/2 || z==ingridz/2-1))
          {
            //data[x][z] = players
            outData.push(players)
          }
          else
          {
            //data[x][z] = 0
            outData.push(0)
          }

        }
      }


  var jsonver = {
    name: 'level ONE',
    bounds: {x:ingridx, y:ingridz, v:players},
    data: outData
  }

  return jsonver
}

exports.generateLevelTwoJSON = function(xmax, ymax, zmax)
{
  var outData = []
  for(var i=0; i <xmax*ymax; i++)
  {
        outData.push( Math.round( zmax - (i%xmax/xmax * zmax) ) )
  }

  var jsonver = {
    name: 'The Slope',
    bounds: {x:xmax, y:ymax, v:zmax},
    data: outData
  }

  return jsonver
}

