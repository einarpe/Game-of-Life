/**
 * Simple DOM Tools
 * 
 * It is simple framwework.
 * 
 * @author kubap
 */

$T = function(a){};

$T.byClass = function(c) 
{
  var e = document.getElementsByTagName('*'), found = [], re = new RegExp('[\s]*'+c.replace(/^\./, '')+'[\s]*', "i");
  for(var i = 0; i < e.length; i++)
    if (e[i].className.match(re))
      found.push(e[i]);
  return found;  
};

$T.byId = function(id)
{
  return $T.byId.fn.apply(document.getElementById(id), []);
};

$T.byId.fn = function()
{
  this.addEvent = function()
  {
    
  };
  
  return this;
};
