var util = require('util')
  , levelGenerator = new require('./../game/levels')
  , redis = require("redis")
  , rclient = redis.createClient()


  rclient.on('error', function(err) {
    console.log('redis error!', err)
  })

// Define actions which can be called from the client using ss.rpc('demo.ACTIONNAME', param1, param2...)
exports.actions = function(req, res, ss) {

  req.use('session')






//rclient.set("string foo", "string bar", redis.print);


  /* CONST */
  var gameSize = {x:16, y:16}
  
  /* GLOBALS */
  var teams = [] 

var getEmptyGrid = function(initVal) {
    var g = [] 
    for(var i = 0; i < gameSize.x * gameSize.y; i++) {
      g.push(initVal)
    }
    return g
  }

  var setupTeams = function(){
    teams.push({name: 'Pirates', members: [], data: getEmptyGrid([])})
    teams.push({name: 'Ninjas', members: [], data: getEmptyGrid([])})
  }
  setupTeams()

  var getGameCompletion = function(level, playerdata) {
    var levelTotal = 0
    var deviations = 0
    for (var i=0; i < level.bounds.x * level.bounds.y; i++) {
      levelTotal += level.data[i]
      deviations += abs(level.data[i] - playerdata[i])
    }
    return Math.max(0, 1 - deviations/levelTotal)
  }


  var getNewLevel = function() {
    //TODO
    var playernum = 4
    var level = levelGenerator.generateLevelOneJSON(gameSize.x, gameSize.y, playernum)
    ss.publish.channel('results', 'newLevel', level)
    return level
  }

  var getNextLevel = function(level_num, playernum, inChannel) {

    var level = {}
    switch(level_num)
    {
      case 0:
        level = levelGenerator.generateTrainingJSON(gameSize.x, gameSize.y, playernum)
        break;

      case 1:
        level = levelGenerator.generateLevelOneJSON(gameSize.x, gameSize.y, playernum)
        break;

      case 2:
        level = levelGenerator.generateLevelTwoJSON(gameSize.x, gameSize.y, playernum)
        break;

      case 3:
        level = levelGenerator.generateLevelThreeJSON(gameSize.x, gameSize.y, playernum)
        break;
    }

    if(inChannel == 'resultsteam1')
      ss.publish.channel(inChannel, 'newLevel', level)
    else
      ss.publish.channel(inChannel, 'newLevel2', level)
    return level
  }





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
      return '#' + Math.floor(r*255).toString(16) + Math.floor(g*255).toString(16) + Math.floor(b * 255).toString(16)
  }


  return {

    activateNextLevel: function(level_num, playernum, inChannel)
    {
      getNextLevel(level_num, playernum, inChannel)
    },

    subscribeView: function() {
      req.session.channel.subscribe('results')
      //getNewLevel()
      return res(true)
    },

    subscribeTeam1: function() {
      req.session.channel.subscribe('resultsteam1')
      getNextLevel(0, 0, 'resultsteam1')
      return res(true)
    },

    subscribeTeam2: function() {
      req.session.channel.subscribe('resultsteam2')
      getNextLevel(0, 0, 'resultsteam2')
      return res(true)
    },

    registerClient: function() {
      if (!req.session.color || !req.session.team) {
        var color = hslToRgb(Math.random(), 0.8, 0.8)
        var team = Math.floor(Math.random()*2)
        req.session.color = color
        req.session.team = team
        req.session.grid = getEmptyGrid(0)
        //teams[team].members.push(req.sessionId)
        req.session.channel.subscribe('team' + team)

        req.session.save(function(err){
          return res(true, {color: color, team: teams[team].name, grid: req.session.grid})  
        })  
      } else {
        return res(true, {color: req.session.color, team: teams[req.session.team].name, grid: req.session.grid})
      }

    },

    inputChange: function(data) {
      //console.log(data)
      if (req.session && data && data.x != null && data.y != null && data.value != null) {
        var grid = req.session.grid || getEmptyGrid(0)

        var x = Math.max(0, Math.min(gameSize.x, Math.floor(data.x)))
        var y = Math.max(0, Math.min(gameSize.y-1, Math.floor(data.y)))
        var z = Math.max(0, Math.min(1, Math.floor(data.value)))

        //if (grid[x*gameSize.x+y] != z) {
          grid[x*gameSize.x+y] = z
          req.session.grid = grid
          //console.log(req.session.grid)
          //console.log('grid updated')
          req.session.save(function(err){
            //console.log('Session data saved:', req.session.color) 
          })
          
          switch (z) {
            case 0: ss.publish.channel('results', 'removeBlock', {x:x, y:y, id: req.sessionId}); break;
            case 1: ss.publish.channel('results', 'setBlock', {x:x, y:y, color: req.session.color.replace(/#/gi, '0x'), id: req.sessionId}); break;
          }
          
        //}

        return res(true)
      } else {
        return res(false)
      }
    }
  }

}