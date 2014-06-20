/**
 * @author kubarek
 */

Area = [];
Area.width = 10;
Area.height = 10;

Area.clear = function()
{
  for(var i = this.length - 1; i >= 0; i--)
    this.splice(i, 1);
};

Area.init = function()
{
  this.clear();
  
  for (var i = 0; i < this.width; i++) 
  {
    this[i] = [];
    for (var j = 0; j < this.height; j++) 
    {
      this[i][j] = this.CELL_DEAD;
    }
  }
  return this;
};

Area.getAlive = function()
{
  var alives = [];
  for (var i = 0; i < this.width; i++) 
    for (var j = 0; j < this.height; j++) 
    {
      if (this.get(i, j) == this.CELL_ALIVE)
	      alives.push([i, j]);
    }
  return alives;
};

Area.set = function(x, y, v)
{
  this[x][y] = v;
};

Area.get = function(x, y)
{
  return this[x][y];
};

Area.setInverse = function(x, y)
{
  return (this[x][y] = Math.abs(this[x][y] - this.CELL_ALIVE));
};

Area.refresh = function(array)
{
  for(var j = 0; j < this.height; j++)
  	for(var i = 0; i < this.width; i++)
  	{
  	  this.set(i, j, array[i][j]);
  	}
  	
};

Area.CELL_ALIVE = 1;
Area.CELL_DEAD = 0;

