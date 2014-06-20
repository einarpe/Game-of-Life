/**
 * @author kubap
 */

Game = {
  area: null,

  areaMode: 0, // 1 - finite, 0 - infinite
  
  // this function speeds up the game
  // gets only alive cells and its neighbours
  optimize: function()
  {
    var data = {}, optimized = [], areaChg = [], chk, alives, pp = {}, optCnt = 0;
    for (var i = 0; i < this.area.width; i++)
    {
      areaChg[i] = [];
      for(var j = 0; j < this.area.height; j++)
      {
        areaChg[i][j] = 0;
        
        // if cell is alive
        if (this.area.get(i, j))
        {
          // get neighbours this cell
          // and count how many of these is alive
          chk = this.neighbours(i, j);
          
          // alives neighbours of cell
          alives = 0;
          
          // push all neighbours
          for (var n = 0, pos; n < chk.length; n++) 
          {
            pos = [chk[n][0], chk[n][1], null];
            
            // count alive neighbours
            if (this.area.get( pos[0], pos[1] ))
              alives++;
            
            // check if position is already saved
            // if not, save it
            if (!pp[pos[0] + "," + pos[1]]) 
            {
              optimized[optimized.length] = pos;
              // to hash table save index of saved position
              pp[pos[0] + "," + pos[1]] = optimized.length - 1;
            }
          }
          
          if (pp[i+","+j])
            optimized[ pp[i+","+j] ][2] = alives;
          else
            optimized[optimized.length] = [ i, j, alives ];
        }
      }
    }
    
    data.optimized = optimized;
    data.areaChg = areaChg;
    data.pp = pp;
    
    delete pp;
    
    return data;
    
  },
  
  // get all neighbours of cell in position (x,y)
  neighbours: function(x, y)
  {
    var n = [], nextX = x + 1, prevX = x - 1, nextY = y + 1, prevY = y - 1;
    
    // if area is infinite
    if (this.areaMode == 0) 
    {
      // check borders
      // X
      if (x == this.area.width - 1) 
	      nextX = 0;
      else if (x == 0) 
		    prevX = this.area.width - 1;
      
      // Y
      if (y == this.area.height - 1) 
	      nextY = 0;
      else if (y == 0) 
	      prevY = this.area.height - 1;
    }
    
    n[0] = [prevX, prevY];
    n[1] = [prevX, y];
    n[2] = [prevX, nextY];
    n[3] = [x, prevY];
    n[4] = [x, nextY];
    n[5] = [nextX, prevY];
    n[6] = [nextX, y];
    n[7] = [nextX, nextY];
    
    // chceck if some neighbour is out of area
    for (var i = 7; i >= 0; i--) 
      if (typeof this.area[n[i][0]] == "undefined" || typeof this.area[n[i][0]][n[i][1]] == "undefined") 
	      n.splice(i, 1);
    
    return n;
  },
  
  check: function(x, y)
  {
    var n = this.neighbours(x, y);
    
    // alive neighbours
    var alives = 0;
    for (var i = 0, a; i < n.length; i++) 
    {
      if (this.area.get(n[i][0], n[i][1])) // if n. is alive
        alives++;
    }
    
    return alives;
    
  },
  
  next: function()
  {
    var data = this.optimize();
    
    // new area
    var areaChg = data.areaChg;
    
    // cells with neighbours
    var optimized = data.optimized;
    
    for (var i = 0, a, x, y; i < optimized.length; i++) 
    {
      x = optimized[i][0];
      y = optimized[i][1];
      
      // check alive neighbours of cell in position (x,y)
      // count of these may be already calculated, if not, do it now
      a = optimized[i][2] != null ? optimized[i][2] : this.check(x, y);
      
      // next state is determined by rule
      areaChg[x][y] = this.rule(this.area.get(x, y), a);
    }
    
    // set the new updated area
    this.area.refresh(areaChg);
    
    return this;
  },
  
  // rule dedicing if cell will be alive or dead
  rule: function(cell, aliveNeighbours){}
  
};


rules = {
  // default Game of Life rule
  conway: function(c, a)
  {
    if (a == 3)
      return 1;
    if (c) 
    {
      if (a == 2 || a == 3) 
        return 1;
      else if (a < 2 || a > 4) 
        return 0;
    }
    // defaults
    return 0;
  },
  
  highlife: function(c, a)
  {
    if (a == 3 || a == 6)
      return 1;
    
    if (c)
    {
      if (a == 2 || a == 3)
        return 1;
    }
    
    return 0;
  },
  
  seeds: function(c, a)
  {
    //In each time step, a cell turns on if it was off but had exactly two neighbors that were on; all other cells turn off.
    if (!c && a == 2)
      return 1;
    
    return 0;  
  },
  
  nodeath: function(c, a)
  {
    // 012345678/3
    if (a == 3)
      return 1;
      
    if (c)
    {
      if (a >= 0 || a < 9)
        return 1;
      else
        return 0;    
    }  
    
    return 0;
  },
  
  parity : function(c, a)
  {
    // if cell is alive, it survive if number of alive cells will be odd
    // if cell is dead, it will be alive if number of alive neighbour cells is odd
    return (a % 2 != Math.abs(c - 1)) ? 1 : 0;
  },
  
  "day&night": function(c, a)
  {
    //34678/3678 	Day & Night
    if (a == 3 || (a >= 6 && a <= 8))
      return 1;
      
    if (c)
    {
      if (a == 3 || a == 4 || (a >= 6 && a <= 8))
        return 1;
    }
    
    return 0;
  },
  
  coral: function(c, a)
  {
    // 45678/3 	Coral
    if (a == 3)
      return 1;
    
    if (c)
    {
      if (a >= 4 && a <= 8)
        return 1;
    }
    return 0;
  }
  
};

str2rule = function(string)
{
  return; // todo
  
  if (typeof string != "string")
    return null;
  
  return function(c, a) {
  
    var parts = string.replace(/[^\d\/]*/gi, "").split("/");
    
    var survive = parts[0].split("");
    for (var i = 0; i < survive.length; i++) 
      survive[i] = Number(survive[i]);
    
    var birth = parts[1].split("");
    for (var i = 0; i < birth.length; i++) 
      birth[i] = Number(birth[i]);
    
    if (birth.indexOf(a) != -1) 
      return 1;
    
    if (c) 
    {
      if (survive.indexOf(a) != -1)
        return 1;
    }
    
    return 0;
    
    
  };
  
};
