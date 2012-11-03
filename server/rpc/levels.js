// Define actions which can be called from the client using ss.rpc('demo.ACTIONNAME', param1, param2...)

exports.actions = function(req, res, ss) {

  return {

    generateLevelOneJSON: function(ingridx, ingridz, players)
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

      return res(jsonver)
    }

  }

}