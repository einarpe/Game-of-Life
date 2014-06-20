/**
 * @author kubarek
 */
run = false;
delay = 600;
play = function()
{
  if (!run) return;
  
  next();
  setTimeout(play, delay);
};

setPattern = function(name)
{
  if (typeof patterns[name] == "object" && patterns[name] != null) 
  {
    var pattern = patterns[name];
    
    // set width and height of area
    Area.width = pattern.w;
    Area.height = pattern.h;
    
    // and init it again
    Area.init();
    
    // set alive cells
    for (var i = 0, c; i < pattern.p.length; i++) 
    {
      c = pattern.p[i];
      
      Area.set(c[0], c[1], Area.CELL_ALIVE);
    }
    
    // set mode
    Game.areaMode = pattern.m;
    
    // evrything done
    return true;
  }
};

generation = 0;
next = function()
{
  var t = (new Date).getTime();
  generation++;
  Game.next(); 
  Table.render();
  stats((new Date).getTime() - t);
};

stats = function(time)
{
  $T.byId('ijstime').innerHTML = time;
  $T.byId('ialive').innerHTML = Area.getAlive().length;
  $T.byId('igeneration').innerHTML = generation;
  
};

window.onload = function()
{

  Area.init();
  Game.area = Area;
  Game.rule = rules["conway"];
  Table.initialize().build();
  
  $T.byId('play').onclick = function()
  {
    run = !run;
    this.value = run ? ' □ ' : ' > ';
    
    delay = parseInt($T.byId('delay').value);
    
    play();
    
  };
  $T.byId('next').onclick = function()
  {
  	next();
  };
  $T.byId('delay').onchange = function()
  {
    delay = this.value;
  };
  $T.byId('pattern').onchange = function()
  {
    if (setPattern(this.value)) 
    {
      generation = 0;
      Table.clear().build().render();
    }
  }
  ;
  $T.byId('refresh').onclick = function()
  {
    $T.byId('pattern').onchange();
  };
  
  $T.byId('clear').onclick = function()
  {
    $T.byId('clear_form').style.display = 'block';
  };
  
  $T.byId('pattern').onchange.apply({
    value: "glider"
  }, []);
  
  
};
