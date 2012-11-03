exports.generateLevelOneJSON = function(ingridx, ingridz, players)
    {
      var outData = []
      var data = []
      for(var x=0; x<ingridx; x++)
      {
        data[x] = []
        for(var z=0;z<ingridz;z++)
        {
          if((x==ingridx/2 || x==(ingridx/2)-1) && (z==ingridz/2 || z==ingridz/2-1))
          {
            data[x][z] = players
            outData.push(players)
          }
          else
          {
            data[x][z] = 0
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
