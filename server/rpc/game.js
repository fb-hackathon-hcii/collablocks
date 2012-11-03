// Define actions which can be called from the client using ss.rpc('demo.ACTIONNAME', param1, param2...)

exports.actions = function(req, res, ss) {

  req.use('session')

  /**
   * Converts an HSL color value to RGB. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes h, s, and l are contained in the set [0, 1]
   *
   * @param   Number  h       The hue
   * @param   Number  s       The saturation
   * @param   Number  l       The lightness
   * @return  String          The hex RGB representation
   */
  function hslToRgb(h, s, l){
      var r, g, b
      if(s == 0){
          r = g = b = l // achromatic
      }else{
          function hue2rgb(p, q, t){
              if(t < 0) t += 1
              if(t > 1) t -= 1
              if(t < 1/6) return p + (q - p) * 6 * t
              if(t < 1/2) return q
              if(t < 2/3) return p + (q - p) * (2/3 - t) * 6
              return p
          }
          var q = l < 0.5 ? l * (1 + s) : l + s - l * s
          var p = 2 * l - q
          r = hue2rgb(p, q, h + 1/3)
          g = hue2rgb(p, q, h)
          b = hue2rgb(p, q, h - 1/3)
      }
      return '#' + (r*255).toString(16) + (g*255).toString(16) + (b * 255).toString(16)
  }

  var getEmptyGrid = function() {
    var g = [] 
    for(var i = 0 i < gameSize.x * gameSize.y i++) {
      g.push(0)
    }
    return g
  }

  var getGameCompletion = function(level, playerdata) {
    var levelTotal = 0
    var deviations = 0
    for (var i=0; i < level.bounds.x * level.bounds.y; i++) {
      levelTotal += level.data[i]
      deviations += abs(level.data[i] - playerdata[i])
    }
    return Math.max(0, 1 - deviations/levelTotal)
  }

  var gameSize = {x:15, y:15}

  /*
  var levels = [
    { name: 'the four towers',
      bounds: {x:15, y:15, v:10},
      data: [0, 5, 6, 6, ... ]
    }
  ]*/

  return {

    registerClient: function() {
      var color = hslToRgb(Math.random(), 0.8, 0.8)
      req.session.color = color
      req.save(function(err){
        return res(true, {color: color})  
      })

    },

    inputChange: function(data) {
      if (req.session && data && data.x && data.y && data.z) {
        var grid = req.session.grid || getEmptyGrid()

        var x = Max(0, Math.min(gameSize.x-1, Math.floor(data.x)))
        var y = Max(0, Math.min(gameSize.y-1, Math.floor(data.y)))
        var z = Max(0, Math.min(1, Math.floor(data.z)))

        if (grid[x*gameSize.x+y-1] != z) {
          grid[x*gameSize.x+y-1] = z
          req.session.save(function(err){
            console.log('Session data saved:', req.session.grid) 
          })
          ss.publish.channel('results', 'setBlock', {x:x, y:y, color: session.color, id: req.sessionId)
        }

          return res(true)
        } else {
          return res(false)
        }
      }
    }



  }
}